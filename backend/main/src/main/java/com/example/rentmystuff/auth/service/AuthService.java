package com.example.rentmystuff.auth.service;

import com.example.rentmystuff.auth.dto.*;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
