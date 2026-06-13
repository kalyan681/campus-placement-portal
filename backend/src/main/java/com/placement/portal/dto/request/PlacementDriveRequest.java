package com.placement.portal.dto.request;

import com.placement.portal.entity.PlacementDrive;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PlacementDriveRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotBlank(message = "Job role is required")
    private String jobRole;

    private String jobType;

    @DecimalMin("0.0")
    private Double packageLpa;

    @DecimalMin("0.0")
    private Double minCgpa;

    private String eligibleDepartments;
    private String requiredSkills;
    private LocalDate driveDate;
    private LocalDate lastDateToApply;
    private String location;
    private Integer vacancyCount;
    private PlacementDrive.DriveStatus status;
}
