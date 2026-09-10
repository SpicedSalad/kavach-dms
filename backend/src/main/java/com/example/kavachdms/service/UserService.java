package com.example.kavachdms.service;

import com.example.kavachdms.entity.User;
import com.example.kavachdms.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
