# 📚 Library Management API

A RESTful API for managing a library system built with Node.js, Express, and MongoDB. It supports book management, student and staff registration, borrowing and returning books, JWT authentication, and role-based access control.

---

## 🛠 Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **Database** — MongoDB with Mongoose
- **Authentication** — JSON Web Tokens (JWT)
- **Password Hashing** — bcrypt

---

## ⚙️ Setup Steps

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/library-management-api.git
cd library-management-api
```

### 2. Install dependencies
```bash
npm install express mongoose jsonwebtoken bcrypt dotenv
```

### 3. Create your `.env` file
Create a `.env` file in the root of your project and add the following:
```
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/libraryDB
PORT=3000
JWT_SECRET=yourSecretKeyHere
JWT_EXPIRES_IN=1d
```

### 4. Start the server
```bash
node app .js
```

Or with nodemon for development:
```bash
nodemon --env-file=.env app.js
```

### 5. Confirm the server is running
You should see:
```
MongoDB connected successfully
Server running on port 3000
```

---

## 📁 Project Structure

```
library-management-api/
├── app.js
├── config/
│   └── database.js
├── controllers/
│   ├── loginController.js
│   ├── authorController.js
│   ├── bookController.js
│   ├── studentController.js
│   └── staffController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── validate.js
├── models/
│   ├── author.js
│   ├── book.js
│   ├── student.js
│   └── staff.js
├── routes/
│   ├── loginRoutes.js
│   ├── authorRoutes.js
│   ├── bookRoutes.js
│   ├── studentRoutes.js
│   └── staffRoutes.js
├── .env
├── .gitignore
└── package.json
```

---

## 🔐 Authentication

This API uses JWT (JSON Web Token) authentication. After logging in, include the token in the `Authorization` header of every protected request:

```
Authorization: Bearer your_token_here
```

### Role Permissions

| Role        | Permissions                                              |
|-------------|----------------------------------------------------------|
| `admin`     | Full access to everything                                |
| `librarian` | Create/update books, authors, students, borrow, return   |
| `student`   | View their own profile                                   |

---

## 📮 API Documentation

**Base URL:** `http://localhost:3000`

---

### 🔑 Login Endpoints

#### Student Login
```
POST /login/student/login
```
Body:
```json
{
    "email": "emeka.okafor@student.edu",
    "password": "Library@1"
}
```
Response:
```json
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
        "id": "664f1a2b3c4d5e6f7a8b9c0d",
        "name": "Emeka Okafor",
        "email": "emeka.okafor@student.edu",
        "studentId": "STU001"
    }
}
```

---

#### Staff Login
```
POST /login/staff/login
```
Body:
```json
{
    "email": "femi.adeyinka@library.com",
    "password": "Library@1"
}
```
Response:
```json
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
        "id": "664f1a2b3c4d5e6f7a8b9c0d",
        "name": "Mr. Femi Adeyinka",
        "email": "femi.adeyinka@library.com",
        "staffId": "STF001",
        "role": "admin"
    }
}
```

---

#### Logout
```
POST /login/logout
```
Headers:
```
Authorization: Bearer your_token_here
```
Response:
```json
{
    "message": "Logged out successfully"
}
```

---

#### Refresh Token
```
POST /login/refresh-token
```
Headers:
```
Authorization: Bearer your_token_here
```
Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Get Current User
```
GET /login/me
```
Headers:
```
Authorization: Bearer your_token_here
```
Response:
```json
{
    "data": {
        "id": "664f1a2b3c4d5e6f7a8b9c0d",
        "name": "Emeka Okafor",
        "email": "emeka.okafor@student.edu",
        "studentId": "STU001"
    }
}
```

---

### ✍️ Author Endpoints
> All endpoints require authentication

#### Create Author
```
POST /authors
```
Access: `admin`, `librarian`

Body:
```json
{
    "name": "Chinua Achebe",
    "bio": "Nigerian author and poet"
}
```
Response:
```json
{
    "message": "Author created",
    "data": {
        "_id": "664f1a2b3c4d5e6f7a8b9c0d",
        "name": "Chinua Achebe",
        "bio": "Nigerian author and poet",
        "createdAt": "2026-05-06T10:30:00.000Z"
    }
}
```

---

#### Get All Authors
```
GET /authors
```
Access: All authenticated users

Response:
```json
{
    "data": [
        {
            "_id": "664f1a2b3c4d5e6f7a8b9c0d",
            "name": "Chinua Achebe",
            "bio": "Nigerian author and poet"
        }
    ]
}
```

---

#### Get Single Author
```
GET /authors/:id
```
Access: All authenticated users

---

#### Update Author
```
PUT /authors/:id
```
Access: `admin`, `librarian`

Body:
```json
{
    "name": "Chinua Achebe",
    "bio": "Updated bio here"
}
```

---

#### Delete Author
```
DELETE /authors/:id
```
Access: `admin` only

---

### 📖 Book Endpoints
> All endpoints require authentication

#### Create Book
```
POST /books
```
Access: `admin`, `librarian`

Body:
```json
{
    "title": "Things Fall Apart",
    "ISBN": "978-0-385-47454-2",
    "authors": ["664f1a2b3c4d5e6f7a8b9c0d"]
}
```
Response:
```json
{
    "message": "Book created",
    "data": {
        "_id": "664f1a2b3c4d5e6f7a8b9c0d",
        "title": "Things Fall Apart",
        "ISBN": "978-0-385-47454-2",
        "status": "IN",
        "authors": ["664f1a2b3c4d5e6f7a8b9c0d"]
    }
}
```

