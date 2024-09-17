# Service 1 Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Technologies Used](#technologies-used)
3. [Database Schema](#database-schema)
   - [Customer Model](#customer-model)
   - [Account Model](#account-model)
   - [Transaction Model](#transaction-model)
4. [API Endpoints](#api-endpoints)
   - [Customer Endpoints](#customer-endpoints)
   - [Account Endpoints](#account-endpoints)
   - [Transaction Endpoints](#transaction-endpoints)
5. [Error Handling](#error-handling)
6. [Testing](#testing)
7. [Running the Project](#running-the-project)

---

## Introduction

**Service 1** is a financial application that provides customer management, account management, and transaction services. It enables users to create accounts, perform transactions between accounts, and view transaction histories.

---

## Technologies Used

- **Node.js**: Backend server framework
- **Express.js**: Web framework for Node.js
- **Mongoose**: ODM for MongoDB
- **MongoDB**: Database to store customer, account, and transaction details
- **Jest**: Testing framework

---

## Database Schema

### 1. Customer Model

- **Collection**: `customers`
- **Fields**:
  - `firstName`: String, required
  - `lastName`: String, required
  - `email`: String, required, unique
  - `password`: String, required, hashed
  - `accounts`: Array of account IDs (references `accounts` collection)

```ts
const CustomerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }]
});
```

### 2. Account Model

- **Collection**: `accounts`
- **Fields**:
  - `accountNumber`: String, required, unique
  - `balance`: Number, required, default: 0
  - `customerId`: ObjectId, reference to `Customer`
  - `createdAt`: Date, default: now

```ts
const AccountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, required: true, default: 0 },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### 3. Transaction Model

- **Collection**: `transactions`
- **Fields**:
  - `fromAccount`: String, required
  - `toAccount`: String, required
  - `amount`: Number, required
  - `status`: String (e.g., `completed`, `failed`)
  - `createdAt`: Date, default: now

```ts
const TransactionSchema = new mongoose.Schema({
  fromAccount: { type: String, required: true },
  toAccount: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});
```

---

## API Endpoints

### 1. Customer Endpoints

#### **POST /api/customers/register**
- **Description**: Register a new customer.
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "605c72...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
  ```

#### **GET /api/customers/:id**
- **Description**: Get customer details by ID.
- **Response**:
  ```json
  {
    "_id": "605c72...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "accounts": []
  }
  ```

### 2. Account Endpoints

#### **POST /api/accounts**
- **Description**: Create a new account for an existing customer.
- **Request Body**:
  ```json
  {
    "customerId": "605c72...",
    "initialBalance": 1000
  }
  ```
- **Response**:
  ```json
  {
    "accountNumber": "ACC123456",
    "balance": 1000,
    "customerId": "605c72..."
  }
  ```

#### **GET /api/accounts/:id**
- **Description**: Get account details by ID.

### 3. Transaction Endpoints

#### **POST /api/transactions**
- **Description**: Create a transaction (transfer between accounts).
- **Request Body**:
  ```json
  {
    "fromAccount": "ACC123456",
    "toAccount": "ACC654321",
    "amount": 200
  }
  ```
- **Response**:
  ```json
  {
    "_id": "606d7c...",
    "fromAccount": "ACC123456",
    "toAccount": "ACC654321",
    "amount": 200,
    "status": "completed"
  }
  ```

#### **GET /api/transactions/:accountNumber**
- **Description**: Get all transactions related to an account.

---

## Error Handling

- **404 Not Found**: For missing accounts, customers, or transactions.
- **400 Bad Request**: For insufficient funds, missing fields, etc.
- **500 Server Error**: For unexpected server-side errors.

---

## Testing

- **Jest** is used to perform unit and integration testing.
- Key tests include:
  - Creating customers and accounts
  - Performing transactions and checking balances
  - Handling errors (insufficient funds, invalid accounts, etc.)

---

## Running the Project

### Prerequisites:
- **Node.js** and **npm** installed.
- **MongoDB** running locally or in the cloud.

### Steps to Run:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   - Set `MONGO_URI` for your MongoDB connection string.

3. **Run the Application**:
   ```bash
   npm run dev
   ```

4. **Run Tests**:
   ```bash
   npm test
   ```

--- 

This documentation provides a comprehensive overview of **Service 1**, focusing on its architecture, key models, endpoints, and testing strategy.