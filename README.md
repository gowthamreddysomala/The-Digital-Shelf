# Digital Bookshelf - Full-Stack Digital Library Platform

A comprehensive full-stack digital bookshelf application featuring a Spring Boot backend with JWT authentication and PostgreSQL database, paired with a modern React TypeScript frontend. This platform provides a complete solution for digital library management with advanced search, user authentication, and administrative features.

## 🚀 Features

### Frontend Features
- **Modern Dark Theme**: Professional dark interface with custom color scheme
- **Advanced Search**: Real-time search across titles, authors, and genres
- **Smart Filtering**: Filter by genre, price range, rating, and availability
- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Authentication Flow**: Secure login/register with JWT tokens
- **Protected Routes**: Authentication-based access control
- **Book Details**: Comprehensive book information pages
- **Related Books**: Discover similar books based on genre
- **Admin Dashboard**: Administrative interface for book management
- **Loading States**: Beautiful loading animations and error handling

### Backend Features
- **RESTful API**: Complete REST API with proper HTTP status codes
- **JWT Authentication**: Secure token-based authentication system
- **User Management**: Registration, login, and role-based access control
- **Book Management**: CRUD operations for books with validation
- **Search Engine**: Advanced search with multiple criteria
- **Database Integration**: PostgreSQL for production, H2 for development
- **Security**: Spring Security with password encryption
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Data Validation**: Comprehensive input validation and error handling
- **Featured Books**: Special book categorization and management

## 🛠️ Tech Stack

### Backend Technologies
- **Spring Boot 3.5.4** - Enterprise Java framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **JWT (JSON Web Tokens)** - Secure authentication
- **PostgreSQL** - Production database
- **H2 Database** - Development and testing
- **Maven** - Dependency management and build tool
- **Java 21** - Latest LTS Java version
- **Docker** - Containerization support

### Frontend Technologies
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls

## 📦 Installation & Setup

### Prerequisites
- **Java 21** or higher
- **Node.js 18** or higher
- **PostgreSQL** (for production)
- **Maven 3.6+** (or use included wrapper)
- **Git**

### Backend Setup

1. **Clone the repository:**
```bash
git clone https://github.com/gowthamreddysomala/The-Digital-Shelf.git
cd The-Digital-Shelf
```

2. **Configure Database:**
   - **For Development (H2):** No additional setup required
   - **For Production (PostgreSQL):** Update `src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/digital_shelf
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. **Build and run the backend:**
```bash
# Using Maven wrapper (recommended)
./mvnw clean install
./mvnw spring-boot:run

# Or using installed Maven
mvn clean install
mvn spring-boot:run
```

4. **Backend will start on:** `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd Frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Frontend will start on:** `http://localhost:5173`

### Docker Setup (Optional)

1. **Build and run with Docker:**
```bash
# Build the application
docker build -t digital-shelf .

# Run the container
docker run -p 8080:8080 digital-shelf
```

## 🏗️ Project Structure

### Backend Structure
```
src/main/java/com/thedigitalshelf/books/
├── Controller/              # REST API Controllers
│   ├── BookController.java  # Book management endpoints
│   └── AuthController.java  # Authentication endpoints
├── entity/                  # JPA Entity classes
│   ├── Books.java          # Book entity with database mapping
│   └── User.java           # User entity for authentication
├── service/                 # Business logic layer
│   ├── BookService.java    # Book-related business logic
│   └── AuthService.java    # Authentication services
├── repository/              # Data access layer
│   ├── BookRepository.java # Book data access
│   └── UserRepository.java # User data access
├── security/                # Security configuration
│   ├── JwtUtil.java        # JWT token utilities
│   └── SecurityConfig.java # Spring Security setup
├── dto/                     # Data Transfer Objects
│   └── AuthRequest.java    # Authentication request DTOs
└── TheDigitalShelfApplication.java # Main Spring Boot application
```

### Frontend Structure
```
Frontend/src/
├── components/              # Reusable UI components
│   ├── Header.tsx          # Navigation header with search
│   ├── Footer.tsx          # Application footer
│   └── BookCard.tsx        # Book display card component
├── pages/                   # Page components
│   ├── HomePage.tsx        # Landing page with featured books
│   ├── SearchResultsPage.tsx # Search and filter results
│   ├── BookDetailPage.tsx  # Individual book details
│   ├── LoginPage.tsx       # User authentication
│   ├── RegisterPage.tsx    # User registration
│   └── AdminPage.tsx       # Administrative interface
├── services/                # API and data services
│   ├── bookService.ts      # Book API integration
│   └── authService.ts      # Authentication services
├── contexts/                # React context providers
│   └── AuthContext.tsx     # Authentication state management
├── types/                   # TypeScript type definitions
│   └── index.ts            # Application interfaces
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles and Tailwind imports
```