---

#### Get All Books
```
GET /books
```
Access: All authenticated users

Supports pagination:
```
GET /books?page=1&limit=5
```

Response:
```json
{
    "totalBooks": 9,
    "totalPages": 2,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPrevPage": false,
    "data": [...]
}
```

---

#### Get Single Book
```
GET /books/:id
```
Access: All authenticated users

Response:
```json
{
    "data": {
        "_id": "664f1a2b3c4d5e6f7a8b9c0d",
        "title": "Things Fall Apart",
        "status": "OUT",
        "authors": [{ "name": "Chinua Achebe" }],
        "borrowedBy": { "name": "Emeka Okafor" },
        "issuedBy": { "name": "Mr. Femi Adeyinka" }
    },
    "overdueInfo": {
        "isOverdue": false,
        "overdueDays": 0
    }
}
```

---

#### Update Book
```
PUT /books/:id
```
Access: `admin`, `librarian`

Body:
```json
{
    "title": "Things Fall Apart",
    "ISBN": "978-0-385-47454-2",
    "authors": ["664f1a2b3c4d5e6f7a8b9c0d"]
}
```

---

#### Delete Book
```
DELETE /books/:id
```
Access: `admin` only

---

#### Borrow Book
```
PATCH /books/:id/borrow
```
Access: `admin`, `librarian`

Body:
```json
{
    "studentId": "664f1a2b3c4d5e6f7a8b9c0d",
    "staffId": "664f1a2b3c4d5e6f7a8b9c0e",
    "returnDate": "2026-06-01"
}
```
Response:
```json
{
    "message": "Book borrowed successfully",
    "data": {
        "book": "Things Fall Apart",
        "borrowedBy": {
            "name": "Emeka Okafor",
            "email": "emeka.okafor@student.edu",
            "studentId": "STU001"
        },
        "issuedBy": {
            "name": "Mr. Femi Adeyinka",
            "email": "femi.adeyinka@library.com",
            "staffId": "STF001",
            "role": "admin"
        },
        "issueDate": "2026-05-06T10:30:00.000Z",
        "returnDate": "2026-06-01T00:00:00.000Z"
    }
}
```

---

#### Return Book
```
PATCH /books/:id/return
```
Access: `admin`, `librarian`

No body required.

Response:
```json
{
    "message": "Book returned successfully",
    "returnedAt": "2026-05-08T14:30:00.000Z",
    "overdue": false,
    "overdueDays": 0
}
```

---

#### Search Books by Title
```
GET /books/search/title?title=Things
```
Access: All authenticated users

Response:
```json
{
    "total": 1,
    "data": [
        {
            "title": "Things Fall Apart",
            "authors": [{ "name": "Chinua Achebe" }]
        }
    ]
}
```

---

#### Search Books by Author
```
GET /books/search/author?name=Achebe
```
Access: All authenticated users

Response:
```json
{
    "total": 3,
    "data": [...]
}
```

---

### 🎓 Student Endpoints
> All endpoints require authentication

#### Create Student
```
POST /students
```
Access: `admin`, `librarian`

Body:
```json
{
    "name": "Emeka Okafor",
    "email": "emeka.okafor@student.edu",
    "studentId": "STU001",
    "password": "Library@1"
}
```
Response:
```json
{
    "message": "Student created",
    "data": {
        "_id": "664f1a2b3c4d5e6f7a8b9c0d",
        "name": "Emeka Okafor",
        "email": "emeka.okafor@student.edu",
        "studentId": "STU001"
    }
}
```

---

#### Get All Students
```
GET /students
```
Access: `admin`, `librarian`

---

#### Get Single Student
```
GET /students/:id
```
Access: All authenticated users

---

### 👨‍💼 Staff Endpoints
> All endpoints require authentication

#### Create Staff
```
POST /staff
```
Access: `admin` only

Body:
```json
{
    "name": "Mr. Femi Adeyinka",
    "email": "femi.adeyinka@library.com",
    "staffId": "STF001",
    "role": "admin",
    "password": "Library@1"
}
```

---

#### Get All Staff
```
GET /staff
```
Access: `admin`, `librarian`

---

#### Get Single Staff
```
GET /staff/:id
```
Access: `admin`, `librarian`

---

#### Search Staff by Name
```
GET /staff/search?name=Femi
```
Access: `admin` only

---

#### Delete Staff
```
DELETE /staff/:id
```
Access: `admin` only

---

## ⚠️ Error Responses

| Status Code | Meaning                        |
|-------------|--------------------------------|
| 400         | Bad request / validation error |
| 401         | Unauthorized / invalid token   |
| 403         | Forbidden / insufficient role  |
| 404         | Resource not found             |
| 500         | Internal server error          |

---

## 🔒 Password Requirements

Passwords must contain:
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (`@$!%*?&`)

Example of a valid password: `Library@1`

---

## 📝 Notes

- Tokens expire after `1d` by default. Use `/login/refresh-token` to get a new one
- The `.env` file must never be committed to GitHub
- Pagination is available on `GET /books` using `?page=1&limit=10`
- Overdue information is automatically calculated on `GET /books` and `GET /books/:id`
