package com.example.rentmystuff.user.mapper;

import com.example.rentmystuff.user.dto.UserResponse;
import com.example.rentmystuff.user.entity.User;

public class UserMapper {

    public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}

