<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://circleci.com/gh/nestjs/nest.svg?style=shield
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://nestjs.com" target="_blank">Documentation</a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
# 🧠 AI-Powered Product Management API

A scalable, maintainable, and feature-rich product management system powered by NestJS and enhanced with AI-based description standardization and similarity search.

---

## ✅ Project Checklist

- [x] JWT Authentication & Authorization System
- [x] Role-Based Access Control (RBAC) - Admin / User
- [x] Product CRUD (Create, Read, Update, Delete)
- [x] AI-based Product Description Standardization
- [x] Store Original + Standardized Descriptions
- [x] API Documentation with Swagger
- [x] Unit & Integration Testing with Jest
- [x] Environment Variables Template (`.env.example`)
- [x] Dockerized Application _(optional)_
- [x] Embedded Vector Storage _(optional)_
- [x] Similar Products API _(optional)_

---

## 🚀 Tech Stack

| Technology     | Purpose                                |
| -------------- | -------------------------------------- |
| **NestJS**     | Backend framework (Scalable & Modular) |
| **TypeScript** | Type-safe development                  |
| **MongoDB**    | Primary database                       |
| **Jest**       | Unit & Integration testing             |
| **Docker**     | Containerization _(optional)_          |

---

## 📦 Dependencies

| Package                | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `mongoose`             | ODM for MongoDB                                 |
| `decimal.js`           | High-precision decimal math (prevent overflows) |
| `argon2`               | Secure password hashing                         |
| `@xenova/transformers` | AI transformers for NLP and description cleanup |
| `@nestjs/jwt`          | JWT support for authentication                  |
| `@nestjs/swagger`      | OpenAPI (Swagger) documentation generator       |

---

## 🔐 Features

- 🔑 **JWT Authentication / Authorization**
- 🛡 **Role-Based Access Control (RBAC)**
- 🧠 **AI Description Standardization**
- 📦 **Product Management APIs**
- 🧮 **Embedded Vector Storage (Optional)**
- 🤝 **Similar Products API (Optional)**

---

## 📘 API Endpoints

### 🧑‍💼 Auth & User Management

| Method | Endpoint       | Description             | Auth Required |
| ------ | -------------- | ----------------------- | ------------- |
| POST   | `/auth/signup` | Register new user       | ❌            |
| POST   | `/auth/signin` | Login and receive token | ❌            |
| POST   | `/auth/token`  | get New token For       | ❌            |

---

# 🧠 AI-Powered Product Management API

> ⚙️ **Note:** This project uses an **event-driven architecture** — when a new product is created, its description is automatically standardized using AI without requiring a separate endpoint.
> 🧠 Description standardization and embedding are performed **automatically** in the background using async event listeners.

> 🌍 **Vector search** is optimized using **MongoDB Atlas** with embedded vector storage support — please ensure you are using Atlas, not a local instance.

> ⏳ **Important:** After the initial start, the app will **download AI models** required for embedding and standardization (via `@xenova/transformers`). This may take some time, so please be patient on first run.

### 📦 Product Management

| Method | Endpoint                | Description        | Role   |
| ------ | ----------------------- | ------------------ | ------ |
| POST   | `/products`             | Create new product | Admin  |
| GET    | `/products`             | Get all products   | Public |
| GET    | `/products/:id`         | Get product by ID  | Public |
| GET    | `/products/:id/similar` | Delete product     | Admin  |
| PUT    | `/products/:id`         | Update product     | Admin  |
| DELETE | `/products/:id`         | Delete product     | Admin  |

---

## 🧪 Testing

- ✅ Unit Tests for Services and Controllers
- ✅ Integration Tests for 5 Routes
- ✅ Mock External Services (e.g., MongoDB, AI APIs)
- ✅ Run all tests:
  ```bash
  npm run test
````

## ⚙️ Setup Instructions

# 1. Clone the repository

git clone https://github.com/yourusername/ai-product-api.git .

# 2. Install dependencies

npm install

# 3. Copy environment variables

cp .env.example .env

# 4. Run the app

npm start:dev
