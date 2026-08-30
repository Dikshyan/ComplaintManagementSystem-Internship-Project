# The Civic Voice — Civic Complaint and Grievance Management System

The Civic Voice is a full-stack civic complaint management platform that bridges the communication gap between citizens and municipal authorities. Citizens can report infrastructure and civic issues, attach photographic evidence, upvote priority concerns, and track resolution timelines. Administrative and departmental staff can manage, assign, investigate, and resolve grievances with complete transparency.

---

## Architecture and Technology Stack

### Frontend
- Framework: React 18 with Vite
- Routing: React Router v6
- Styling: Custom Neobrutalism Design System (Vanilla CSS tokens and components)
- Icons: Lucide React
- Animations: Framer Motion
- Notifications: React Toastify
- HTTP Client: Fetch API with modular domain-specific service layers

### Backend
- Runtime: Node.js (CommonJS)
- Framework: Express 5
- Database: MongoDB with Mongoose ODM
- Authentication: JSON Web Tokens (JWT) and bcryptjs
- File Uploads: Multer with Cloudinary CDN integration
- Middleware: Custom Authentication, Role-based Access Control (RBAC), and Error Handling

---

## System Roles and Permissions

The application implements three distinct role tiers:

### 1. Citizen (User)
- Register and authenticate into the platform.
- Report grievances with title, category, description, priority, location, and photo attachments.
- Browse public grievances across the community.
- Upvote complaints to highlight severity and public demand.
- Participate in community comment discussions.
- Track personal complaints and view officer assignment and status timelines.
- Reset account passwords using the self-service forgot password mechanism.

### 2. Municipal Staff
- Access the dedicated Staff Dashboard.
- View complaints assigned to the staff member or department.
- Accept assigned complaints and acknowledge review.
- Update complaint status through workflow states: Under Review, In Progress, Resolved, or Rejected.
- Add resolution notes and timeline entries.

### 3. Administrator
- Access the full Civic Control Center (Admin Dashboard).
- Real-time platform analytics: total complaints, pending, resolved, active, and cumulative citizen votes.
- Assign complaints to municipal staff members and specific departments.
- Delete rejected complaints after review.
- User management: inspect registered citizens and staff accounts.
- Promote or demote user roles dynamically between Citizen, Staff, and Administrator.
- Provision dedicated staff credentials and department designations.
- Remove user accounts when necessary.

---

## Grievance Lifecycle and Status Workflow

Complaints follow a structured status transition:

```text
       [ Submitted ] (Pending)
             |
             v
       [ Assigned ] (Assigned to Department / Staff)
             |
      +------+------+
      |             |
      v             v
[ Under Review ] [ Rejected ] ---> (Admin Deletion Permitted)
      |
      v
[ In Progress ]
      |
      v
 [ Resolved ]
```

- Pending: Complaint filed by citizen, awaiting department dispatch.
- Assigned: Administrative control assigns complaint to a staff officer.
- Under Review: Staff acknowledges task and verifies site details.
- In Progress: Municipal operations or field work actively ongoing.
- Resolved: Problem fixed with resolution record updated.
- Rejected: Complaint deemed invalid, duplicate, or out of jurisdiction. Only complaints in this state can be permanently purged by administrators.

---

## Security Implementation

- Authentication: Stateless JWT tokens with strict 7-day expiration.
- Secret Protection: Mandatory JWT secret validation on server boot; fallback keys are strictly disallowed to prevent compromised signatures.
- Session Expiration Handling: Frontend automatically intercepts 401 Unauthorized responses, clears expired credentials from client storage, and redirects to the sign-in screen.
- Password Security: All user passwords are salted and hashed using bcryptjs (cost factor 10) before persisting to the database.
- Input Sanitation: Email lowercasing and trimming, password minimum character restrictions, and sanitized role extraction upon registration.
- Access Control: Multi-tiered route middleware verifies valid bearer tokens and checks administrative or staff clearance before granting access to privileged resources.
- Safe File Ingestion: Image uploads are validated for valid image MIME types and enforced with a 5MB size ceiling before streaming to Cloudinary.
- Environment Isolation: All production credentials and secrets are excluded from source control via .gitignore with accompanying templates.
- Self-Service Password Reset Note: In the current development and demo scope, password reset functions directly via registered email matching. Production deployments recommend pairing this with an OTP or transactional email verification service (such as SendGrid or Nodemailer).

---

## Repository Structure

