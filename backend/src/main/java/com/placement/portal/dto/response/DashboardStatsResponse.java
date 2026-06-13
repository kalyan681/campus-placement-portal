package com.placement.portal.dto.response;

import lombok.*;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStatsResponse {
    private Long totalStudents;
    private Long placedStudents;
    private Long totalCompanies;
    private Long activeCompanies;
    private Long totalDrives;
    private Long activeDrives;
    private Long totalApplications;
    private Double placementPercentage;
    private Map<String, Long> studentsByDepartment;
    private Map<String, Long> applicationsByStatus;
}
