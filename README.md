# Coursify - Learning Management System

A comprehensive learning management system built with Node.js, Express, Prisma, and PostgreSQL. Features include user authentication, course management, enrollment tracking, progress monitoring, and review systems.

## 🚀 Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Course Management**: CRUD operations for courses and lessons
- **Enrollment System**: Free course enrollment with progress tracking
- **Reviews & Ratings**: Course reviews with average rating calculation
- **Security**: Rate limiting, password validation, and security headers
- **API**: RESTful API with comprehensive endpoints

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, Rate Limiting
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (for local development)

## 🚀 Quick Start

### Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coursify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.production.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

### Production with Docker

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec app npm run db:migrate
   ```

3. **Seed the database**
   ```bash
   docker-compose exec app npm run db:seed
   ```

## 📚 API Documentation

### Authentication Endpoints

```
POST /register                    # User registration
POST /login                       # User login
POST /refresh-token               # Refresh access token
POST /forgot-password             # Password reset request
POST /reset-password              # Password reset
GET  /me                          # Get current user
```

### Course Endpoints

```
GET    /api/v1/courses            # List courses (with filtering/search)
GET    /api/v1/courses/:id        # Get course details
POST   /api/v1/courses            # Create course (instructors only)
PUT    /api/v1/courses/:id        # Update course (instructors only)
DELETE /api/v1/courses/:id        # Delete course (instructors only)
POST   /api/v1/courses/:id/lessons # Add lesson (instructors only)
PUT    /api/v1/lessons/:id        # Update lesson (instructors only)
DELETE /api/v1/lessons/:id        # Delete lesson (instructors only)
```

### Enrollment Endpoints

```
POST   /api/v1/payments           # Create free enrollment
GET    /api/v1/payments/history   # Get enrollment history
GET    /api/v1/payments/:id       # Get enrollment details
PUT    /api/v1/enrollments/:id/progress # Update progress
GET    /api/v1/users/:id/enrollments # Get user enrollments
```

### Review Endpoints

```
POST   /api/v1/courses/:id/reviews # Create review
GET    /api/v1/courses/:id/reviews # Get course reviews
PUT    /api/v1/reviews/:id        # Update review
DELETE /api/v1/reviews/:id        # Delete review
GET    /api/v1/user/reviews       # Get user's reviews
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.production.example`:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/coursify_db
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
```

### Database Configuration

The application uses Prisma ORM. Key commands:

```bash
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed the database
npm run db:studio      # Open Prisma Studio
```

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t coursify .
```

### Run Container
```bash
docker run -p 3000:3000 coursify
```

### Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Validation**: Strong password requirements
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for HTTP security
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin resource sharing

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Monitoring

The application includes health checks and monitoring endpoints:

- `/test` - Basic health check
- `/health` - Detailed health status (when using Nginx)

## 🚀 Deployment

### GitHub Actions CI/CD

The project includes a comprehensive CI/CD pipeline:

1. **Testing**: Automated tests on every push/PR
2. **Security Scanning**: Trivy vulnerability scanning
3. **Docker Build**: Automated Docker image building
4. **Deployment**: Automated deployment to production

### Required Secrets

Set these secrets in your GitHub repository:

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password
- `HOST`: Production server hostname
- `USERNAME`: SSH username
- `SSH_KEY`: SSH private key

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.