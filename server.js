// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Custom logger middleware for logging request method, URL and timestamp
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

// Authentication middleware
const validAPIKey = process.env.API_KEY;

if (!validAPIKey) {
  console.error("ERROR: API_KEY is not set in .env.local");
}

app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== validAPIKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// Validation middleware
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res
      .status(400)
      .json({ error: "Product name is required and must be a string." });
  }

  if (typeof description !== "string" || description.trim() === "") {
    return res
      .status(400)
      .json({ error: "Description is required and must be a string." });
  }

  if (typeof price !== "number" || price < 0) {
    return res
      .status(400)
      .json({ error: "Price is required and must be a non-negative number." });
  }

  if (typeof category !== "string" || category.trim() === "") {
    return res
      .status(400)
      .json({ error: "Category is required and must be a string." });
  }

  if (typeof inStock !== "boolean") {
    return res
      .status(400)
      .json({ error: "inStock is required and must be a boolean." });
  }

  next();
}

// Error handling
// 
// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Product API! Go to /api/products to see all products."
  );
});

// Hello route
app.get("/hello", (req, res) => {
  res.send("Hello world!");
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});
// GET /api/products/:id - Get a specific product
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product missing" });
  res.json(product);
});
// POST /api/products - Create a new product
app.post("/api/products", validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});
// PUT /api/products/:id - Update a product
app.put("/api/products/:id", validateProduct, (req, res) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product) return res.status(404).json("Product not found");

  const { name, description, price, category, inStock } = req.body;
  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.category = category ?? product.category;
  product.inStock = inStock ?? product.inStock;

  res.json(product);
});
// DELETE /api/products/:id - Delete a product
app.delete("/api/products/:id", (req, res) => {
  const productIndex = products.findIndex((p) => p.id === req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Remove product from array and get the deleted product
  const deletedProduct = products.splice(productIndex, 1)[0];

  res.json(deletedProduct);
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
