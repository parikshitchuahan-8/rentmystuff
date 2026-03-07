package com.example.rentmystuff.user.service;

import com.example.rentmystuff.user.dto.UserResponse;

import java.util.List;
import java.util.UUID;

public interface UserService {

    UserResponse getUserById(UUID id);
    UserResponse getByEmail(String email);
    List<UserResponse> getAllUsers();
}
