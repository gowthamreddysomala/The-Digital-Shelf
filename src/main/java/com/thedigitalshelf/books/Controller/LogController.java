package com.thedigitalshelf.books.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LogController {
    @GetMapping("/login")
    public String login(){
        return "login";
    }
    @GetMapping("/Register")
    public String register(){
        return "/register";
    }
    @GetMapping("/Error")
    public String error(){
        return "error";
    }

}
