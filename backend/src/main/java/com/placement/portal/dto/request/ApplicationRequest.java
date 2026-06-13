package com.placement.portal.dto.request;

import com.placement.portal.entity.Application;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ApplicationRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Drive ID is required")
    private Long driveId;

    private String coverLetter;
    private String remarks;
    private Application.ApplicationStatus status;
    private LocalDate interviewDate;
    private String offerLetterUrl;
    private Double offeredPackage;
}
