# Code-A-Nova – Hackathon Registration Portal

A full-stack MERN application that allows participants to create accounts, verify their email addresses using OTP, log in securely, and register for hackathons with project and team details.

## Live Demo

- **Frontend:** https://hackathon-registration-portal-xi.vercel.app/
- **Backend:** https://hackathon-registration-portal-7e96.onrender.com/
- **GitHub:** https://github.com/ramyanagesh29/hackathon-registration-portal

## Features

### Authentication
- User registration and login
- Email verification using six-digit OTP
- OTP expiration after 10 minutes
- Password hashing using bcrypt
- JWT-based authentication
- Protected dashboard
- Logout functionality

### Hackathon Registration
- Participant information
- College, course, branch and domain selection
- Project details and resource links
- Team size selection
- Dynamic team member information
- Prevention of duplicate registrations
- Registration confirmation email

### Dashboard
- View user profile
- Check email verification status
- View hackathon registration details
- View team member information
- Access PPT and prototype links
- Update registration resource links

### Email Integration
- Brevo transactional email API
- OTP verification emails
- Hackathon registration confirmation emails

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcryptjs |
| Email Service | Brevo API |
| Security | Helmet, CORS, cookie-parser, express-rate-limit |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

## Project Structure

```text
hackathon-registration-portal/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vercel.json
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

*Note: Adjust the folder listing if your actual repository structure differs.*

## Installation and Setup

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account
- Brevo account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ramyanagesh29/hackathon-registration-portal.git
cd hackathon-registration-portal
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the server folder.

Add the required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
```

Use the exact MongoDB variable name expected by your database configuration if it differs from `MONGO_URI`.

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the client folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local Vite URL shown in the terminal.

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Register a new account |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/user/me` | Get current user |
| POST | `/api/hackathon/register` | Submit hackathon registration |
| GET | `/api/hackathon/my-entry` | Get user's registration |
| PUT | `/api/hackathon/update-links` | Update project links |

## Deployment

- Frontend deployed using Vercel.
- Backend deployed using Render.
- Database hosted on MongoDB Atlas.
- Transactional emails handled by Brevo.

## Security

- Password hashing with bcryptjs.
- JWT-based authentication.
- HTTP-only authentication cookies.
- OTP expiration and single-use verification.
- Environment variables for sensitive credentials.
- Backend input validation.
- Authentication-protected routes.

## Future Improvements

- Admin dashboard for managing registrations.
- Export participant information.
- Improved email deliverability with an authenticated custom domain.
- Additional registration analytics.

## Author

**Ramya N**

B.E. Computer Science and Engineering

Vidya Vikas Institute of Engineering and Technology, Mysuru

---

This project was developed as part of the Code-A-Nova Full Stack Development Internship.
