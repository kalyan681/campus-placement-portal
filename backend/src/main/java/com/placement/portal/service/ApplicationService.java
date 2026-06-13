package com.placement.portal.service;

import com.placement.portal.dto.request.ApplicationRequest;
import com.placement.portal.dto.response.ApplicationResponse;
import com.placement.portal.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApplicationService {
    ApplicationResponse applyToDrive(ApplicationRequest request);
    ApplicationResponse getApplicationById(Long id);
    Page<ApplicationResponse> getApplicationsByStudent(Long studentId, Pageable pageable);
    Page<ApplicationResponse> getApplicationsByDrive(Long driveId, Pageable pageable);
    ApplicationResponse updateApplicationStatus(Long id, Application.ApplicationStatus status, String remarks);
    void withdrawApplication(Long id);
}