## 🎨 Design Features

### Dark Theme
- Custom dark color palette with primary blue accents
- Smooth transitions and hover effects
- Professional typography with Inter and Merriweather fonts

### Responsive Layout
- Mobile-first design approach
- Adaptive grid layouts
- Collapsible navigation menu

### Interactive Elements
- Hover animations on book cards
- Smooth page transitions
- Loading states and skeleton screens

## 🔌 API Documentation

### Authentication Endpoints
```http
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
POST /api/auth/refresh        # Refresh JWT token
```

### Book Management Endpoints
```http
GET    /api/books             # Get all books
GET    /api/books/{id}        # Get book by ID
GET    /api/books/search      # Search books with query parameters
GET    /api/books/featured    # Get featured books
GET    /api/books/author/{author}  # Get books by author
GET    /api/books/rating/{minRating}  # Get books by minimum rating
GET    /api/books/authors     # Get all unique authors
GET    /api/books/stats/total # Get total book count
GET    /api/books/stats/average-rating  # Get average rating

POST   /api/books             # Create new book (Admin only)
PUT    /api/books/{id}        # Update book (Admin only)
DELETE /api/books/{id}        # Delete book (Admin only)
```

### Request/Response Examples

#### Login Request
```json
POST /api/auth/login
{
  "username": "user@example.com",
  "password": "password123"
}
```

#### Book Response
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel...",
  "category": "Fiction",
  "price": 12.99,
  "rating": 4,
  "featured": true,
  "image": "https://example.com/cover.jpg",
  "url": "https://example.com/download-link",
  "publishedDate": "1925-04-10",
  "publisher": "Scribner"
}
```

## 🔍 Search & Filtering

### Search Functionality
- Real-time search across titles, authors, and genres
- Advanced query parameters for precise filtering
- Case-insensitive search with partial matching
- URL-based search state management

### Advanced Filters
- **Genre Filter**: Filter by book categories
- **Price Range**: Set minimum and maximum prices
- **Rating Filter**: Filter by minimum star rating
- **Author Filter**: Search by specific authors
- **Featured Books**: Display only featured selections

### Sorting Options
- Sort by title (A-Z, Z-A)
- Sort by price (low to high, high to low)
- Sort by rating (highest to lowest)
- Sort by publication date

## 📱 Pages

### Home Page (`/`)
- Hero section with search functionality
- Featured books showcase
- Complete book collection preview
- Statistics and call-to-action buttons

### Search Results (`/search`)
- Advanced filtering sidebar
- Grid and list view options
- Pagination for large result sets
- Sort and filter controls

### Book Details (`/book/:id`)
- Comprehensive book information
- Related books recommendations
- Download functionality with authentication
- Book metadata and specifications

### Authentication Pages
- **Login Page** (`/login`): User authentication with JWT
- **Register Page** (`/register`): New user registration
- **Protected Routes**: Authentication-required pages

### Admin Dashboard (`/admin`)
- Book management interface (Admin only)
- Create, update, and delete books
- User management and statistics
- Featured books management

## 🎯 Key Components

### BookCard
- Responsive book display card
- Hover effects and animations
- Rating display with stars
- Genre tags and price information
- Stock status indicators

### Header
- Sticky navigation with search
- Mobile-responsive menu
- Cart and user action buttons
- Breadcrumb navigation

### Search Interface
- Advanced filtering controls
- Real-time search input
- Sort and view options
- Pagination controls

## 🗄️ Database Schema

### Books Table (`booksdigital`)
```sql
CREATE TABLE booksdigital (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(200),
    publisher VARCHAR(200),
    published_date VARCHAR(50),
    description VARCHAR(2000),
    category VARCHAR(100),
    image VARCHAR(1000),
    url VARCHAR(1000),
    rating INTEGER,
    price DECIMAL(10,2),
    featured BOOLEAN DEFAULT FALSE
);
```

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure stateless authentication
- **Password Encryption**: BCrypt hashing for user passwords
- **Role-Based Access**: USER and ADMIN role management
- **Protected Endpoints**: Secured API endpoints with Spring Security
- **CORS Configuration**: Proper cross-origin resource sharing setup

### Security Configuration
- **Token Expiration**: Configurable JWT token expiration (24 hours default)
- **Secret Key Management**: Secure JWT signing key
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive information

### Environment Configuration
```properties
# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000

