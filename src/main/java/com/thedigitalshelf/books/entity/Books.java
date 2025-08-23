package com.thedigitalshelf.books.entity;
import jakarta.persistence.*;
@Entity
@Table(name = "booksdigital")
public class Books {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "title" , nullable = false, length = 500)
    private String title;
    @Column(name ="author" , nullable = true, length = 200)
    private String author;
    @Column(name = "publisher" , nullable = true, length = 200)
    private String publisher;
    @Column(name = "published_date", length = 50)
    private String publishedDate;
    @Column(name = "description", length = 2000)
    private String description;
    @Column(name = "category", length = 100)
    private String category;
    @Column(name = "image", length = 1000)
    private String image;
    @Column(name = "url", length = 1000)
    private String url;
    @Column(name = "rating")
    private int rating;
    @Column(name = "price")
    private float price;
    
    @Column(name = "featured", nullable = false)
    private boolean featured = false;

    // no-args constructor
    public Books() {

    }
    // all-args Constructor except id

    public Books(String title, String author, String publisher, String publishedDate, String description, String category, String image, String url, int rating, float price, boolean featured) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.publishedDate = publishedDate;
        this.description = description;
        this.category = category;
        this.image = image;
        this.url = url;
        this.rating = rating;
        this.price = price;
        this.featured = featured;
    }


    // getters and Setters

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

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(String publishedDate) {
        this.publishedDate = publishedDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    @Override
    public String toString() {
        return "Books{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", publisher='" + publisher + '\'' +
                ", publishedDate='" + publishedDate + '\'' +
                ", description='" + description + '\'' +
                ", category='" + category + '\'' +
                ", image='" + image + '\'' +
                ", url='" + url + '\'' +
                ", rating=" + rating +
                ", price=" + price +
                ", featured=" + featured +
                '}';
    }
}