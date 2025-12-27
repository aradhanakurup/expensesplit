# ExpenseSplit API Documentation

## Base URL
```
https://api.expensesplit.com/v1
```

## Authentication
All API requests require JWT authentication token in the Authorization header.

```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### Users

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe",
  "phone": "+1234567890"
}

Response: 201 Created
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "token": "eyJhbGc..."
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

Response: 200 OK
{
  "token": "eyJhbGc...",
  "user": {...}
}
```

### Groups

#### Create Group
```
POST /groups
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "name": "Weekend Trip",
  "description": "Travel expenses",
  "members": [2, 3, 4]
}

Response: 201 Created
```

#### Get Group Expenses
```
GET /groups/{groupId}/expenses
Authorization: Bearer <TOKEN>

Response: 200 OK
[
  {
    "id": 1,
    "description": "Hotel",
    "amount": 500,
    "paid_by": 1,
    "date": "2024-01-15T10:00:00Z"
  }
]
```

### Expenses (Ledger)

#### Add Expense
```
POST /expenses
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "group_id": 1,
  "amount": 500,
  "description": "Hotel booking",
  "category": "accommodation",
  "splits": [
    {"user_id": 1, "amount": 250},
    {"user_id": 2, "amount": 250}
  ]
}

Response: 201 Created
```

#### Get Settlement
```
GET /groups/{groupId}/settlement
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "balances": [
    {"debtor_id": 2, "creditor_id": 1, "amount": 250},
    {"debtor_id": 3, "creditor_id": 1, "amount": 500}
  ]
}
```

### Payments

#### Initiate Payment
```
POST /payments
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "from_user_id": 2,
  "to_user_id": 1,
  "amount": 250,
  "group_id": 1
}

Response: 201 Created
{
  "order_id": "order_1234567890",
  "amount": 250,
  "currency": "INR",
  "razorpay_key": "rzp_live_xxx"
}
```

#### Verify Payment
```
POST /payments/verify
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "razorpay_order_id": "order_1234567890",
  "razorpay_payment_id": "pay_1234567890",
  "razorpay_signature": "signature"
}

Response: 200 OK
```

## Error Responses

```
400 Bad Request
{
  "error": "Invalid request",
  "message": "Required field missing"
}

401 Unauthorized
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}

500 Internal Server Error
{
  "error": "Server error",
  "message": "Something went wrong"
}
```

## Rate Limiting
API requests are limited to 100 requests per minute per user.

## Webhooks
Payment status webhooks will be sent to configured webhook URL for transaction updates.
