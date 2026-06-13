package com.placement.portal.dto.request;

import com.placement.portal.entity.Student;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StudentRequest {

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Degree is required")
    private String degree;

    @DecimalMin(value = "0.0") @DecimalMax(value = "10.0")
    private Double cgpa;

    @Min(2000)
    private Integer graduationYear;

    private String skills;
    private String resumeUrl;
    private Student.StudentStatus status;
    private Long userId;
}
