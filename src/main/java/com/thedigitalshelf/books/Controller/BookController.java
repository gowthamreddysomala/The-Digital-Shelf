package com.thedigitalshelf.books.Controller;

import com.thedigitalshelf.books.entity.Books;
import com.thedigitalshelf.books.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public ResponseEntity<List<Books>> getAllBooks() {
        List<Books> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Books> getBookById(@PathVariable Integer id) {
        Optional<Books> book = bookService.getBookById(id);
        return book.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Books>> searchBooks(@RequestParam(required = false) String query) {
        List<Books> books = bookService.searchBooks(query);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/author/{author}")
    public ResponseEntity<List<Books>> getBooksByAuthor(@PathVariable String author) {
        List<Books> books = bookService.getBooksByAuthor(author);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/rating/{minRating}")
    public ResponseEntity<List<Books>> getBooksByRating(@PathVariable int minRating) {
        List<Books> books = bookService.getBooksByRating(minRating);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/authors")
    public ResponseEntity<List<String>> getAllAuthors() {
        List<String> authors = bookService.getAllAuthors();
        return ResponseEntity.ok(authors);
    }

    @GetMapping("/stats/average-rating")
    public ResponseEntity<Double> getAverageRating() {
        Double averageRating = bookService.getAverageRating();
        return ResponseEntity.ok(averageRating);
    }

    @GetMapping("/stats/total")
    public ResponseEntity<Long> getTotalBooks() {
        Long total = bookService.getTotalBooks();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Books>> getFeaturedBooks() {
        List<Books> featuredBooks = bookService.getFeaturedBooks();
        return ResponseEntity.ok(featuredBooks);
    }

    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody Books book) {
        try {
            // Validate required fields
            if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Title is required");
            }
            
            // Set default values if not provided
            if (book.getAuthor() == null) {
                book.setAuthor("Unknown Author");
            }
            if (book.getPublisher() == null) {
                book.setPublisher("Unknown Publisher");
            }
            if (book.getDescription() == null) {
                book.setDescription("No description available");
            }
            if (book.getCategory() == null) {
                book.setCategory("General");
            }
            if (book.getImage() == null) {
                book.setImage("");
            }
            if (book.getUrl() == null) {
                book.setUrl("");
            }
            
            Books savedBook = bookService.saveBook(book);
            return ResponseEntity.ok(savedBook);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating book: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Integer id, @RequestBody Books book) {
        try {
            Optional<Books> existingBook = bookService.getBookById(id);
            if (existingBook.isPresent()) {
                // Validate required fields
                if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
                    return ResponseEntity.badRequest().body("Title is required");
                }
                
                // Set default values if not provided
                if (book.getAuthor() == null) {
                    book.setAuthor("Unknown Author");
                }
                if (book.getPublisher() == null) {
                    book.setPublisher("Unknown Publisher");
                }
                if (book.getDescription() == null) {
                    book.setDescription("No description available");
                }
                if (book.getCategory() == null) {
                    book.setCategory("General");
                }
                if (book.getImage() == null) {
                    book.setImage("");
                }
                if (book.getUrl() == null) {
                    book.setUrl("");
                }
                
                book.setId(id);
                Books updatedBook = bookService.saveBook(book);
                return ResponseEntity.ok(updatedBook);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating book: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Integer id) {
        Optional<Books> existingBook = bookService.getBookById(id);
        if (existingBook.isPresent()) {
            bookService.deleteBook(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/views")
    @Transactional
    public ResponseEntity<?> incrementViews(@PathVariable Integer id) {
        Optional<Books> existingBook = bookService.getBookById(id);
        if (existingBook.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        int updated = bookService.incrementViews(id);
        return ResponseEntity.ok().body("views+=" + updated);
    }
}


