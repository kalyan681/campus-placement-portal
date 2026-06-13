package com.placement.portal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * PlacementDrive entity representing a company's campus recruitment drive.
 */
@Entity
@Table(name = "placement_drives")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementDrive extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "job_role", nullable = false)
    private String jobRole;

    @Column(name = "job_type")
    private String jobType;  // Full-time, Internship, Part-time

    @DecimalMin("0.0")
    @Column(name = "package_lpa")
    private Double packageLpa;

    @DecimalMin("0.0")
    @Column(name = "min_cgpa")
    @Builder.Default
    private Double minCgpa = 0.0;

    @Column(name = "eligible_departments", columnDefinition = "TEXT")
    private String eligibleDepartments; // CSV: "CSE,IT,ECE"

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(name = "drive_date")
    private LocalDate driveDate;

    @Column(name = "last_date_to_apply")
    private LocalDate lastDateToApply;

    @Column(name = "location")
    private String location;

    @Column(name = "vacancy_count")
    private Integer vacancyCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private DriveStatus status = DriveStatus.UPCOMING;

    @OneToMany(mappedBy = "placementDrive", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Application> applications = new ArrayList<>();

    public enum DriveStatus {
        UPCOMING, ACTIVE, COMPLETED, CANCELLED
    }
}
