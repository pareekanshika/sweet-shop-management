import React, { useState } from "react";
import axios from "axios";
import "./sweetmodal.css";

const UpdateSweet = ({ sweet, onClose, token }) => {
  const [formData, setFormData] = useState({
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    quantity: sweet.quantity,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/sweets/${sweet.id}`,
        { ...formData, price: Number(formData.price), quantity: Number(formData.quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Sweet updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Update Sweet 🍭</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
          <div className="modal-btns">
            <button type="submit" className="submit-btn">Update Sweet</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSweet;
