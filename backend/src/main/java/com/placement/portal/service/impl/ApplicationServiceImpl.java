package com.placement.portal.service.impl;

import com.placement.portal.dto.request.ApplicationRequest;
import com.placement.portal.dto.response.ApplicationResponse;
import com.placement.portal.entity.*;
import com.placement.portal.exception.DuplicateResourceException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.*;
import com.placement.portal.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final PlacementDriveRepository driveRepository;

    @Override
    @Transactional
    public ApplicationResponse applyToDrive(ApplicationRequest request) {
        if (applicationRepository.existsByStudentIdAndPlacementDriveId(
                request.getStudentId(), request.getDriveId())) {
            throw new DuplicateResourceException("Student has already applied to this drive");
        }

        Student student = studentRepository.findById(request.getStudentId())
            .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        PlacementDrive drive = driveRepository.findById(request.getDriveId())
            .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", request.getDriveId()));

        // Eligibility check: CGPA
        if (drive.getMinCgpa() != null && student.getCgpa() != null &&
            student.getCgpa() < drive.getMinCgpa()) {
            throw new IllegalArgumentException(
                "Student CGPA " + student.getCgpa() + " is below the minimum required " + drive.getMinCgpa());
        }

        Application application = Application.builder()
            .student(student)
            .placementDrive(drive)
            .coverLetter(request.getCoverLetter())
            .build();

        return mapToResponse(applicationRepository.save(application));
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long id) {
        return mapToResponse(findById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getApplicationsByStudent(Long studentId, Pageable pageable) {
        return applicationRepository.findByStudentId(studentId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getApplicationsByDrive(Long driveId, Pageable pageable) {
        return applicationRepository.findByPlacementDriveId(driveId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public ApplicationResponse updateApplicationStatus(Long id, Application.ApplicationStatus status, String remarks) {
        Application application = findById(id);
        application.setStatus(status);
        if (remarks != null) application.setRemarks(remarks);

        // If selected, auto-mark student as placed
        if (status == Application.ApplicationStatus.SELECTED) {
            Student student = application.getStudent();
            student.setIsPlaced(true);
            student.setStatus(Student.StudentStatus.PLACED);
            student.setPlacedCompany(application.getPlacementDrive().getCompany().getName());
            if (application.getOfferedPackage() != null) {
                student.setPackageLpa(application.getOfferedPackage());
            }
            studentRepository.save(student);
        }

        return mapToResponse(applicationRepository.save(application));
    }

    @Override
    @Transactional
    public void withdrawApplication(Long id) {
        Application application = findById(id);
        application.setStatus(Application.ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);
    }

    // -----------------------------------------------------------------------
    private Application findById(Long id) {
        return applicationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));
    }

    public ApplicationResponse mapToResponse(Application a) {
        return ApplicationResponse.builder()
            .id(a.getId())
            .studentId(a.getStudent().getId())
            .studentName(a.getStudent().getFullName())
            .studentRollNumber(a.getStudent().getRollNumber())
            .studentEmail(a.getStudent().getEmail())
            .driveId(a.getPlacementDrive().getId())
            .driveTitle(a.getPlacementDrive().getTitle())
            .companyName(a.getPlacementDrive().getCompany().getName())
            .status(a.getStatus())
            .coverLetter(a.getCoverLetter())
            .remarks(a.getRemarks())
            .interviewDate(a.getInterviewDate())
            .offerLetterUrl(a.getOfferLetterUrl())
            .offeredPackage(a.getOfferedPackage())
            .createdAt(a.getCreatedAt())
            .updatedAt(a.getUpdatedAt())
            .build();
    }
}
