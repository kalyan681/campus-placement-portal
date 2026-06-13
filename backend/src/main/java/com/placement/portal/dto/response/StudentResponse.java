package com.placement.portal.dto.response;

import com.placement.portal.entity.Student;
import lombok.*;

import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StudentResponse {
    private Long id;
    private String rollNumber;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String department;
    private String degree;
    private Double cgpa;
    private Integer graduationYear;
    private String skills;
    private String resumeUrl;
    private Student.StudentStatus status;
    private Boolean isPlaced;
    private String placedCompany;
    private Double packageLpa;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
