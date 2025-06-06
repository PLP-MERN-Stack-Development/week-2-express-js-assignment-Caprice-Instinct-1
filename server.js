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
    return next(new UnauthorizedError());
  }
  next();
});

// Validation middleware
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return next(
      new ValidationError("Product name is required and must be a string.")
    );
  }

  if (typeof description !== "string" || description.trim() === "") {
    return next(
      new ValidationError("Description is required and must be a string.")
    );
  }

  if (typeof price !== "number" || price < 0) {
    return next(
      new ValidationError(
        "Price is required and must be a non-negative number."
      )
    );
  }

  if (typeof category !== "string" || category.trim() === "") {
    return next(
      new ValidationError("Category is required and must be a string.")
    );
  }

  if (typeof inStock !== "boolean") {
    return next(
      new ValidationError("inStock is required and must be a boolean.")
    );
  }

  next();
}

// Error handling
// Global error handling middleware
// Custom error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = "Invalid data") {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

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

// GET /api/products - Get all products with filtering and pagination
app.get("/api/products", (req, res, next) => {
  try {
    let filteredProducts = [...products];

    if (req.query.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      page,
      limit,
      total: filteredProducts.length,
      products: paginatedProducts,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Get a specific product
app.get("/api/products/:id", (req, res, next) => {
  try {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return next(new NotFoundError("Product not found"));
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products - Create a new product
app.post("/api/products", validateProduct, (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update a product
app.put("/api/products/:id", validateProduct, (req, res, next) => {
  try {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return next(new NotFoundError("Product not found"));

    const { name, description, price, category, inStock } = req.body;
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.inStock = inStock ?? product.inStock;

    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete a product
app.delete("/api/products/:id", (req, res, next) => {
  try {
    const productIndex = products.findIndex((p) => p.id === req.params.id);
    if (productIndex === -1) {
      return next(new NotFoundError("Product not found"));
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    res.json(deletedProduct);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/search?q=productname - Search products by name
app.get("/api/products/search", (req, res, next) => {
  try {
    const q = req.query.q;
    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Search query (q) is required." });
    }

    const matchedProducts = products.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );

    res.json(matchedProducts);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/stats - Get product statistics (count by category)
app.get("/api/products/stats", (req, res, next) => {
  try {
    const stats = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    res.json(stats);
  } catch (err) {
    next(err);
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errorType: err.name,
    });
  }

  console.error("UNEXPECTED ERROR:", err);

  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
