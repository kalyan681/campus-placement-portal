package com.placement.portal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * Company entity representing companies participating in placement drives.
 */
@Entity
@Table(name = "companies",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 150)
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank
    @Email
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "website")
    private String website;

    @NotBlank
    @Column(name = "industry", nullable = false)
    private String industry;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "country")
    @Builder.Default
    private String country = "India";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private CompanyStatus status = CompanyStatus.ACTIVE;

    @Column(name = "hr_contact_name")
    private String hrContactName;

    @Column(name = "hr_contact_email")
    private String hrContactEmail;

    public enum CompanyStatus {
        ACTIVE, INACTIVE, BLACKLISTED
    }
}
