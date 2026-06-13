package com.placement.portal.dto.response;

import com.placement.portal.entity.Application;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private String studentEmail;
    private Long driveId;
    private String driveTitle;
    private String companyName;
    private Application.ApplicationStatus status;
    private String coverLetter;
    private String remarks;
    private LocalDate interviewDate;
    private String offerLetterUrl;
    private Double offeredPackage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
