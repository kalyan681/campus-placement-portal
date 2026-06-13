package com.placement.portal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * Student entity representing enrolled students eligible for placements.
 */
@Entity
@Table(name = "students",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "roll_number"),
        @UniqueConstraint(columnNames = "email")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "roll_number", nullable = false, unique = true)
    private String rollNumber;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @NotBlank
    @Email
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @NotBlank
    @Column(name = "department", nullable = false)
    private String department;

    @NotBlank
    @Column(name = "degree", nullable = false)
    private String degree;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    @Column(name = "cgpa")
    private Double cgpa;

    @Min(2000)
    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private StudentStatus status = StudentStatus.ACTIVE;

    @Column(name = "is_placed", nullable = false)
    @Builder.Default
    private Boolean isPlaced = false;

    @Column(name = "placed_company")
    private String placedCompany;

    @Column(name = "package_lpa")
    private Double packageLpa;

    // Link to user account (optional — for student login)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public enum StudentStatus {
        ACTIVE, INACTIVE, GRADUATED, PLACED
    }

    /** Convenience method for full name */
    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
