const Sweet = require("../models/sweets");
const { Op } = require("sequelize");

// Add a new sweet
const addSweet = async (req, res) => {
  const { name, category, price, quantity } = req.body;
  try {
    const newSweet = await Sweet.create({ name, category, price, quantity });
    res.status(201).json(newSweet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// View all sweets
const getAllSweets = async (req, res) => {
  const sweets = await Sweet.findAll();
  res.json(sweets);
};

// Search sweets
const searchSweets = async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  let where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (category) where.category = category;
  if (minPrice || maxPrice) where.price = {};
  if (minPrice) where.price[Op.gte] = Number(minPrice);
  if (maxPrice) where.price[Op.lte] = Number(maxPrice);

  const results = await Sweet.findAll({ where });
  res.json(results);
};

// Update sweet
const updateSweet = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, quantity } = req.body;

  const sweet = await Sweet.findByPk(id);
  if (!sweet) return res.status(404).json({ message: "Sweet not found" });

  await sweet.update({ name, category, price, quantity });
  res.json({ message: "Sweet updated", sweet });
};

// Delete sweet
const deleteSweet = async (req, res) => {
  const { id } = req.params;
  const sweet = await Sweet.findByPk(id);
  if (!sweet) return res.status(404).json({ message: "Sweet not found" });

  await sweet.destroy();
  res.json({ message: "Sweet deleted" });
};

// Purchase sweet
const purchaseSweet = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const sweet = await Sweet.findByPk(id);
  if (!sweet) return res.status(404).json({ message: "Sweet not found" });
  if (quantity > sweet.quantity) return res.status(400).json({ message: "Not enough stock" });

  sweet.quantity -= quantity;
  await sweet.save();

  res.json({ message: `Purchased ${quantity} item(s)`, sweet });
};

// Restock sweet
const restockSweet = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const sweet = await Sweet.findByPk(id);
  if (!sweet) return res.status(404).json({ message: "Sweet not found" });

  sweet.quantity += quantity;
  await sweet.save();

  res.json({ message: `Restocked ${quantity} item(s)`, sweet });
};

module.exports = {
  addSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};
