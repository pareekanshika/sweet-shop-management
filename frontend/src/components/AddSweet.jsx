import React, { useState } from "react";
import axios from "axios";
import "./sweetmodal.css";

const AddSweet = ({ onClose, token }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/sweets",
        {
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Sweet added successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Add sweet failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add New Sweet 🍬</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
          <div className="modal-btns">
            <button type="submit" className="submit-btn">Add Sweet</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSweet;
