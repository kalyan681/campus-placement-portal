package com.placement.portal.service.impl;

import com.placement.portal.dto.response.DashboardStatsResponse;
import com.placement.portal.entity.Application;
import com.placement.portal.entity.Company;
import com.placement.portal.entity.PlacementDrive;
import com.placement.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        long totalStudents  = studentRepository.count();
        long placedStudents = studentRepository.countPlacedStudents();
        long totalCompanies = companyRepository.count();
        long activeCompanies = companyRepository.findByStatus(Company.CompanyStatus.ACTIVE,
                                    org.springframework.data.domain.Pageable.unpaged()).getTotalElements();
        long totalDrives  = driveRepository.count();
        long activeDrives = driveRepository.countByStatus(PlacementDrive.DriveStatus.ACTIVE);
        long totalApps    = applicationRepository.count();

        double placementPct = totalStudents > 0
            ? Math.round((placedStudents * 100.0 / totalStudents) * 10.0) / 10.0
            : 0.0;

        // Students by department
        Map<String, Long> byDept = new LinkedHashMap<>();
        studentRepository.countByDepartment()
            .forEach(row -> byDept.put((String) row[0], (Long) row[1]));

        // Applications by status
        Map<String, Long> byStatus = new LinkedHashMap<>();
        applicationRepository.countByStatus()
            .forEach(row -> byStatus.put(((Application.ApplicationStatus) row[0]).name(), (Long) row[1]));

        return DashboardStatsResponse.builder()
            .totalStudents(totalStudents)
            .placedStudents(placedStudents)
            .totalCompanies(totalCompanies)
            .activeCompanies(activeCompanies)
            .totalDrives(totalDrives)
            .activeDrives(activeDrives)
            .totalApplications(totalApps)
            .placementPercentage(placementPct)
            .studentsByDepartment(byDept)
            .applicationsByStatus(byStatus)
            .build();
    }
}
