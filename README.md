# Event Booking System

> A full-stack event management and booking platform built with the MERN stack

A comprehensive platform for discovering, booking, and managing event tickets. Features secure authentication, real-time availability tracking, admin dashboard, and automated email notifications.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✨ Features

### User Features
- **Authentication**: Secure JWT-based authentication with HTTP-only cookies
- **Event Discovery**: Browse and search events with filters
- **Ticket Booking**: Real-time ticket availability and booking confirmation
- **Booking Management**: View booking history and cancel bookings
- **Email Notifications**: Automated confirmation and cancellation emails

### Admin Features
- **Event Management**: Create, edit, and delete events with media uploads
- **User Management**: View and manage registered users
- **Booking Dashboard**: Monitor all bookings in real-time
- **Analytics**: Revenue analytics with customizable date ranges
- **Reports**: Export booking data to Excel and PDF formats

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling framework |
| Ant Design | UI component library |
| Axios | HTTP client |
| Zustand | State management |
| React Router | Client-side routing |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Nodemailer | Email service |
| Multer | File upload handling |
| Swagger | API documentation |
| ExcelJS & PDFKit | Report generation |

---

## 📁 Project Structure

```
event-booking-system/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── apiservices/        # API integration layer
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   │   ├── auth/           # Login, Register
│   │   │   └── private/        # Protected routes
│   │   │       ├── admin/      # Admin dashboard
│   │   │       ├── events/     # Event management
│   │   │       ├── profile/    # User profile
│   │   │       └── reports/    # Analytics
│   │   ├── layouts/            # Layout components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── store/              # State management
│   │   └── interfaces/         # TypeScript types
│   ├── public/                 # Static assets
│   ├── .env.example            # Environment template
│   └── package.json
│
├── server/                      # Backend Node.js application
│   ├── config/                 # Configuration files
│   │   ├── dbconfig.js         # MongoDB connection
│   │   ├── swagger.js          # Swagger setup
│   │   └── swagger-docs.js     # API documentation
│   ├── models/                 # Mongoose schemas
│   │   ├── userModel.js
│   │   ├── eventModel.js
│   │   └── bookingModel.js
│   ├── routes/                 # API routes
│   │   ├── userRoute.js
│   │   ├── eventRoute.js
│   │   ├── bookingRoute.js
│   │   └── reportRoute.js
│   ├── middlewares/            # Custom middleware
│   │   └── validateToken.js    # JWT verification
│   ├── helpers/                # Utility functions
│   │   ├── sendEmail.js
│   │   └── emailTemplates.js
│   ├── .env.example            # Environment template
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) - Local installation or MongoDB Atlas account
- **npm** or **yarn** package manager

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/event-booking-system.git
cd event-booking-system
```

#### 2. Set up the Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration:
# - MongoDB connection string
# - JWT secret key
# - Gmail credentials
# - Frontend URL
nano .env  # or use any text editor

# Start the backend server
npm run dev
```

**Backend will run on**: http://localhost:5000

**API Documentation**: http://localhost:5000/api-docs

#### 3. Set up the Frontend

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with backend API URL
nano .env

# Start the frontend dev server
npm run dev
```

**Frontend will run on**: http://localhost:5173

### Environment Configuration

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URL=mongodb://localhost:27017/eventbooking
JWT_SECRET_KEY=your_secure_jwt_secret_key
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Running Both Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

---

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

**Swagger UI**: http://localhost:5000/api-docs

### Main Endpoints

#### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/current-user` - Get authenticated user

#### Events
- `GET /api/events/get-events` - Get all events (with filters)
- `GET /api/events/get-event/:id` - Get single event
- `POST /api/events/create-event` - Create event (Admin)
- `PUT /api/events/edit-event/:id` - Update event (Admin)
- `DELETE /api/events/delete-event/:id` - Delete event (Admin)

#### Bookings
- `POST /api/bookings/create-booking` - Create booking
- `GET /api/bookings/get-user-bookings` - Get user's bookings
- `GET /api/bookings/get-all-bookings` - Get all bookings (Admin)
- `DELETE /api/bookings/cancel-booking/:id` - Cancel booking

#### Reports
- `GET /api/reports/revenue-analytics` - Get revenue analytics
- `GET /api/reports/export-excel` - Export to Excel
- `GET /api/reports/export-pdf` - Export to PDF

---


## 🔑 Key Features Implementation

### Authentication
- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- Protected routes with middleware

### Email Notifications
- Professional HTML email templates
- Booking confirmation emails
- Cancellation notification emails

### File Upload
- Multer integration for event media
- Support for images and videos
- Unique filename generation

### Analytics
- Revenue tracking by date range
- Revenue by event and ticket type
- Excel and PDF export functionality

---


## 📝 Available Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🤝 Contributing

This is a portfolio project. If you find any bugs or have suggestions, feel free to open an issue.

---


**Built with ❤️ using the MERN stack**
