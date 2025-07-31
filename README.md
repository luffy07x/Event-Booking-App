# EventHub - Modern Event Reservation System

A modern, elegant event reservation application built with Node.js, Express, MongoDB, and React. This full-stack application allows users to discover, book, and manage events with a beautiful, responsive interface.

## ✨ Features

### For Users
- **Event Discovery**: Browse and search events by category, location, and date
- **Easy Booking**: Simple reservation process with attendee management
- **User Dashboard**: View and manage your bookings
- **Responsive Design**: Beautiful UI that works on all devices

### For Organizers
- **Event Management**: Create, edit, and delete events
- **Reservation Tracking**: Monitor bookings and attendee details
- **Check-in System**: QR code-based attendee check-in
- **Analytics Dashboard**: Insights and statistics for your events

### For Admins
- **User Management**: Manage user roles and permissions
- **System Overview**: Complete system analytics and management

## 🏗️ Architecture

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Architecture**: Clean architecture with separated layers:
  - Controllers (API endpoints)
  - Services (Business logic)
  - Repositories (Data access)
  - Models (Data schemas)
  - DTOs (Data transfer objects)

### Frontend
- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Context API + React Query
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Copy `.env` and update the values:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/event-reservation
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**:
   Make sure MongoDB is running on your system.

5. **Start the backend server**:
   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
event-reservation-app/
├── backend/
│   ├── controller/          # API route handlers
│   ├── service/            # Business logic layer
│   ├── repository/         # Data access layer (future)
│   ├── model/              # MongoDB schemas
│   ├── config/             # Configuration files
│   ├── dto/                # Data transfer objects
│   ├── server.js           # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── public/
│   └── package.json
└── README.md
```

## 🎨 Design System

The application uses a modern design system built with Tailwind CSS:

- **Colors**: Primary (blue) and secondary (purple) gradients
- **Typography**: Inter for body text, Poppins for headings
- **Components**: Consistent button styles, cards, forms, and layouts
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (organizer/admin)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations/my-reservations` - Get user reservations
- `GET /api/reservations/:id` - Get single reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Cancel reservation

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet for security headers
- Role-based access control

## 🎯 Development Status

### ✅ Completed
- Complete backend API with authentication
- Database models and relationships
- Modern React frontend structure
- Responsive navigation and layout
- Beautiful home page with animations
- Authentication system (login page)
- Protected routes and role-based access

### 🚧 In Development
- Event listing and detail pages
- Reservation system
- User profile management
- Event creation and management
- Dashboard and analytics
- Payment integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from modern event platforms
- Icons by Lucide React
- Animations by Framer Motion
- Styling by Tailwind CSS

---

**EventHub** - Making event discovery and booking elegant and effortless. 🎉