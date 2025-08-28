package com.thedigitalshelf.books.service;

import com.thedigitalshelf.books.entity.Books;
import com.thedigitalshelf.books.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<Books> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Books> getBookById(Integer id) {
        return bookRepository.findById(id);
    }

    public List<Books> searchBooks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllBooks();
        }
        return bookRepository.searchBooks(query.trim());
    }

    public List<Books> getBooksByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }

    public List<Books> getBooksByRating(int minRating) {
        return bookRepository.findByRatingGreaterThanEqual(minRating);
    }

    public List<String> getAllAuthors() {
        return bookRepository.findAllAuthors();
    }

    public Double getAverageRating() {
        return bookRepository.getAverageRating();
    }

    public Books saveBook(Books book) {
        return bookRepository.save(book);
    }

    public void deleteBook(Integer id) {
        bookRepository.deleteById(id);
    }

    public long getTotalBooks() {
        return bookRepository.count();
    }
    
    public List<Books> getFeaturedBooks() {
        return bookRepository.findByFeaturedTrue();
    }

    @Transactional
    public int incrementViews(Integer id) {
        return bookRepository.incrementViews(id);
    }
}


