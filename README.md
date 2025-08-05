Course-Selling Application Backend
This document outlines the development of a robust Node.js backend for a course-selling application, using Prisma and PostgreSQL. The system is designed to be scalable, secure, and maintainable, suitable for a production-grade platform similar to Udemy or Coursera.
Features
Core Features

User Management
User registration and login with email/password, supporting roles (student, instructor, admin).
Password reset via email.
Profile management for updating name, email, etc.
Role-based access control to restrict actions (e.g., only instructors create courses).


Course Management
Create, update, delete, and list courses.
Filter courses by category, price, or rating.
Search courses by title or description.
Manage lessons within a course (add, edit, delete).
Upload course images and videos.


Enrollment Management
Enroll users in courses post-payment.
Track user progress (e.g., completed lessons).
List user enrollments.


Payment Processing
Process payments via Stripe.
Handle payment confirmations and refunds.
Send payment confirmation emails.


Reviews and Ratings
Allow enrolled users to submit reviews and ratings.
Display average course ratings and reviews.
Moderate reviews (admin feature).



Additional Features

Email Notifications
Send welcome emails on registration.
Send payment confirmation and enrollment emails.
Send password reset emails.


Analytics
Track course popularity (views, enrollments).
Provide admin dashboard with metrics (total users, revenue).


Content Delivery
Stream lesson videos securely.
Serve course images via a CDN (e.g., Cloudinary).


Security
Secure APIs with JWT and HTTPS.
Input validation and sanitization to prevent XSS/SQL injection.
GDPR-compliant user data deletion.


Scalability
Cache frequently accessed data (e.g., course listings) using Redis.
Use message queues for background tasks (e.g., email sending).
Support horizontal scaling with load balancing.



System Design
Architecture Overview

Monolithic Backend with Modular Structure
Built as a single Node.js application using Express.js, organized into modules (controllers, routes, services).
Designed for beginner learning, with potential for microservices migration.



Components

API Layer
Built with Express.js for RESTful APIs.
Endpoints: /api/v1/users, /api/v1/courses, /api/v1/enrollments, /api/v1/payments, /api/v1/reviews.
Secured with JWT authentication and role-based authorization.


Database
PostgreSQL: Relational database for structured data.
Prisma: ORM for type-safe database operations and migrations.
Schema:
Users: id, name, email, password, role (student/instructor/admin), createdAt.
Courses: id, title, description, price, instructorId, category, imageUrl, averageRating.
Lessons: id, courseId, title, videoUrl, order.
Enrollments: id, userId, courseId, enrollmentDate, progress.
Payments: id, userId, courseId, amount, status, transactionId.
Reviews: id, userId, courseId, rating, comment, createdAt.




External Services
Stripe for payment processing and webhooks.
SendGrid for transactional emails.
Cloudinary for storing and serving media.
Redis for caching and session management.


Caching
Redis for caching course listings and user sessions.


Message Queue
Bull (Redis-based) for background tasks like emails and analytics.


Deployment
Containerized with Docker.
Deployed on a cloud provider (e.g., AWS EC2, Heroku) with Nginx as a reverse proxy.
CI/CD pipeline using GitHub Actions.



Scalability Considerations

Horizontal scaling with a load balancer (e.g., AWS ELB).
Database optimization with indexes on frequently queried fields.
Redis caching for hot data (e.g., popular courses).
Background jobs via queues to avoid blocking the main thread.

Security Considerations

JWT for authentication.
HTTPS for secure communication.
Input validation with express-validator.
Rate-limiting with express-rate-limit.
Secure headers with helmet.
GDPR-compliant data handling.

System Diagram
[Client] <--> [Nginx Load Balancer] <--> [Node.js/Express API]
                                      |
                  +------------------+------------------+
                  |                  |                  |
              [PostgreSQL]        [Redis]         [External Services]
                  |                  |                  |
               (Prisma)           (Cache)    (Stripe, SendGrid, Cloudinary)
                  |
              [Bull Queue]

Product Requirements Document (PRD)
Title
Course-Selling Application Backend
Version
1.0
Date
August 5, 2025
Objective
Build a scalable, secure Node.js backend for a course-selling platform enabling user registration, course browsing/purchasing, enrollment, and reviews, with payment and email support.
Scope

In Scope:
User authentication/authorization (student, instructor, admin roles).
Course creation, management, and browsing.
Payment processing with Stripe.
Enrollment and progress tracking.
Reviews and ratings.
Email notifications for key actions.
Basic admin analytics (user count, revenue).


Out of Scope:
Frontend development.
Advanced analytics (e.g., user behavior tracking).
Multi-language support.



Functional Requirements

User Management:
Register with email/password.
Login to receive a JWT.
Update profile and reset password.
Role-based access (e.g., only admins approve courses).


Course Management:
Instructors can create/edit/delete courses.
Students can browse, filter, and search courses.
Courses include lessons with video URLs.


Payments:
Process payments via Stripe.
Handle refunds and send confirmation emails.


Enrollments:
Enroll users post-payment.
Track lesson completion progress.


Reviews:
Enrolled users can rate and review courses.
Display average ratings.


Notifications:
Send emails for registration, payments, and enrollments.



Non-Functional Requirements

Performance: API response time < 200ms for 95% of requests.
Scalability: Support 1000 concurrent users.
Security: Use HTTPS, JWT, input validation, GDPR compliance.
Reliability: 99.9% uptime with automated backups.
Maintainability: Modular code with tests and documentation.

Success Metrics

90% of API requests complete successfully.
100% test coverage for critical paths (auth, payments).
Zero-downtime cloud deployment.

Assumptions

Users have internet access.
Stripe, SendGrid, and Cloudinary accounts are set up.
PostgreSQL and Redis are available.

Risks

Payment failures due to Stripe integration issues.
Scalability bottlenecks if caching is not optimized.
Security vulnerabilities if inputs are not sanitized.

Milestones

Week 1–2: Project setup, database design, authentication.
Week 3–4: Course and enrollment management.
Week 5–6: Payments and reviews.
Week 7: Testing, optimization, deployment.
Week 8: Security, scalability, additional features.

Task Breakdown
Phase 1: Project Setup and Planning

1.1 Define Requirements
List core features in a document.
Document non-functional requirements (scalability, security, performance).
Write user stories (e.g., "As a student, I can search courses by category").
List API endpoints (e.g., POST /api/v1/users/register).
Identify integrations (Stripe, SendGrid, Cloudinary, Redis).


1.2 Choose Tech Stack
Select Express.js (npm install express – RESTful APIs).
Select PostgreSQL (npm install pg – database driver) and Prisma (npm install prisma @prisma/client – ORM).
Select jsonwebtoken (npm install jsonwebtoken – JWT) and bcrypt (npm install bcrypt – password hashing).
Select Stripe (npm install stripe – payments).
Select Jest (npm install jest --save-dev – testing) and Supertest (npm install supertest --save-dev – API testing).
Select Winston (npm install winston – logging) and Morgan (npm install morgan – HTTP logging).
Select Redis (npm install redis – caching).
Select SendGrid (npm install @sendgrid/mail – emails).
Select Cloudinary (npm install cloudinary – media) and Multer (npm install multer – file uploads).


