# 🎓 Campus Placement Portal

A full-stack web application for managing campus placements — connecting students, companies, and placement officers on a single platform.

---

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-documentation)
- [Default Credentials](#-default-credentials)
- [Running Tests](#-running-tests)
- [Environment Variables](#-environment-variables)

---

## 🛠 Tech Stack

| Layer      | Technology                                               |
|------------|----------------------------------------------------------|
| Backend    | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth       | JWT (jjwt 0.11.5), BCrypt                               |
| Database   | MySQL 8.x, Hibernate ORM                                |
| API Docs   | SpringDoc OpenAPI 3 / Swagger UI                        |
| Frontend   | React 18, Vite 5, Tailwind CSS 3                        |
| HTTP       | Axios with interceptors                                  |
| Charts     | Recharts                                                 |
| Build      | Maven 3.x (backend), npm / Vite (frontend)              |

---

## ✨ Features

### Admin
- 📊 Dashboard with live statistics and charts
- 👨‍🎓 Full student CRUD with search and filters
- 🏢 Full company CRUD with status management
- 📅 Placement drive management (create, edit, cancel)
- 👥 View and update applicant statuses per drive
- 🏆 Mark students as placed with package details

### Student
- 🏠 Personal dashboard with application summary
- 🔍 Browse and search active placement drives
- ✉️ Apply to drives with optional cover letter
- 📄 Track all applications with real-time status
- 🚫 Withdraw applications

### Security
- JWT-based stateless authentication
- Role-based access control (ADMIN / STUDENT)
- Global exception handling with structured error responses
- Input validation with Jakarta Validation

---

## 📁 Project Structure

```
campus-placement-portal/
├── backend/
│   ├── src/main/java/com/placement/portal/
│   │   ├── config/          # Security, OpenAPI config
│   │   ├── controller/      # REST controllers
│   │   ├── dto/
│   │   │   ├── request/     # Request DTOs
│   │   │   └── response/    # Response DTOs
│   │   ├── entity/          # JPA entities
│   │   ├── exception/       # Custom exceptions + global handler
│   │   ├── repository/      # Spring Data JPA repos
│   │   ├── security/        # JWT utils, filters, UserDetails
│   │   └── service/         # Business logic (interface + impl)
│   ├── src/test/            # JUnit + Mockito tests
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client + service calls
│   │   ├── components/
│   │   │   ├── common/      # Reusable UI components
│   │   │   └── layout/      # Sidebar, Layout wrapper
│   │   ├── context/         # AuthContext (global auth state)
│   │   ├── hooks/           # Custom hooks (useDebounce)
│   │   ├── pages/
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── auth/        # Login, Register
│   │   │   └── student/     # Student pages
│   │   └── utils/           # Formatters, badge helpers
│   ├── index.html
│   └── vite.config.js
│
├── sql/
│   ├── schema.sql           # DDL — create all tables
│   └── seed_data.sql        # Sample data
│
└── README.md
```

---

## ✅ Prerequisites

| Tool         | Version  |
|--------------|----------|
| Java JDK     | 17+      |
| Maven        | 3.8+     |
| Node.js      | 18+      |
| npm          | 9+       |
| MySQL Server | 8.0+     |

---

## 🚀 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/campus-placement-portal.git
cd campus-placement-portal
```

### 2. Set up the MySQL database
```bash
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed_data.sql
```

Or manually:
```sql
CREATE DATABASE placement_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Then run both SQL files through your MySQL client.

### 3. Configure Backend

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_mysql_user
spring.datasource.password=your_mysql_password
```

Or use environment variables (recommended):
```bash
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export JWT_SECRET=your64charbase64secret
```

### 4. Run the Backend
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```
Backend starts at: **http://localhost:8080/api**

### 5. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend starts at: **http://localhost:5173**

---

## 📖 API Documentation

Swagger UI is available at:
```
http://localhost:8080/api/swagger-ui.html
```

OpenAPI JSON:
```
http://localhost:8080/api/v3/api-docs
```

### Key Endpoints

| Method | Endpoint                        | Role    | Description                    |
|--------|---------------------------------|---------|--------------------------------|
| POST   | /api/auth/login                 | Public  | Login and get JWT              |
| POST   | /api/auth/register              | Public  | Register new user              |
| GET    | /api/students                   | Any     | List students (paginated)      |
| POST   | /api/students                   | Admin   | Create student                 |
| PUT    | /api/students/{id}              | Admin   | Update student                 |
| DELETE | /api/students/{id}              | Admin   | Delete student                 |
| PATCH  | /api/students/{id}/place        | Admin   | Mark student as placed         |
| GET    | /api/companies                  | Any     | List companies (paginated)     |
| POST   | /api/companies                  | Admin   | Create company                 |
| GET    | /api/drives                     | Any     | List drives (paginated)        |
| POST   | /api/drives                     | Admin   | Create placement drive         |
| PATCH  | /api/drives/{id}/status         | Admin   | Update drive status            |
| POST   | /api/applications               | Any     | Apply to a drive               |
| GET    | /api/applications/student/{id}  | Any     | Get student's applications     |
| GET    | /api/applications/drive/{id}    | Any     | Get drive applicants           |
| PATCH  | /api/applications/{id}/status   | Admin   | Update application status      |
| PATCH  | /api/applications/{id}/withdraw | Any     | Withdraw application           |
| GET    | /api/dashboard/stats            | Admin   | Dashboard statistics           |

---

## 🔐 Default Credentials

| Role  | Username | Password    |
|-------|----------|-------------|
| Admin | admin    | password123 |
| Student | john_doe | password123 |
| Student | jane_smith | password123 |

> ⚠️ Change these credentials before deploying to production!

---

## 🧪 Running Tests

```bash
cd backend
mvn test
```

Test reports: `backend/target/surefire-reports/`

Test coverage includes:
- `StudentServiceTest` — create, read, update, delete, placed logic
- `CompanyServiceTest` — create, read, update, status change

---

## ⚙️ Environment Variables

| Variable     | Default                              | Description                   |
|-------------|--------------------------------------|-------------------------------|
| DB_USERNAME  | root                                 | MySQL username                |
| DB_PASSWORD  | root                                 | MySQL password                |
| JWT_SECRET   | 404E635266...                        | Base64 JWT signing key (64 chars) |

To generate a secure JWT secret:
```bash
openssl rand -base64 48
```

---

## 🏗 Building for Production

### Backend JAR
```bash
cd backend
mvn clean package -DskipTests
java -jar target/portal-1.0.0.jar
```

### Frontend Build
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

---

## 📝 Notes

- The `spring.jpa.hibernate.ddl-auto=validate` setting requires the schema to exist before startup. Always run `schema.sql` first.
- JWT tokens expire after 24 hours (configurable via `app.jwt.expiration`).
- CORS is configured for `http://localhost:5173` and `http://localhost:3000`. Update `app.cors.allowed-origins` for production.

---

## 📄 License

MIT License — free for personal and commercial use.
