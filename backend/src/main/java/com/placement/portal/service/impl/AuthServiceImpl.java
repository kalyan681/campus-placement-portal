package com.placement.portal.service.impl;

import com.placement.portal.dto.request.LoginRequest;
import com.placement.portal.dto.request.SignupRequest;
import com.placement.portal.dto.response.ApiResponse;
import com.placement.portal.dto.response.JwtResponse;
import com.placement.portal.entity.Role;
import com.placement.portal.entity.User;
import com.placement.portal.exception.DuplicateResourceException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.RoleRepository;
import com.placement.portal.repository.UserRepository;
import com.placement.portal.security.jwt.JwtUtils;
import com.placement.portal.security.service.UserDetailsImpl;
import com.placement.portal.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public JwtResponse authenticateUser(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        log.info("User '{}' authenticated successfully", request.getUsername());

        return JwtResponse.builder()
            .token(jwt)
            .id(userDetails.getId())
            .username(userDetails.getUsername())
            .email(userDetails.getEmail())
            .fullName(userDetails.getFullName())
            .roles(roles)
            .build();
    }

    @Override
    @Transactional
    public ApiResponse<String> registerUser(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already in use");
        }

        // Build new user
        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .fullName(request.getFullName())
            .phone(request.getPhone())
            .build();

        // Assign roles
        Set<String> strRoles = request.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            roles.add(fetchRole(Role.ERole.ROLE_STUDENT));
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin"   -> roles.add(fetchRole(Role.ERole.ROLE_ADMIN));
                    case "company" -> roles.add(fetchRole(Role.ERole.ROLE_COMPANY));
                    default        -> roles.add(fetchRole(Role.ERole.ROLE_STUDENT));
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
        log.info("Registered new user: {}", request.getUsername());

        return ApiResponse.success("User registered successfully!");
    }

    private Role fetchRole(Role.ERole eRole) {
        return roleRepository.findByName(eRole)
            .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + eRole));
    }
}