# Database Security
spring.datasource.url=jdbc:postgresql://your-host:5432/database
spring.datasource.username=encrypted-username
spring.datasource.password=encrypted-password
```

## 🚀 Getting Started

### Backend Development
```bash
# Start Spring Boot application
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build JAR file
./mvnw clean package

# Run with specific profile
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

### Frontend Development
```bash
# Navigate to frontend directory
cd Frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Type checking
npm run type-check
```

### Full Stack Development
```bash
# Terminal 1: Start backend
./mvnw spring-boot:run

# Terminal 2: Start frontend
cd Frontend && npm run dev
```

## 🎨 Customization

### Backend Customization

#### Database Configuration
Modify `application.properties` for different environments:
```properties
# Development (H2)
spring.profiles.active=dev
spring.datasource.url=jdbc:h2:mem:testdb

# Production (PostgreSQL)
spring.profiles.active=prod
spring.datasource.url=jdbc:postgresql://localhost:5432/digital_shelf
```

#### JWT Configuration
```properties
jwt.secret=your-custom-secret-key
jwt.expiration=86400000  # 24 hours in milliseconds
```

#### Adding New API Endpoints
1. Create controller methods in `BookController.java`
2. Add service layer logic in `BookService.java`
3. Update repository if needed in `BookRepository.java`

### Frontend Customization

#### Theme Colors
Modify the color scheme in `tailwind.config.js`:
```javascript
colors: {
  gruvbox: {
    dark: {
      primary: '#your-color',
      bg: '#your-background'
    }
  }
}
```

#### API Configuration
Update API base URL in `bookService.ts`:
```typescript
const API_BASE_URL = 'http://your-backend-url/api'
```

## 🚀 Deployment

### Backend Deployment

#### Using Docker
```bash
# Build Docker image
docker build -t digital-shelf-backend .

# Run container
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod digital-shelf-backend
```

#### Using JAR File
```bash
# Build application
./mvnw clean package

# Run JAR
java -jar target/The-Digital-Shelf-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment

#### Build for Production
```bash
cd Frontend
npm run build
```

#### Deploy to Netlify/Vercel
```bash
# Build files will be in Frontend/dist/
# Upload dist folder to your hosting service
```

### Environment Variables
```bash
# Backend
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret

# Frontend
VITE_API_URL=your-backend-url
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

We welcome contributions to the Digital Shelf project! Here's how you can help:

### Backend Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes to the Java/Spring Boot code
4. Add tests for new functionality
5. Ensure all tests pass (`./mvnw test`)
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### Frontend Contributions
1. Navigate to the Frontend directory
2. Create a feature branch
3. Make your changes to React/TypeScript code
4. Test your changes (`npm run build`)
5. Follow the same commit and PR process

### Areas for Contribution
- 🐛 Bug fixes and improvements
- 📚 Documentation enhancements
- 🎨 UI/UX improvements
- 🔧 New features and functionality
- 🧪 Test coverage improvements
- 🌐 Internationalization support

## 📞 Support & Contact

### Issues & Bugs
- **GitHub Issues**: [Report bugs and request features](https://github.com/gowthamreddysomala/The-Digital-Shelf/issues)
- **Documentation**: Check this README and code comments

### Developer Contact
- **GitHub**: [@gowthamreddysomala](https://github.com/gowthamreddysomala)
- **Email**: Available through GitHub profile
- **Location**: Punjab, India

### Project Status
- **Current Version**: 1.0.0
- **Status**: Active Development
- **Last Updated**: 2024

## 🏆 Acknowledgments

- **Spring Boot Community** for the excellent framework
- **React Team** for the powerful frontend library
- **Tailwind CSS** for the utility-first CSS framework
- **PostgreSQL** for the robust database system
- **Open Source Community** for inspiration and tools

---

## 📊 Project Stats

- **Backend**: Java 21 + Spring Boot 3.5.4
- **Frontend**: React 18 + TypeScript
- **Database**: PostgreSQL + H2
- **Authentication**: JWT + Spring Security
- **Deployment**: Docker Ready
- **License**: MIT

---

**Built with ❤️ by [Gowtham Reddy](https://github.com/gowthamreddysomala)**

*Spring Boot enthusiast | JPA & Database Schema Design | Backend Development | Clean Code Advocate*





