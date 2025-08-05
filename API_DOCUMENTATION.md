# Coursify API Documentation

## Base URL
```
http://localhost:4000
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Data Models

### User
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT", // "STUDENT", "INSTRUCTOR", "ADMIN"
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Course
```json
{
  "id": 1,
  "title": "JavaScript Fundamentals",
  "description": "Learn the basics of JavaScript",
  "price": 99.99,
  "category": "Programming",
  "imageUrl": "https://example.com/image.jpg",
  "averageRating": 4.5,
  "instructorId": 1,
  "instructor": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Lesson
```json
{
  "id": 1,
  "title": "Introduction to JavaScript",
  "videoUrl": "https://example.com/video.mp4",
  "order": 1,
  "courseId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Enrollment
```json
{
  "id": 1,
  "userId": 1,
  "courseId": 1,
  "enrollmentDate": "2024-01-01T00:00:00.000Z",
  "progress": {
    "completedLessons": [1, 2, 3],
    "currentLesson": 4,
    "completedAt": null
  },
  "course": {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "instructor": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123!"
}
```

**Response (200):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `400` - Password validation failed (must be 8+ chars with special character)
- `409` - User already exists

### 2. Login User
**POST** `/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123!"
}
```

**Response (200):**
```json
{
  "message": "login success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "STUDENT"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `400` - Invalid credentials
- `401` - Invalid credentials
- `429` - Too many login attempts (rate limited)

### 3. Get Current User
**GET** `/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "You are authenticated!",
  "user": {
    "userId": 1,
    "role": "STUDENT"
  }
}
```

### 4. Refresh Token
**POST** `/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Forgot Password
**POST** `/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset token generated",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 6. Reset Password
**POST** `/reset-password`

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "newpassword123!"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

## Course Endpoints

### 1. Get All Courses
**GET** `/api/v1/courses`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search in title and description
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Example Request:**
```
GET /api/v1/courses?page=1&limit=5&category=Programming&search=javascript&minPrice=50&maxPrice=200
```

**Response (200):**
```json
{
  "courses": [
    {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "description": "Learn the basics of JavaScript",
      "price": 99.99,
      "category": "Programming",
      "imageUrl": "https://example.com/image.jpg",
      "averageRating": 4.5,
      "instructor": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "_count": {
        "lessons": 10,
        "enrollments": 25
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 50,
    "pages": 10
  }
}
```

### 2. Get Course by ID
**GET** `/api/v1/courses/:id`

**Response (200):**
```json
{
  "course": {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "description": "Learn the basics of JavaScript",
    "price": 99.99,
    "category": "Programming",
    "imageUrl": "https://example.com/image.jpg",
    "averageRating": 4.5,
    "instructor": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "lessons": [
      {
        "id": 1,
        "title": "Introduction to JavaScript",
        "videoUrl": "https://example.com/video.mp4",
        "order": 1
      }
    ],
    "_count": {
      "lessons": 10,
      "enrollments": 25,
      "reviews": 15
    }
  }
}
```

**Error Response:**
- `404` - Course not found

### 3. Create Course (Instructor/Admin Only)
**POST** `/api/v1/courses`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "JavaScript Fundamentals",
  "description": "Learn the basics of JavaScript",
  "price": 99.99,
  "category": "Programming",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response (201):**
```json
{
  "message": "Course created successfully",
  "course": {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "description": "Learn the basics of JavaScript",
    "price": 99.99,
    "category": "Programming",
    "imageUrl": "https://example.com/image.jpg",
    "instructor": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Responses:**
- `400` - Missing required fields (title, price, category)
- `401` - Unauthorized
- `403` - Insufficient permissions

### 4. Update Course (Instructor/Admin Only)
**PUT** `/api/v1/courses/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated JavaScript Fundamentals",
  "description": "Updated description",
  "price": 89.99,
  "category": "Programming",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

**Response (200):**
```json
{
  "message": "Course updated successfully",
  "course": {
    "id": 1,
    "title": "Updated JavaScript Fundamentals",
    "description": "Updated description",
    "price": 89.99,
    "category": "Programming",
    "imageUrl": "https://example.com/new-image.jpg",
    "instructor": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error Responses:**
- `404` - Course not found
- `401` - Unauthorized
- `403` - Insufficient permissions

### 5. Delete Course (Instructor/Admin Only)
**DELETE** `/api/v1/courses/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Course deleted successfully"
}
```

**Error Responses:**
- `404` - Course not found
- `401` - Unauthorized
- `403` - Insufficient permissions

---

## Lesson Endpoints

### 1. Create Lesson (Instructor/Admin Only)
**POST** `/api/v1/courses/:courseId/lessons`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Introduction to JavaScript",
  "videoUrl": "https://example.com/video.mp4",
  "order": 1
}
```

**Response (201):**
```json
{
  "message": "Lesson created successfully",
  "lesson": {
    "id": 1,
    "title": "Introduction to JavaScript",
    "videoUrl": "https://example.com/video.mp4",
    "order": 1,
    "courseId": 1
  }
}
```

### 2. Update Lesson (Instructor/Admin Only)
**PUT** `/api/v1/courses/lessons/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Lesson Title",
  "videoUrl": "https://example.com/updated-video.mp4",
  "order": 2
}
```

**Response (200):**
```json
{
  "message": "Lesson updated successfully",
  "lesson": {
    "id": 1,
    "title": "Updated Lesson Title",
    "videoUrl": "https://example.com/updated-video.mp4",
    "order": 2,
    "courseId": 1
  }
}
```

### 3. Delete Lesson (Instructor/Admin Only)
**DELETE** `/api/v1/courses/lessons/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Lesson deleted successfully"
}
```

---

## Enrollment Endpoints

### 1. Create Enrollment
**POST** `/api/v1/enrollments`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "courseId": 1
}
```

**Response (201):**
```json
{
  "message": "Enrollment successful",
  "enrollment": {
    "id": 1,
    "userId": 1,
    "courseId": 1,
    "enrollmentDate": "2024-01-01T00:00:00.000Z",
    "progress": {
      "completedLessons": [],
      "currentLesson": null,
      "completedAt": null
    },
    "course": {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "instructor": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    },
    "user": {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
}
```

**Error Responses:**
- `400` - Course ID is required
- `404` - Course not found
- `409` - Already enrolled in this course

### 2. Get User Enrollments
**GET** `/api/v1/users/:id/enrollments`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "enrollments": [
    {
      "id": 1,
      "userId": 1,
      "courseId": 1,
      "enrollmentDate": "2024-01-01T00:00:00.000Z",
      "progress": {
        "completedLessons": [1, 2],
        "currentLesson": 3,
        "completedAt": null
      },
      "course": {
        "id": 1,
        "title": "JavaScript Fundamentals",
        "instructor": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "lessons": [
          {
            "id": 1,
            "title": "Introduction to JavaScript",
            "order": 1
          }
        ],
        "_count": {
          "lessons": 10
        }
      }
    }
  ],
  "total": 1
}
```

### 3. Get Enrollment by ID
**GET** `/api/v1/enrollments/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "enrollment": {
    "id": 1,
    "userId": 1,
    "courseId": 1,
    "enrollmentDate": "2024-01-01T00:00:00.000Z",
    "progress": {
      "completedLessons": [1, 2],
      "currentLesson": 3,
      "completedAt": null
    },
    "course": {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "instructor": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "lessons": [
        {
          "id": 1,
          "title": "Introduction to JavaScript",
          "order": 1
        }
      ]
    }
  },
  "progress": {
    "completedLessons": [1, 2],
    "currentLesson": 3,
    "completedAt": null,
    "totalLessons": 10,
    "completedLessonsCount": 2,
    "progressPercentage": 20
  }
}
```

### 4. Update Enrollment Progress
**PUT** `/api/v1/enrollments/:id/progress`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "lessonId": 3,
  "completed": true
}
```

**Response (200):**
```json
{
  "message": "Progress updated successfully",
  "enrollment": {
    "id": 1,
    "userId": 1,
    "courseId": 1,
    "progress": {
      "completedLessons": [1, 2, 3],
      "currentLesson": 3,
      "completedAt": null
    },
    "course": {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "instructor": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "lessons": [
        {
          "id": 1,
          "title": "Introduction to JavaScript",
          "order": 1
        }
      ]
    }
  },
  "progress": {
    "completedLessons": [1, 2, 3],
    "currentLesson": 3,
    "completedAt": null,
    "totalLessons": 10,
    "completedLessonsCount": 3,
    "progressPercentage": 30
  }
}
```

---

## Error Responses

All endpoints may return these common error responses:

### 400 Bad Request
```json
{
  "message": "Error description"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "message": "Resource already exists"
}
```

### 429 Too Many Requests
```json
{
  "message": "Too many login attempts from this IP, please try again after 15 minutes."
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Frontend Implementation Tips

### 1. Authentication Flow
1. Store JWT token in localStorage or secure cookie
2. Include token in Authorization header for all protected requests
3. Handle token expiration by redirecting to login
4. Implement refresh token logic for seamless user experience

### 2. Course Browsing
1. Implement pagination for course listing
2. Add search and filter functionality
3. Show course cards with instructor info and enrollment count
4. Display course details with lessons list

### 3. Enrollment Management
1. Track user progress through lessons
2. Show progress percentage and completion status
3. Allow users to mark lessons as completed
4. Display enrollment history

### 4. Role-Based Access
1. Show different UI for students vs instructors
2. Hide instructor features from students
3. Implement proper authorization checks

### 5. Error Handling
1. Display user-friendly error messages
2. Handle network errors gracefully
3. Implement retry logic for failed requests
4. Show loading states during API calls

---

## Testing the API

You can test the API using tools like:
- Postman
- Insomnia
- curl commands
- Browser developer tools

### Example curl commands:

**Register a user:**
```bash
curl -X POST http://localhost:4000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123!"}'
```

**Login:**
```bash
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123!"}'
```

**Get courses:**
```bash
curl -X GET http://localhost:4000/api/v1/courses
```

**Create course (with auth):**
```bash
curl -X POST http://localhost:4000/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"JavaScript Course","description":"Learn JS","price":99.99,"category":"Programming"}'
``` 