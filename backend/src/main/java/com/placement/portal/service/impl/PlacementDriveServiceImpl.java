package com.placement.portal.service.impl;

import com.placement.portal.dto.request.PlacementDriveRequest;
import com.placement.portal.dto.response.PlacementDriveResponse;
import com.placement.portal.entity.Company;
import com.placement.portal.entity.PlacementDrive;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.ApplicationRepository;
import com.placement.portal.repository.CompanyRepository;
import com.placement.portal.repository.PlacementDriveRepository;
import com.placement.portal.service.PlacementDriveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlacementDriveServiceImpl implements PlacementDriveService {

    private final PlacementDriveRepository driveRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    @Transactional
    public PlacementDriveResponse createDrive(PlacementDriveRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
            .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));
        PlacementDrive drive = mapToEntity(new PlacementDrive(), request, company);
        return mapToResponse(driveRepository.save(drive));
    }

    @Override
    @Transactional(readOnly = true)
    public PlacementDriveResponse getDriveById(Long id) {
        return mapToResponse(findById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PlacementDriveResponse> getAllDrives(Pageable pageable) {
        return driveRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PlacementDriveResponse> searchDrives(PlacementDrive.DriveStatus status,
                                                      String keyword, Long companyId, Pageable pageable) {
        return driveRepository.searchDrives(status, keyword, companyId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public PlacementDriveResponse updateDrive(Long id, PlacementDriveRequest request) {
        PlacementDrive drive = findById(id);
        Company company = companyRepository.findById(request.getCompanyId())
            .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));
        mapToEntity(drive, request, company);
        return mapToResponse(driveRepository.save(drive));
    }

    @Override
    @Transactional
    public void deleteDrive(Long id) {
        driveRepository.delete(findById(id));
    }

    @Override
    @Transactional
    public PlacementDriveResponse updateStatus(Long id, PlacementDrive.DriveStatus status) {
        PlacementDrive drive = findById(id);
        drive.setStatus(status);
        return mapToResponse(driveRepository.save(drive));
    }

    // -----------------------------------------------------------------------
    private PlacementDrive findById(Long id) {
        return driveRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", id));
    }

    private PlacementDrive mapToEntity(PlacementDrive d, PlacementDriveRequest req, Company company) {
        d.setTitle(req.getTitle());
        d.setDescription(req.getDescription());
        d.setCompany(company);
        d.setJobRole(req.getJobRole());
        d.setJobType(req.getJobType());
        d.setPackageLpa(req.getPackageLpa());
        d.setMinCgpa(req.getMinCgpa() != null ? req.getMinCgpa() : 0.0);
        d.setEligibleDepartments(req.getEligibleDepartments());
        d.setRequiredSkills(req.getRequiredSkills());
        d.setDriveDate(req.getDriveDate());
        d.setLastDateToApply(req.getLastDateToApply());
        d.setLocation(req.getLocation());
        d.setVacancyCount(req.getVacancyCount());
        if (req.getStatus() != null) d.setStatus(req.getStatus());
        return d;
    }

    public PlacementDriveResponse mapToResponse(PlacementDrive d) {
        long appCount = applicationRepository.countByDriveIdAndStatus(d.getId(), null) ;
        // Use raw count from applications list if available
        long count = d.getApplications() != null ? d.getApplications().size() : 0;

        return PlacementDriveResponse.builder()
            .id(d.getId())
            .title(d.getTitle())
            .description(d.getDescription())
            .companyId(d.getCompany().getId())
            .companyName(d.getCompany().getName())
            .companyLogoUrl(d.getCompany().getLogoUrl())
            .jobRole(d.getJobRole())
            .jobType(d.getJobType())
            .packageLpa(d.getPackageLpa())
            .minCgpa(d.getMinCgpa())
            .eligibleDepartments(d.getEligibleDepartments())
            .requiredSkills(d.getRequiredSkills())
            .driveDate(d.getDriveDate())
            .lastDateToApply(d.getLastDateToApply())
            .location(d.getLocation())
            .vacancyCount(d.getVacancyCount())
            .status(d.getStatus())
            .applicationCount(count)
            .createdAt(d.getCreatedAt())
            .updatedAt(d.getUpdatedAt())
            .build();
    }
}
