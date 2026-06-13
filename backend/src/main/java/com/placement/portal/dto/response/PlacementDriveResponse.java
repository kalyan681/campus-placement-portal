package com.placement.portal.dto.response;

import com.placement.portal.entity.PlacementDrive;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PlacementDriveResponse {
    private Long id;
    private String title;
    private String description;
    private Long companyId;
    private String companyName;
    private String companyLogoUrl;
    private String jobRole;
    private String jobType;
    private Double packageLpa;
    private Double minCgpa;
    private String eligibleDepartments;
    private String requiredSkills;
    private LocalDate driveDate;
    private LocalDate lastDateToApply;
    private String location;
    private Integer vacancyCount;
    private PlacementDrive.DriveStatus status;
    private Long applicationCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
