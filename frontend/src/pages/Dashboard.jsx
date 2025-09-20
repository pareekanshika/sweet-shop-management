import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AddSweet from "../components/AddSweet";
import UpdateSweet from "../components/UpdateSweet";
import RestockSweet from "../components/RestockSweet";
import "./Dashboard.css"; // Make sure this CSS exists

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = location.state || {};

  // ---------- Hooks at the top ----------
  const [sweets, setSweets] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showRestock, setShowRestock] = useState(false);
  const [search, setSearch] = useState("");

  const authHeader = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchSweets = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sweets", { headers: authHeader });
      setSweets(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [authHeader]);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  // ---------- Unauthorized check ----------
  if (!user) {
    return (
      <div className="unauthorized">
        <h2>Unauthorized Access 🚫</h2>
        <p>Please <a href="/login">login</a> to continue.</p>
      </div>
    );
  }

  // ---------- Handlers ----------
  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sweets/search?name=${search}`, { headers: authHeader });
      setSweets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurchase = async (sweetId) => {
    const qty = prompt("Enter quantity to purchase:");
    if (!qty || qty <= 0) return;
    try {
      await axios.post(
        `http://localhost:5000/api/sweets/${sweetId}/purchase`,
        { quantity: Number(qty) },
        { headers: authHeader }
      );
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  const handleDelete = async (sweetId) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/sweets/${sweetId}`, { headers: authHeader });
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // ---------- JSX ----------
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🍬 Sweet Shop Dashboard</h1>
        <button className="logout-btn" onClick={() => navigate("/login")}>Logout</button>
      </header>

      <div className="search-add-container">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sweets..."
          className="search-input"
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
        {user.isAdmin && (
          <button className="add-btn" onClick={() => setShowAdd(true)}>Add Sweet</button>
        )}
      </div>

      <div className="sweets-grid">
        {sweets.length === 0 && <p>No sweets found 🍭</p>}
        {sweets.map((sweet) => (
          <div key={sweet.id} className="sweet-card">
            <h3>{sweet.name}</h3>
            <p>Category: {sweet.category}</p>
            <p>Price: ${sweet.price}</p>
            <p>Quantity: {sweet.quantity}</p>
            <div className="card-buttons">
              <button
                className="purchase-btn"
                onClick={() => handlePurchase(sweet.id)}
                disabled={sweet.quantity === 0}
              >
                Purchase
              </button>
              {user.isAdmin && (
                <>
                  <button className="update-btn" onClick={() => { setSelectedSweet(sweet); setShowUpdate(true); }}>Update</button>
                  <button className="restock-btn" onClick={() => { setSelectedSweet(sweet); setShowRestock(true); }}>Restock</button>
                  <button className="delete-btn" onClick={() => handleDelete(sweet.id)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAdd && <AddSweet onClose={() => { setShowAdd(false); fetchSweets(); }} token={token} />}
      {showUpdate && selectedSweet && <UpdateSweet sweet={selectedSweet} onClose={() => { setShowUpdate(false); fetchSweets(); }} token={token} />}
      {showRestock && selectedSweet && <RestockSweet sweet={selectedSweet} onClose={() => { setShowRestock(false); fetchSweets(); }} token={token} />}
    </div>
  );
};

export default Dashboard;
