# User Registration API Documentation

## Endpoint: `/users/register`

### Description
This endpoint allows new users to register in the system. Upon successful registration, a JWT authentication token is generated and returned along with the user details. The password is securely hashed using bcrypt before being stored in the database.

---

## HTTP Method
`POST`

## Endpoint URL
```
/users/register
```

---

## Request Body

The request body must be sent as JSON with the following structure:

### Required Fields

| Field | Type | Description | Validation Rules |
|-------|------|-------------|------------------|
| `fullname.firstname` | String | User's first name | - Required<br>- Minimum 3 characters |
| `email` | String | User's email address | - Required<br>- Must be a valid email format<br>- Must be unique<br>- Minimum 5 characters |
| `password` | String | User's password | - Required<br>- Minimum 5 characters |

### Optional Fields

| Field | Type | Description | Validation Rules |
|-------|------|-------------|------------------|
| `fullname.lastname` | String | User's last name | - Optional<br>- If provided, minimum 3 characters |

### Request Body Example

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

---

## Validation Rules

The endpoint performs the following validations:

1. **Email Validation**
   - Must be a valid email format
   - Error message: `"Invalid Email"`

2. **First Name Validation**
   - Must be at least 3 characters long
   - Error message: `"First and Last name should be atleast 3 characters long"`

3. **Password Validation**
   - Must be at least 5 characters long
   - Error message: `"Password should be atleast 5 characters long"`

4. **Database Level Validations**
   - Email must be unique (duplicate emails will cause an error)
   - First name is required at the database level

---

## Response

### Success Response

**Status Code:** `201 Created`

**Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

**Note:** The password field is not included in the response as it's set to `select: false` in the user model for security purposes.

---

### Error Responses

#### Validation Error

**Status Code:** `400 Bad Request`

**Response Body:**
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "First and Last name should be atleast 3 characters long",
      "path": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

#### Duplicate Email Error

**Status Code:** `500 Internal Server Error` (or as handled by MongoDB)

**Response:** Error message indicating that the email already exists in the database.

---

## Status Codes Summary

| Status Code | Description |
|-------------|-------------|
| `201` | User successfully registered |
| `400` | Validation errors in request data |
| `500` | Server error (e.g., duplicate email, database connection issues) |

---

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with a salt rounds of 10 before being stored in the database.

2. **JWT Token**: Upon successful registration, a JWT token is generated using the user's `_id` and `JWT_SECRET` environment variable. This token can be used for subsequent authenticated requests.

3. **Password Exclusion**: The password field is excluded from query results by default (`select: false`) to prevent accidental exposure.

---

## Example cURL Request

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

---

## Example JavaScript Fetch Request

```javascript
fetch('http://localhost:3000/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullname: {
      firstname: 'John',
      lastname: 'Doe'
    },
    email: 'john.doe@example.com',
    password: 'securePassword123'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    // Store the token for future authenticated requests
    localStorage.setItem('token', data.token);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

---

## Notes

- The endpoint requires the `express-validator` middleware for request validation.
- The JWT token returned in the response should be stored securely (e.g., in localStorage, sessionStorage, or HTTP-only cookies) for authenticated requests.
- The `socketId` field in the user model is reserved for live tracking functionality and will be `null` during registration.

