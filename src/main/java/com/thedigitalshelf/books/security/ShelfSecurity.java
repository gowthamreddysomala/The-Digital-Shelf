package com.thedigitalshelf.books.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;

@Configuration
public class ShelfSecurity {
    @Bean
    public UserDetailsManager UserDetailsManager(DataSource dataSource) {
        JdbcUserDetailsManager jdbcuserDetailsManager = new JdbcUserDetailsManager(dataSource);
        jdbcuserDetailsManager.setUsersByUsernameQuery("select username, password, active from users where username=?");
        jdbcuserDetailsManager.setAuthoritiesByUsernameQuery("select username, role from roles where username=?");
        return jdbcuserDetailsManager;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorizeRequests -> authorizeRequests
                .anyRequest().permitAll())
                .csrf(csrf -> csrf.disable())
                .formLogin(formLogin -> formLogin
                        .loginPage("/login").permitAll()
                        .loginProcessingUrl("/process").permitAll()
                        .defaultSuccessUrl("/home"));
        return http.build();
    }
}
