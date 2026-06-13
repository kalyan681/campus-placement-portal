package com.placement.portal.service;

import com.placement.portal.dto.request.LoginRequest;
import com.placement.portal.dto.request.SignupRequest;
import com.placement.portal.dto.response.ApiResponse;
import com.placement.portal.dto.response.JwtResponse;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    ApiResponse<String> registerUser(SignupRequest signupRequest);
}
