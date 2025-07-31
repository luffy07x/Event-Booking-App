# EventHub - Modern Event Reservation System

A full-stack web application for discovering and booking events, built with Java Spring Boot backend and React frontend.

## 🚀 Features

### For Users
- **Event Discovery**: Browse and search through various events
- **Easy Booking**: Reserve tickets with just a few clicks
- **User Dashboard**: Manage your reservations and profile
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live capacity updates and booking confirmations

### For Administrators
- **Event Management**: Create, update, and manage events
- **Reservation Monitoring**: Track bookings and attendee information
- **Analytics Dashboard**: View booking statistics and trends

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.0 with Java 17
- **Security**: JWT-based authentication with Spring Security
- **Database**: H2 (development) / PostgreSQL (production)
- **API**: RESTful endpoints with comprehensive error handling
- **Validation**: Bean validation with custom validators

### Frontend (React)
- **Framework**: React 18 with modern hooks
- **Styling**: Styled Components with a modern design system
- **State Management**: React Query for server state, Context API for auth
- **Routing**: React Router with protected routes
- **Forms**: React Hook Form with validation
- **Animations**: Framer Motion for smooth interactions

## 📁 Project Structure

```
event-reservation-system/
├── backend/
│   ├── src/main/java/com/eventreservation/
│   │   ├── controller/          # REST API controllers
│   │   ├── service/             # Business logic layer
│   │   ├── repository/          # Data access layer
│   │   ├── model/               # JPA entities
│   │   ├── dto/                 # Data transfer objects
│   │   ├── config/              # Configuration classes
│   │   └── security/            # JWT and security components
│   ├── src/main/resources/
│   │   ├── application.yml      # Application configuration
│   │   └── data.sql             # Sample data
│   └── pom.xml                  # Maven dependencies
└── frontend/
    ├── src/
    │   ├── components/          # Reusable UI components
    │   ├── pages/               # Page components
    │   ├── services/            # API service layer
    │   ├── contexts/            # React contexts
    │   ├── styles/              # Theme and global styles
    │   └── App.js               # Main application component
    ├── public/                  # Static assets
    └── package.json             # NPM dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies and run**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. **Access the API**:
   - API Base URL: `http://localhost:8080/api`
   - H2 Console: `http://localhost:8080/h2-console`
   - Default admin credentials: `admin@eventreservation.com` / `password123`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   - Frontend URL: `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:eventdb
    username: sa
    password: password
  
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true

jwt:
  secret: your-secret-key
  expiration: 86400000

cors:
  allowed-origins: http://localhost:3000
```

### Frontend Configuration
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

## 📊 Database Schema

### Core Entities
- **Users**: User authentication and profile information
- **Events**: Event details, capacity, and scheduling
- **Reservations**: Booking records linking users to events

### Key Relationships
- User → Reservations (One-to-Many)
- Event → Reservations (One-to-Many)
- User ← Reservation → Event (Many-to-Many through Reservation)

## 🔒 Security

### Authentication Flow
1. User registers/logs in with email and password
2. Backend validates credentials and returns JWT token
3. Frontend stores token and includes it in API requests
4. Backend validates token on protected endpoints

### Authorization Levels
- **Public**: Event browsing and search
- **Authenticated**: Booking, dashboard, profile management
- **Admin**: Event creation, user management, analytics

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Secondary**: Purple gradient (#d946ef to #c026d3)
- **Neutral**: Gray scale (#f9fafb to #111827)
- **Semantic**: Success, warning, and error colors

### Typography
- **Font Family**: Inter (Google Fonts)
- **Scale**: Modular scale from 12px to 60px
- **Weights**: 300, 400, 500, 600, 700

## 🚀 Deployment

### Backend Deployment
1. **Build the application**:
   ```bash
   mvn clean package
   ```

2. **Run the JAR file**:
   ```bash
   java -jar target/event-reservation-backend-1.0.0.jar
   ```

### Frontend Deployment
1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy the build folder** to your preferred hosting service

## 🧪 Testing

### Backend Testing
```bash
mvn test
```

### Frontend Testing
```bash
npm test
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Event Endpoints
- `GET /api/events` - List all events
- `GET /api/events/{id}` - Get event by ID
- `GET /api/events/featured` - Get featured events
- `GET /api/events/search` - Search events
- `POST /api/events` - Create event (Admin)

### Reservation Endpoints
- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - Get user reservations
- `PUT /api/reservations/{id}/cancel` - Cancel reservation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- All open-source contributors who made this project possible

## 📞 Support

For support, email support@eventhub.com or create an issue in this repository.

---

Made with ❤️ by the EventHub Team