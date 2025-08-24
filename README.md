# Digital Bookshelf - Modern Bookstore Frontend

A modern, professional digital bookshelf frontend application built with React, TypeScript, and Tailwind CSS. Features a dark theme by default with advanced search functionality, filtering, and a beautiful user interface.

## 🚀 Features

- **Modern Dark Theme**: Professional dark interface with custom color scheme
- **Advanced Search**: Search books by title, author, genre, or description
- **Smart Filtering**: Filter by genre, price range, rating, and availability
- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Book Details**: Comprehensive book information pages
- **Related Books**: Discover similar books based on genre
- **Pagination**: Efficient browsing with pagination
- **Loading States**: Beautiful loading animations
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd digital-bookshelf
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Frontend - Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header with search
│   └── BookCard.tsx    # Book display card component
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page with featured books
│   ├── SearchResultsPage.tsx  # Search and filter results
│   └── BookDetailPage.tsx     # Individual book details
├── services/           # API and data services
│   └── bookService.ts  # Mock book data and API simulation
├── types/              # TypeScript type definitions
│   └── index.ts        # Application interfaces
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
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

## 🔍 Search & Filtering

### Search Functionality
- Real-time search across titles, authors, and genres
- Search suggestions and autocomplete
- URL-based search state management

### Advanced Filters
- **Genre Filter**: Filter by book categories
- **Price Range**: Set minimum and maximum prices
- **Rating Filter**: Filter by minimum star rating
- **Availability**: Show only in-stock items

### Sorting Options
- Sort by title (A-Z, Z-A)
- Sort by price (low to high, high to low)
- Sort by rating (highest to lowest)

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
- Add to cart and wishlist functionality
- Book metadata and specifications

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

## 🚀 Getting Started

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Customization

#### Colors
Modify the color scheme in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Custom primary colors
  },
  dark: {
    // Custom dark theme colors
  }
}
```

#### Adding New Books
Update the mock data in `src/services/bookService.ts`:
```typescript
const mockBooks: Book[] = [
  // Add your book data here
]
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the repository or contact the development team.

---

Built by Gowtham Reddy





