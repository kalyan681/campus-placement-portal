package com.placement.portal.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Role entity representing user roles (ADMIN, STUDENT, COMPANY).
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "name", length = 20, nullable = false, unique = true)
    private ERole name;

    public enum ERole {
        ROLE_ADMIN,
        ROLE_STUDENT,
        ROLE_COMPANY
    }
}
