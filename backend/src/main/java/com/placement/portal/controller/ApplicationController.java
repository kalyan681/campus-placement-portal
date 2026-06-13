package com.placement.portal.controller;

import com.placement.portal.dto.request.ApplicationRequest;
import com.placement.portal.dto.response.ApiResponse;
import com.placement.portal.dto.response.ApplicationResponse;
import com.placement.portal.entity.Application;
import com.placement.portal.service.ApplicationService;
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
@RequestMapping("/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Student applications to placement drives")
@SecurityRequirement(name = "bearerAuth")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @Operation(summary = "Apply to a placement drive")
    public ResponseEntity<ApiResponse<ApplicationResponse>> apply(
            @Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Applied successfully",
                applicationService.applyToDrive(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application by ID")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getApplicationById(id)));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get all applications by student")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getByStudent(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(
            applicationService.getApplicationsByStudent(studentId, pageable)));
    }

    @GetMapping("/drive/{driveId}")
    @Operation(summary = "Get all applications for a drive")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getByDrive(
            @PathVariable Long driveId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(
            applicationService.getApplicationsByDrive(driveId, pageable)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update application status (Admin only)")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam Application.ApplicationStatus status,
            @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
            applicationService.updateApplicationStatus(id, status, remarks)));
    }

    @PatchMapping("/{id}/withdraw")
    @Operation(summary = "Withdraw application")
    public ResponseEntity<ApiResponse<Void>> withdraw(@PathVariable Long id) {
        applicationService.withdrawApplication(id);
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn", null));
    }
}
