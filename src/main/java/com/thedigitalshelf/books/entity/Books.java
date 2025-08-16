package com.thedigitalshelf.books.entity;
import jakarta.persistence.*;
@Entity
@Table(name = "books")
public class Books {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name ="title" , nullable = false)
    private String title;
    @Column(name ="author" , nullable = false)
    private String author;
    @Column(name = "rating")
    private int rating;
    @Column(name = "description" , nullable = false)
    private String description;
    // getters and setters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getAuthor() {
        return author;
    }
    public void setAuthor(String author) {
        this.author = author;
    }
    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    // no Args Constructor and All args constructor
    public Books() {
    }
    public Books(String title, String author, int rating, String description) {
        this.title = title;
        this.author = author;
        this.rating = rating;
        this.description = description;
    }
    @Override
    public String toString() {
        return "Books{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", rating=" + rating +
                ", description='" + description + '\'' +
                '}';
    }
}
