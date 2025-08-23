package com.thedigitalshelf.books.service;

import com.thedigitalshelf.books.dto.AuthRequest;
import com.thedigitalshelf.books.dto.AuthResponse;
import com.thedigitalshelf.books.entity.User;
import com.thedigitalshelf.books.repository.UserRepository;
import com.thedigitalshelf.books.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(AuthRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse("Username already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(request.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);

            if (user != null) {
                // Generate JWT token
                String token = jwtUtil.generateToken(userDetails);
                return new AuthResponse(token, user.getUsername(), user.getRole());
            } else {
                return new AuthResponse("User not found");
            }
        } catch (Exception e) {
            return new AuthResponse("Invalid username or password");
        }
    }
}


