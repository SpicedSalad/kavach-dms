package com.example.kavachdms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
public class SecurityBeansConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Temporary users until PostgreSQL is connected
    @Bean
    public UserDetailsService userDetailsService(
            PasswordEncoder passwordEncoder) {

        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .roles("ADMIN")
                .build();

        UserDetails officer = User.builder()
                .username("officer")
                .password(passwordEncoder.encode("officer123"))
                .roles("OFFICER")
                .build();

        UserDetails forensic = User.builder()
                .username("forensic")
                .password(passwordEncoder.encode("forensic123"))
                .roles("FORENSIC")
                .build();

        return new InMemoryUserDetailsManager(
                admin,
                officer,
                forensic
        );
    }
}