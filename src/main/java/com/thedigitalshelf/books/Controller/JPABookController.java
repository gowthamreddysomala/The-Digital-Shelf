package com.thedigitalshelf.books.Controller;

import com.thedigitalshelf.books.entity.Books;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JPABookController extends JpaRepository<Integer , Books> {

}
