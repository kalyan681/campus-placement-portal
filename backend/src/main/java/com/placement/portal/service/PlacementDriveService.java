package com.placement.portal.service;

import com.placement.portal.dto.request.PlacementDriveRequest;
import com.placement.portal.dto.response.PlacementDriveResponse;
import com.placement.portal.entity.PlacementDrive;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PlacementDriveService {
    PlacementDriveResponse createDrive(PlacementDriveRequest request);
    PlacementDriveResponse getDriveById(Long id);
    Page<PlacementDriveResponse> getAllDrives(Pageable pageable);
    Page<PlacementDriveResponse> searchDrives(PlacementDrive.DriveStatus status, String keyword, Long companyId, Pageable pageable);
    PlacementDriveResponse updateDrive(Long id, PlacementDriveRequest request);
    void deleteDrive(Long id);
    PlacementDriveResponse updateStatus(Long id, PlacementDrive.DriveStatus status);
}