```text
Complaint_Mangement/
├── backend/
│   ├── config/
│   │   └── cloudinary.js           # Cloudinary SDK configuration
│   ├── controllers/
│   │   ├── authController.js       # Register, login, me, logout, forgot-password
│   │   ├── complaintController.js  # CRUD, assignment, status update, vote, comment, delete
│   │   └── userController.js       # Admin user management and role modification
│   ├── db/
│   │   └── db.js                   # MongoDB connection management
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT bearer token verification
│   │   ├── roleMiddleware.js       # Admin and staff role verification
│   │   └── uploadMiddleware.js     # Multer memory storage configuration
│   ├── models/
│   │   ├── complaint.model.js      # Complaint schema and timeline definitions
│   │   └── user.model.js           # User schema with secure serialization
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth routes
│   │   ├── complaintRoutes.js      # /api/complaint routes
│   │   └── userRoutes.js           # /api/users routes
│   ├── utils/
│   │   └── cloudinaryUpload.js     # Buffer upload stream helper
│   ├── .env.example                # Backend environment variable template
│   ├── index.js                    # Express app initialization and middleware
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI cards, headers, and route guards
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx  # Admin analytics, assignments, and user management
│   │   │   ├── Home.jsx            # Landing page, marquee banner, and statistics
│   │   │   ├── LoginRegister.jsx   # Authentication and password reset modal
│   │   │   ├── MyGrievanceDetails.jsx # Citizen timeline and grievance detail view
│   │   │   ├── ProblemDetails.jsx  # Public grievance view with comments and voting
│   │   │   ├── ProblemsFeed.jsx    # Filterable grievance feed
│   │   │   ├── Profile.jsx         # Citizen profile and history
│   │   │   ├── StaffDashboard.jsx  # Staff assigned grievance tasks and status controls
│   │   │   └── SubmitComplaint.jsx # Multi-field complaint submission form
│   │   ├── services/
│   │   │   ├── adminApi.js         # Admin-specific API calls
│   │   │   ├── api.js              # Base fetch wrapper with 401 token interceptor
│   │   │   ├── authapi.js          # Authentication and password recovery calls
│   │   │   ├── complaintApi.js     # Grievance retrieval and submission calls
│   │   │   ├── staffApi.js         # Staff status updates and task actions
│   │   │   └── userApi.js          # User retrieval and role updates
│   │   ├── App.jsx                 # Route routing configuration
│   │   ├── index.css               # Design system tokens and styling
│   │   └── main.jsx
│   ├── .env.example                # Frontend environment variable template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a citizen account |
| POST | `/api/auth/login` | Public | Authenticate user and receive JWT |
| GET | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| POST | `/api/auth/logout` | Authenticated | Terminate session |
| POST | `/api/auth/forgot-password` | Public | Reset password using registered email |

### Complaints (`/api/complaint`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/complaint` | Public | List all complaints |
| GET | `/api/complaint/stats` | Public | Retrieve aggregated complaint metrics |
| GET | `/api/complaint/:id` | Public | Retrieve specific complaint details |
| POST | `/api/complaint` | Authenticated | Submit a complaint (multipart with image) |
| PATCH | `/api/complaint/:id/status` | Staff / Admin | Update grievance progress status |
| PATCH | `/api/complaint/:id/assign` | Admin | Assign grievance to staff member |
| POST | `/api/complaint/:id/vote` | Authenticated | Upvote or remove upvote |
| POST | `/api/complaint/:id/comments` | Authenticated | Add a comment to a complaint |
| DELETE | `/api/complaint/:id` | Admin | Delete a complaint (only if status is Rejected) |

### Users (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | List all registered users |
| POST | `/api/users/staff` | Admin | Provision a new municipal staff account |
| PATCH | `/api/users/:id/role` | Admin | Promote or demote user role (user, staff, admin) |
| DELETE | `/api/users/:id` | Admin | Remove a user account |
| PATCH | `/api/users/me` | Authenticated | Update personal profile details |

---

## Installation and Local Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or MongoDB Atlas connection string)
- Cloudinary account for attachment storage

### 1. Clone the Repository
```bash
git clone https://github.com/Dikshyan/ComplaintManagementSystem-Internship-Project.git
cd ComplaintManagementSystem-Internship-Project
```

### 2. Backend Configuration
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` using `.env.example`:
```bash
cp .env.example .env
```

Configure the environment variables:
```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/civic_voice
JWT_SECRET=your_secure_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend service:
```bash
# Development (with nodemon):
npm run server

# Production mode:
npm start
```

### 3. Frontend Configuration
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` using `.env.example`:
```bash
cp .env.example .env
```

Set the API base URL to match the backend:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the frontend development server:
```bash
npm run dev
```

To verify production bundle build:
```bash
npm run build
```

---

## Production Deployment Recommendations

1. Host Provider: Deploy backend on platforms supporting Node.js long-running services (Render, Railway, Fly.io, or AWS EC2).
2. Frontend Hosting: Deploy frontend on static delivery networks (Vercel, Netlify, or Cloudflare Pages).
3. CORS Policy: Set `origin` in `backend/index.js` to the exact production frontend domain rather than wildcard/reflection.
4. Rate Limiting: Introduce `express-rate-limit` on authentication endpoints (`/api/auth/login`, `/api/auth/forgot-password`).
5. Transactional Email: Implement an SMTP service (such as Nodemailer with SendGrid or AWS SES) to send OTP verification codes for email confirmation and password resets.

---

## License

This project is developed for educational and internship evaluation purposes.
