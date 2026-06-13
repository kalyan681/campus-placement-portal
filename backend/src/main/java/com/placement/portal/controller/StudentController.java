package com.placement.portal.controller;

import com.placement.portal.dto.request.StudentRequest;
import com.placement.portal.dto.response.ApiResponse;
import com.placement.portal.dto.response.StudentResponse;
import com.placement.portal.service.StudentService;
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
@RequestMapping("/students")
@RequiredArgsConstructor
@Tag(name = "Student Management", description = "CRUD operations for students")
@SecurityRequirement(name = "bearerAuth")
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new student (Admin only)")
    public ResponseEntity<ApiResponse<StudentResponse>> create(@Valid @RequestBody StudentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Student created successfully", studentService.createStudent(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student by ID")
    public ResponseEntity<ApiResponse<StudentResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getStudentById(id)));
    }

    @GetMapping("/roll/{rollNumber}")
    @Operation(summary = "Get student by roll number")
    public ResponseEntity<ApiResponse<StudentResponse>> getByRoll(@PathVariable String rollNumber) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getStudentByRollNumber(rollNumber)));
    }

    @GetMapping
    @Operation(summary = "Get all students with pagination")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(ApiResponse.success(studentService.getAllStudents(pageable)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search/filter students")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> search(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Double minCgpa,
            @RequestParam(required = false) Boolean isPlaced,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(
            studentService.searchStudents(department, minCgpa, isPlaced, keyword, pageable)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update student (Admin only)")
    public ResponseEntity<ApiResponse<StudentResponse>> update(
            @PathVariable Long id, @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully",
            studentService.updateStudent(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete student (Admin only)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }

    @PatchMapping("/{id}/place")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mark student as placed (Admin only)")
    public ResponseEntity<ApiResponse<StudentResponse>> markPlaced(
            @PathVariable Long id,
            @RequestParam String company,
            @RequestParam Double packageLpa) {
        return ResponseEntity.ok(ApiResponse.success("Student marked as placed",
            studentService.markAsPlaced(id, company, packageLpa)));
    }
}
