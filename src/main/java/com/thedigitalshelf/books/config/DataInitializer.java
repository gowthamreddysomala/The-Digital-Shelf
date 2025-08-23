package com.thedigitalshelf.books.config;

import com.thedigitalshelf.books.entity.Books;
import com.thedigitalshelf.books.entity.User;
import com.thedigitalshelf.books.repository.BookRepository;
import com.thedigitalshelf.books.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize default user
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole("ADMIN");
            userRepository.save(adminUser);
        }

        // Initialize sample books if none exist
        if (bookRepository.count() == 0) {
            initializeBooks();
        }
    }

    private void initializeBooks() {
        Books[] sampleBooks = {
            new Books("The Great Gatsby", "F. Scott Fitzgerald", "Scribner", "1925-04-10", "A story of decadence and excess, Gatsby explores the darker aspects of the Jazz Age.", "Fiction", "https://picsum.photos/300/400?random=1", "https://example.com/gatsby", 5, 12.99f, true),
            new Books("To Kill a Mockingbird", "Harper Lee", "Grand Central Publishing", "1960-07-11", "A powerful story of racial injustice and the loss of innocence in the American South.", "Fiction", "https://picsum.photos/300/400?random=2", "https://example.com/mockingbird", 4, 14.99f, true),
            new Books("1984", "George Orwell", "Signet Classic", "1949-06-08", "A dystopian novel about totalitarianism and the manipulation of truth and reality.", "Fiction", "https://picsum.photos/300/400?random=3", "https://example.com/1984", 5, 11.99f, true),
            new Books("Pride and Prejudice", "Jane Austen", "Penguin Classics", "1813-01-28", "A classic romance novel exploring themes of love, marriage, and social class.", "Fiction", "https://picsum.photos/300/400?random=4", "https://example.com/pride", 4, 9.99f, false),
            new Books("The Hobbit", "J.R.R. Tolkien", "Houghton Mifflin Harcourt", "1937-09-21", "An epic fantasy adventure following Bilbo Baggins on his journey with thirteen dwarves.", "Fantasy", "https://picsum.photos/300/400?random=5", "https://example.com/hobbit", 5, 15.99f, true),
            new Books("The Catcher in the Rye", "J.D. Salinger", "Little, Brown and Company", "1951-07-16", "A coming-of-age story about teenage alienation and loss of innocence in post-World War II America.", "Fiction", "https://picsum.photos/300/400?random=6", "https://example.com/catcher", 3, 13.99f, false),
            new Books("Lord of the Flies", "William Golding", "Penguin Books", "1954-09-17", "A group of British boys stranded on an uninhabited island and their disastrous attempt to govern themselves.", "Fiction", "https://picsum.photos/300/400?random=7", "https://example.com/flies", 4, 10.99f, false),
            new Books("Animal Farm", "George Orwell", "Signet", "1945-08-17", "A satirical allegory of the Russian Revolution and the rise of Stalinism.", "Fiction", "https://picsum.photos/300/400?random=8", "https://example.com/farm", 4, 8.99f, false),
            new Books("The Alchemist", "Paulo Coelho", "HarperOne", "1988-01-01", "A magical story about following your dreams and listening to your heart.", "Fiction", "", "https://example.com/alchemist", 5, 16.99f, true),
            new Books("Brave New World", "Aldous Huxley", "Harper Perennial", "1932-01-01", "A dystopian novel about a futuristic society controlled by technology and conditioning.", "Fiction", null, "https://example.com/brave", 4, 13.99f, false)
        };

        for (Books book : sampleBooks) {
            bookRepository.save(book);
        }
    }
}