1.3 Set Up Project Structure
Initialize Node.js project (npm init -y).
Install Express.js (npm install express).
Create folders: /src/controllers, /src/models, /src/routes, /src/middlewares, /src/config, /src/utils, /src/services, /prisma.
Set up .gitignore (exclude node_modules, .env, etc.).
Configure ESLint (npm install eslint --save-dev, npx eslint --init).
Configure Prettier (npm install prettier --save-dev, create .prettierrc).
Set up basic Express server in src/index.js with test route (GET /).
Add nodemon (npm install nodemon --save-dev,，应该start:dev": "nodemon src/index.js").


1.4 Environment Setup
Install dotenv (npm install dotenv) and add to src/index.js.
Create .env and .env.example with variables (e.g., PORT, DATABASE_URL).
Create src/config/index.js for environment-based configs.
Test server startup (npm run start:dev).



Phase 2: Database Design and Setup

2.1 Design Database Schema
Define User model in prisma/schema.prisma (id, name, email, password, role, createdAt).
Define Course model (id, title, description, price, instructorId, category, imageUrl, averageRating).
Define Lesson model (id, courseId, title, videoUrl, order).
Define Enrollment model (id, userId, courseId, enrollmentDate, progress).
Define Payment model (id, userId, courseId, amount, status, transactionId).
Define Review model (id, userId, courseId, rating, comment, createdAt).
Create ERD using draw.io for relationships.
Validate schema for completeness.


2.2 Set Up Database with Prisma
Install Prisma and PostgreSQL driver (npm install prisma @prisma/client pg).
Initialize Prisma (npx prisma init).
Set up PostgreSQL via Docker (docker run --name coursify-postgres ...).
Run migrations (npx prisma migrate dev --name init).
Test database connection in src/config/db.js.
Seed initial data in prisma/seed.js.



Phase 3: Authentication and Authorization

3.1 User Authentication
Install bcrypt (npm install bcrypt).
Create POST /api/v1/users/register endpoint.
Hash passwords with bcrypt.hash().
Create POST /api/v1/users/login endpoint with JWT.
Generate JWT tokens with jsonwebtoken.sign().
Create JWT middleware with jsonwebtoken.verify().


3.2 Role-Based Authorization
Add role enum to schema.prisma.
Create restrictTo(roles) middleware for role checks.
Apply role-based access to routes (e.g., instructor-only course creation).
Test role restrictions.


3.3 Secure Authentication
Validate passwords with regex (8+ chars, 1 special char).
Implement rate-limiting (npm install express-rate-limit).
Set up Helmet (npm install helmet).
Add refresh token endpoint (POST /api/v1/users/refresh-token).
Implement password reset endpoints (POST /api/v1/users/forgot-password, POST /api/v1/users/reset-password).



Phase 4: Core Features Implementation

4.1 Course Management
Create POST /api/v1/courses endpoint.
Create PUT /api/v1/courses/:id for updates.
Create DELETE /api/v1/courses/:id (soft delete).
Create GET /api/v1/courses with pagination.
Add filtering with query params.
Add searching with PostgreSQL ILIKE.
Create GET /api/v1/courses/:id for details.
Create POST /api/v1/courses/:id/lessons for lessons.
Create lesson update/delete endpoints.


4.2 Enrollment Management
Create POST /api/v1/enrollments endpoint.
Create GET /api/v1/users/:id/enrollments endpoint.
Validate enrollments for duplicates.
Create PUT /api/v1/enrollments/:id/progress for progress tracking.


4.3 Payment Integration
Set up Stripe (npm install stripe).
Create POST /api/v1/payments for payment intents.
Handle Stripe webhooks (POST /api/v1/payments/webhook).
Update enrollments on payment success.
Create refund endpoint (POST /api/v1/payments/refund).
Test payment flow with Stripe test cards.


4.4 Reviews and Ratings
Create POST /api/v1/courses/:id/reviews endpoint.
Create GET /api/v1/courses/:id/reviews with pagination.
Validate reviews for enrolled users.
Calculate and update Course.averageRating.



Phase 5: API Development Best Practices

5.1 API Design
Follow RESTful conventions (nouns, HTTP methods).
Standardize responses ({ success: true, data: {}, message: "" }).
Add input validation (npm install express-validator).
Document APIs with Swagger (npm install swagger-ui-express).
Version APIs with /api/v1/ prefix.


5.2 Error Handling
Create error middleware.
Define custom errors in src/utils/errors.js.
Log errors with Winston.


5.3 Logging and Monitoring
Set up Morgan for HTTP logging.
Configure Winston for info/warning/error logs.
Log response times with custom middleware.
Monitor Prisma queries for performance.



Phase 6: Testing

6.1 Unit Testing
Set up Jest (npm install jest --save-dev).
Test user registration and course creation.
Mock Prisma calls with Jest.


6.2 Integration Testing
Set up test database.
Test API endpoints with Supertest.
Test auth flows (login, protected routes).


6.3 End-to-End Testing
Test signup-to-enrollment flow.
Test payment flow with mocked Stripe API.



Phase 7: Performance Optimization

7.1 Database Optimization
Add indexes to User.email, Course.category.
Implement pagination with Prisma skip and take.
Cache course listings in Redis.
Optimize Prisma queries with select.


7.2 API Optimization
Enable compression (npm install compression).
Rate-limit public endpoints.
Cache GET /api/v1/courses responses in Redis.



Phase 8: Deployment

8.1 Prepare for Deployment
Create Dockerfile.
Create docker-compose.yml for app, PostgreSQL, Redis.
Set up CI/CD with GitHub Actions.
Configure production environment.


8.2 Deploy to Cloud
Choose cloud provider (AWS, Heroku, DigitalOcean).
Deploy Docker container.
Configure Nginx as reverse proxy.


8.3 Monitoring and Maintenance
Set up monitoring (Prometheus, New Relic).
Configure downtime/error alerts.
Schedule PostgreSQL backups.



Phase 9: Security Hardening

9.1 Secure APIs
Implement CORS (npm install cors).
Sanitize inputs with express-validator.
Enable HTTPS with Let’s Encrypt.


9.2 Data Protection
Encrypt payment data with crypto.
Implement GDPR-compliant deletion (DELETE /api/v1/users/:id).
Run npm audit for dependency vulnerabilities.



Phase 10: Scalability

10.1 Horizontal Scaling
Set up load balancer (AWS ELB or Nginx).
Use Node.js cluster module.
Add Bull queue for emails/analytics (npm install bull).


10.2 Vertical Scaling
Upgrade server CPU/memory.
Profile slow endpoints with Clinic.js.



Phase 11: Additional Features

11.1 Email Notifications
Set up SendGrid with API key.
Send welcome and payment confirmation emails.


11.2 File Uploads
Configure Multer and Cloudinary.
Create POST /api/v1/courses/:id/image endpoint.
Validate file types (images/videos).


11.3 Analytics
Track course views (POST /api/v1/courses/:id/view).
Create admin stats endpoint (GET /api/v1/admin/stats).


11.4 Learning Plan
Start with Phase 1 setup.
Test each feature with unit/integration tests.
Deploy after Phase 4.
Add features from Phases 5–11 gradually.
Review code with ESLint, Prettier, and test coverage.


