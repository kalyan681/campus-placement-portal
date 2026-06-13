package com.placement.portal.service;

import com.placement.portal.dto.request.StudentRequest;
import com.placement.portal.dto.response.StudentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudentService {
    StudentResponse createStudent(StudentRequest request);
    StudentResponse getStudentById(Long id);
    StudentResponse getStudentByRollNumber(String rollNumber);
    Page<StudentResponse> getAllStudents(Pageable pageable);
    Page<StudentResponse> searchStudents(String department, Double minCgpa, Boolean isPlaced, String keyword, Pageable pageable);
    StudentResponse updateStudent(Long id, StudentRequest request);
    void deleteStudent(Long id);
    StudentResponse markAsPlaced(Long id, String company, Double packageLpa);
}
