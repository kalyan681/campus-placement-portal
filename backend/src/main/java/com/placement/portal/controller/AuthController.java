package com.placement.portal.controller;

import com.placement.portal.dto.request.LoginRequest;
import com.placement.portal.dto.request.SignupRequest;
import com.placement.portal.dto.response.ApiResponse;
import com.placement.portal.dto.response.JwtResponse;
import com.placement.portal.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login and registration endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT token")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse jwt = authService.authenticateUser(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", jwt));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody SignupRequest request) {
        ApiResponse<String> response = authService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
