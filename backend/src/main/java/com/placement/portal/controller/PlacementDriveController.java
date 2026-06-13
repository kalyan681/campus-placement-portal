package com.placement.portal.controller;

import com.placement.portal.dto.request.PlacementDriveRequest;
import com.placement.portal.dto.response.ApiResponse;
import com.placement.portal.dto.response.PlacementDriveResponse;
import com.placement.portal.entity.PlacementDrive;
import com.placement.portal.service.PlacementDriveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drives")
@RequiredArgsConstructor
@Tag(name = "Placement Drives", description = "CRUD operations for placement drives")
@SecurityRequirement(name = "bearerAuth")
public class PlacementDriveController {

    private final PlacementDriveService driveService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new placement drive (Admin only)")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> create(
            @Valid @RequestBody PlacementDriveRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Drive created successfully", driveService.createDrive(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get drive by ID")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(driveService.getDriveById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all drives with pagination")
    public ResponseEntity<ApiResponse<Page<PlacementDriveResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "driveDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return ResponseEntity.ok(ApiResponse.success(
            driveService.getAllDrives(PageRequest.of(page, size, sort))));
    }

    @GetMapping("/search")
    @Operation(summary = "Search/filter drives")
    public ResponseEntity<ApiResponse<Page<PlacementDriveResponse>>> search(
            @RequestParam(required = false) PlacementDrive.DriveStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.success(
            driveService.searchDrives(status, keyword, companyId, PageRequest.of(page, size))));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update drive (Admin only)")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> update(
            @PathVariable Long id, @Valid @RequestBody PlacementDriveRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Drive updated successfully",
            driveService.updateDrive(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete drive (Admin only)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        driveService.deleteDrive(id);
        return ResponseEntity.ok(ApiResponse.success("Drive deleted successfully", null));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update drive status (Admin only)")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> updateStatus(
            @PathVariable Long id, @RequestParam PlacementDrive.DriveStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
            driveService.updateStatus(id, status)));
    }
}
