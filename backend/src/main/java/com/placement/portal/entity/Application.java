package com.placement.portal.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Application entity representing a student's application to a placement drive.
 */
@Entity
@Table(name = "applications",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "drive_id"})
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drive_id", nullable = false)
    private PlacementDrive placementDrive;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "interview_date")
    private java.time.LocalDate interviewDate;

    @Column(name = "offer_letter_url")
    private String offerLetterUrl;

    @Column(name = "offered_package")
    private Double offeredPackage;

    public enum ApplicationStatus {
        APPLIED,
        SHORTLISTED,
        INTERVIEW_SCHEDULED,
        SELECTED,
        REJECTED,
        WITHDRAWN
    }
}
