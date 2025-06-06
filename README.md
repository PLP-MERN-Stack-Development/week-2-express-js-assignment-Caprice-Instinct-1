[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19719663&assignment_repo_type=AssignmentRepo)

# 📦 Express.js RESTful API Assignment – Product Management API

This project is a RESTful API built with **Express.js**, allowing users to manage a list of products. It demonstrates key concepts such as routing, custom middleware, error handling, and advanced features like filtering, search, and pagination.

---

## 🚀 Project Setup

### ✅ Requirements

- Node.js v18+
- npm
- Postman, Insomnia, or curl for testing API endpoints

### 📁 Steps to Set Up the Project

1. Clone the repository created by GitHub Classroom
2. Navigate to the project directory
3. Install dependencies
4. Create a `.env` file using `.env.example` as a guide
5. Set the `API_KEY` and optionally the `PORT`
6. Start the server

---

## 📘 API Documentation

### Base URL

`http://localhost:3000/api/products`

---

### 🔹 Endpoints

| Method | Endpoint               | Description                  |
|--------|------------------------|------------------------------|
| GET    | `/api/products`        | List all products            |
| GET    | `/api/products/:id`    | Get a specific product       |
| POST   | `/api/products`        | Create a new product         |
| PUT    | `/api/products/:id`    | Update an existing product   |
| DELETE | `/api/products/:id`    | Delete a product             |
| GET    | `/api/products/search` | Search products by name      |
| GET    | `/api/products/stats`  | Get product count per category |

---

## 🔧 Features Implemented

### ✅ Middleware

- Logger – Logs method, URL, and timestamp of requests
- JSON Parser – Parses incoming JSON request bodies
- API Key Authentication – Verifies requests using `x-api-key` header
- Validation – Validates product data for `POST` and `PUT` routes

### ✅ Error Handling

- Centralized error handler with custom error classes:
  - `ValidationError`
  - `UnauthorizedError`
  - `NotFoundError`
- Handles all unexpected and operational errors
- Returns appropriate status codes and messages

### ✅ Advanced Features

- Filtering – Filter products by category using query parameter
- Pagination – Use `page` and `limit` query parameters
- Search – Search products by name using `q` query parameter
- Statistics – Get count of products by category

---

## 📦 Sample Requests & Responses

### ➕ Create Product – `POST /api/products`

**Request Body:**

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "price": 29.99,
  "category": "electronics",
  "inStock": true
}
```
**Response:**
```json
{
  "id": "f2a1c3a9-8e2f-4c2c-a8c7-5d5e61712c5f",
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "price": 29.99,
  "category": "electronics",
  "inStock": true
}
```


### Folder Structure
```
.
├── server.js               # Main Express server
├── .env.example            # Example environment variables
├── package.json            # Project metadata and scripts
├── README.md               # Project documentation

```