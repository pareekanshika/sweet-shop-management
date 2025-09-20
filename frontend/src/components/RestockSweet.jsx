import React, { useState } from "react";
import axios from "axios";
import "./sweetmodal.css";

const RestockSweet = ({ sweet, onClose, token }) => {
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity <= 0) return alert("Enter a valid quantity");
    try {
      await axios.post(
        `http://localhost:5000/api/sweets/${sweet.id}/restock`,
        { quantity: Number(quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Sweet restocked successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Restock failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Restock Sweet 🍬</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input type="number" placeholder="Quantity to add" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          <div className="modal-btns">
            <button type="submit" className="submit-btn">Restock</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockSweet;
