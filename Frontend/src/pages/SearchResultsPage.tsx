import {useEffect, useState} from 'react'
import {useQuery} from 'react-query'
import {useSearchParams} from 'react-router-dom'
import {motion} from 'framer-motion'
import {Filter, Grid, List, Search, SortAsc, SortDesc} from 'lucide-react'
import BookCard from '../components/BookCard'
import {bookService} from '../services/bookService'
import {Book, SearchFilters} from '../types'

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [sortBy, setSortBy] = useState('title')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)

  const query = searchParams.get('q') || ''
  const genreFilter = searchParams.get('genre') || ''

  useEffect(() => {
    setSearchQuery(query)
    if (genreFilter) {
      setFilters(prev => ({ ...prev, genre: genreFilter }))
    }
  }, [query, genreFilter])

  const { data: searchResults, isLoading } = useQuery(
    ['search', query, filters, currentPage],
    () => bookService.getBooks({
      query,
      filters,
      page: currentPage,
      limit: 12
    }),
    {
      keepPreviousData: true
    }
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() })
      setCurrentPage(1)
    }
  }

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    setCurrentPage(1)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const clearFilters = () => {
    setFilters({})
    setCurrentPage(1)
  }

  const totalPages = searchResults?.totalPages || 1

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
            {query ? `Search Results for "${query}"` : 'Browse All Books'}
          </h1>
          <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
            {searchResults?.total || 0} books found
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for books, authors, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pr-12 bg-gruvbox-light-bg0/80 dark:bg-gruvbox-dark-bg0/80 backdrop-blur-md border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 shadow-lg shadow-black/10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3 hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 space-y-6"
        >
          <div className="bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-lg p-6 shadow-xl shadow-black/10">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-gruvbox-light-blue dark:text-gruvbox-dark-blue" />
              <h3 className="font-semibold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Filters</h3>
            </div>

            {/* Genre Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Genre</label>
              <select
                value={filters.genre || ''}
                onChange={(e) => handleFilterChange({ genre: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-gruvbox-light-bg0/80 dark:bg-gruvbox-dark-bg0/80 backdrop-blur-sm border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-lg text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 focus:outline-none focus:ring-2 focus:ring-gruvbox-light-blue dark:focus:ring-gruvbox-dark-blue focus:border-transparent"
              >
                <option value="">All Genres</option>
                <option value="fiction">Fiction</option>
                <option value="classic">Classic</option>
                <option value="romance">Romance</option>
                <option value="dystopian">Dystopian</option>
                <option value="fantasy">Fantasy</option>
                <option value="adventure">Adventure</option>
                <option value="political">Political</option>
                <option value="satire">Satire</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3 mt-4">
              <label className="text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Price Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.min || ''}
                  onChange={(e) => handleFilterChange({
                    priceRange: {
                      min: e.target.value ? Number(e.target.value) : undefined,
                      max: filters.priceRange?.max
                    }
                  })}
                  className="w-1/2 px-3 py-2 bg-gruvbox-light-bg0/80 dark:bg-gruvbox-dark-bg0/80 backdrop-blur-sm border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-lg text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 focus:outline-none focus:ring-2 focus:ring-gruvbox-light-blue dark:focus:ring-gruvbox-dark-blue focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.max || ''}
                  onChange={(e) => handleFilterChange({
                    priceRange: {
                      min: filters.priceRange?.min,
                      max: e.target.value ? Number(e.target.value) : undefined
                    }
                  })}
                  className="w-1/2 px-3 py-2 bg-gruvbox-light-bg0/80 dark:bg-gruvbox-dark-bg0/80 backdrop-blur-sm border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-lg text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 focus:outline-none focus:ring-2 focus:ring-gruvbox-light-blue dark:focus:ring-gruvbox-dark-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3 mt-4">
              <label className="text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Minimum Rating</label>
              <select
                value={filters.rating || ''}
                onChange={(e) => handleFilterChange({ rating: Number(e.target.value) || undefined })}
                className="w-full px-3 py-2 bg-gruvbox-light-bg0/80 dark:bg-gruvbox-dark-bg0/80 backdrop-blur-sm border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-lg text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 focus:outline-none focus:ring-2 focus:ring-gruvbox-light-blue dark:focus:ring-gruvbox-dark-blue focus:border-transparent"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            {/* Stock Filter */}
            <div className="space-y-3 mt-4">
              <label className="text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Availability</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock === true}
                    onChange={(e) => handleFilterChange({ inStock: e.target.checked ? true : undefined })}
                    className="rounded border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 bg-gruvbox-light-bg0/80 dark:bg-gruvbox-dark-bg0/80 text-gruvbox-light-blue dark:text-gruvbox-dark-blue focus:ring-gruvbox-light-blue dark:focus:ring-gruvbox-dark-blue"
                  />
                  <span className="text-sm text-gruvbox-light-fg dark:text-gruvbox-dark-fg">In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full mt-6 px-4 py-2 bg-gruvbox-light-bg1/60 dark:bg-gruvbox-dark-bg1/60 backdrop-blur-sm hover:bg-gruvbox-light-bg1/80 dark:hover:bg-gruvbox-dark-bg1/80 text-gruvbox-light-fg dark:text-gruvbox-dark-fg rounded-lg transition-colors duration-200 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <div className="flex-1 space-y-6">
          {/* Sort and View Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
          >
            <div className="flex items-center space-x-4">
              <span className="text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Sort by:</span>
              <button
                onClick={() => handleSort('title')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'title' ? 'bg-gruvbox-light-blue/90 backdrop-blur-sm text-gruvbox-light-fg shadow-lg' : 'bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md text-gruvbox-light-fg hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 shadow-lg shadow-black/10'
                }`}
              >
                <span>Title</span>
                {sortBy === 'title' && (
                  sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => handleSort('price')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'price' ? 'bg-gruvbox-light-blue/90 backdrop-blur-sm text-gruvbox-light-fg shadow-lg' : 'bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md text-gruvbox-light-fg hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 shadow-lg shadow-black/10'
                }`}
              >
                <span>Price</span>
                {sortBy === 'price' && (
                  sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => handleSort('rating')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'rating' ? 'bg-gruvbox-light-blue/90 backdrop-blur-sm text-gruvbox-light-fg shadow-lg' : 'bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md text-gruvbox-light-fg hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 shadow-lg shadow-black/10'
                }`}
              >
                <span>Rating</span>
                {sortBy === 'rating' && (
                  sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-gruvbox-light-blue/90 backdrop-blur-sm text-gruvbox-light-fg shadow-lg' : 'bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md text-gruvbox-light-fg hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 shadow-lg shadow-black/10'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-gruvbox-light-blue/90 backdrop-blur-sm text-gruvbox-light-fg shadow-lg' : 'bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md text-gruvbox-light-fg hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 shadow-lg shadow-black/10'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          {/* Results Grid */}
          {isLoading ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' 
                : 'grid-cols-1'
            }`}>
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl p-4 shadow-xl shadow-black/10">
                    <div className="bg-gruvbox-light-bg1/60 dark:bg-gruvbox-dark-bg1/60 h-64 rounded-lg mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gruvbox-light-bg1/60 dark:bg-gruvbox-dark-bg1/60 rounded" />
                      <div className="h-3 bg-gruvbox-light-bg1/60 dark:bg-gruvbox-dark-bg1/60 rounded w-3/4" />
                      <div className="h-3 bg-gruvbox-light-bg1/60 dark:bg-gruvbox-dark-bg1/60 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults?.data.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gruvbox-light-fg dark:text-gruvbox-dark-fg text-lg mb-4">No books found</div>
              <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Try adjusting your search criteria or filters</p>
            </motion.div>
          ) : (
            <>
                          <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' 
                : 'grid-cols-1'
            }`}>
                {searchResults?.data.map((book: Book, index: number) => (
                  <BookCard key={book.id} book={book} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center space-x-2"
                >
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 disabled:opacity-50 disabled:cursor-not-allowed text-gruvbox-light-fg dark:text-gruvbox-dark-fg rounded-lg transition-colors duration-200 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 shadow-lg shadow-black/10"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                          currentPage === page
                            ? 'bg-gruvbox-light-blue/90 backdrop-blur-sm text-gruvbox-light-fg shadow-lg'
                            : 'bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 text-gruvbox-light-fg hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 shadow-lg shadow-black/10'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 disabled:opacity-50 disabled:cursor-not-allowed text-gruvbox-light-fg dark:text-gruvbox-dark-fg rounded-lg transition-colors duration-200 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 shadow-lg shadow-black/10"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage
