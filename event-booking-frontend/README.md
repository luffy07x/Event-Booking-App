# EventHub - Event Booking Frontend

A modern, elegant event booking platform built with React, featuring a beautiful UI and comprehensive functionality for discovering and booking events.

## 🌟 Features

### Core Functionality
- **Event Discovery**: Browse and search through various events
- **Advanced Filtering**: Filter by category, search terms, and featured events
- **Event Details**: Comprehensive event information with booking capability
- **Booking System**: Complete booking flow with form validation
- **User Profile**: View booking history and manage account

### UI/UX Features
- **Modern Design**: Clean, elegant interface with Tailwind CSS
- **Responsive Layout**: Fully responsive across all devices
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Interactive Elements**: Hover effects, loading states, and micro-interactions
- **Toast Notifications**: Real-time feedback for user actions

### Technical Features
- **React 18**: Latest React with hooks and context API
- **React Router**: Client-side routing with URL parameter support
- **Form Validation**: React Hook Form with comprehensive validation
- **State Management**: Context API for global state management
- **Modern Styling**: Tailwind CSS with custom design system
- **Type Safety**: PropTypes for component validation

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2.0
- **Routing**: React Router DOM 6.8.0
- **Styling**: Tailwind CSS 3.2.0
- **Animations**: Framer Motion 10.0.0
- **Forms**: React Hook Form 7.43.0
- **HTTP Client**: Axios 1.3.0
- **Notifications**: React Hot Toast 2.4.0
- **Icons**: React Icons 4.7.1
- **Date Handling**: date-fns 2.29.3
- **Build Tool**: React Scripts 5.0.1

## 📁 Project Structure

```
event-booking-frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.js              # Navigation header
│   │   ├── EventCard.js           # Event display card
│   │   ├── BookingForm.js         # Event booking form
│   │   ├── FilterBar.js           # Event filtering component
│   │   └── LoadingSpinner.js      # Loading indicator
│   ├── pages/
│   │   ├── Home.js                # Landing page
│   │   ├── Events.js              # Events listing page
│   │   ├── EventDetails.js        # Individual event page
│   │   └── Profile.js             # User profile page
│   ├── services/
│   │   └── eventService.js        # API service layer
│   ├── context/
│   │   └── EventContext.js        # Global state management
│   ├── utils/
│   │   └── helpers.js             # Utility functions
│   ├── styles/
│   │   └── index.css              # Global styles
│   ├── App.js                     # Main app component
│   └── index.js                   # App entry point
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or extract the project**
   ```bash
   cd event-booking-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🎨 Design System

### Colors
- **Primary**: Blue shades (#3b82f6 family)
- **Secondary**: Gray shades (#64748b family)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)
- **Captions**: Medium weight (500)

### Components
- **Cards**: Rounded corners, soft shadows, hover effects
- **Buttons**: Primary and secondary variants with hover states
- **Forms**: Clean inputs with focus states and validation
- **Navigation**: Sticky header with smooth transitions

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🔧 Configuration

### API Integration
The app includes a service layer (`eventService.js`) that can be easily connected to a real backend API. Currently uses mock data for demonstration.

### Customization
- **Colors**: Update `tailwind.config.js` for color scheme changes
- **Fonts**: Modify font imports in `src/styles/index.css`
- **Layout**: Adjust responsive breakpoints in Tailwind config

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deployment Options
- **Netlify**: Drag and drop the build folder
- **Vercel**: Connect your repository for automatic deployments
- **GitHub Pages**: Use `gh-pages` package for GitHub hosting
- **Traditional Hosting**: Upload build folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Unsplash**: High-quality event images
- **Heroicons/Feather**: Beautiful icon sets
- **Tailwind CSS**: Utility-first CSS framework
- **React Community**: Amazing ecosystem and resources

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

---

Built with ❤️ using React and modern web technologies.