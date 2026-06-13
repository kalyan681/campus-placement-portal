package com.placement.portal.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class SignupRequest {

    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @Size(max = 100)
    private String fullName;

    private String phone;

    /** Roles to assign, e.g. ["ROLE_ADMIN", "ROLE_STUDENT"]. Defaults to ROLE_STUDENT. */
    private Set<String> roles;
}
