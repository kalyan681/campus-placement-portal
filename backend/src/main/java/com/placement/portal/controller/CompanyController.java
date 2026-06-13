package com.placement.portal.controller;

import com.placement.portal.dto.request.CompanyRequest;
import com.placement.portal.dto.response.ApiResponse;
import com.placement.portal.dto.response.CompanyResponse;
import com.placement.portal.entity.Company;
import com.placement.portal.service.CompanyService;
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
@RequestMapping("/companies")
@RequiredArgsConstructor
@Tag(name = "Company Management", description = "CRUD operations for companies")
@SecurityRequirement(name = "bearerAuth")
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new company (Admin only)")
    public ResponseEntity<ApiResponse<CompanyResponse>> create(@Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Company created successfully", companyService.createCompany(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get company by ID")
    public ResponseEntity<ApiResponse<CompanyResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(companyService.getCompanyById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all companies with pagination")
    public ResponseEntity<ApiResponse<Page<CompanyResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return ResponseEntity.ok(ApiResponse.success(
            companyService.getAllCompanies(PageRequest.of(page, size, sort))));
    }

    @GetMapping("/search")
    @Operation(summary = "Search/filter companies")
    public ResponseEntity<ApiResponse<Page<CompanyResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Company.CompanyStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(ApiResponse.success(
            companyService.searchCompanies(keyword, status, PageRequest.of(page, size))));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update company (Admin only)")
    public ResponseEntity<ApiResponse<CompanyResponse>> update(
            @PathVariable Long id, @Valid @RequestBody CompanyRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Company updated successfully",
            companyService.updateCompany(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete company (Admin only)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.ok(ApiResponse.success("Company deleted successfully", null));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update company status (Admin only)")
    public ResponseEntity<ApiResponse<CompanyResponse>> updateStatus(
            @PathVariable Long id, @RequestParam Company.CompanyStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
            companyService.updateStatus(id, status)));
    }
}
