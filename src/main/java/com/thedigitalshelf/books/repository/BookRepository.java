package com.thedigitalshelf.books.repository;

import com.thedigitalshelf.books.entity.Books;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Books, Integer> {
    
    @Query("SELECT b FROM Books b WHERE b.title LIKE %:query% OR b.author LIKE %:query% OR b.description LIKE %:query%")
    List<Books> searchBooks(@Param("query") String query);
    
    List<Books> findByAuthorContainingIgnoreCase(String author);
    
    List<Books> findByRatingGreaterThanEqual(int rating);
    
    @Query("SELECT DISTINCT b.author FROM Books b")
    List<String> findAllAuthors();
    
    @Query("SELECT AVG(b.rating) FROM Books b")
    Double getAverageRating();
    
    List<Books> findByFeaturedTrue();
}


