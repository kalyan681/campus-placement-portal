package com.placement.portal.service.impl;

import com.placement.portal.dto.request.StudentRequest;
import com.placement.portal.dto.response.StudentResponse;
import com.placement.portal.entity.Student;
import com.placement.portal.entity.User;
import com.placement.portal.exception.DuplicateResourceException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.StudentRepository;
import com.placement.portal.repository.UserRepository;
import com.placement.portal.service.StudentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new DuplicateResourceException("Student with roll number '" + request.getRollNumber() + "' already exists");
        }
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Student with email '" + request.getEmail() + "' already exists");
        }

        Student student = mapToEntity(new Student(), request);
        Student saved = studentRepository.save(student);
        log.info("Created student: {}", saved.getRollNumber());
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        return mapToResponse(findById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentByRollNumber(String rollNumber) {
        Student student = studentRepository.findByRollNumber(rollNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Student", "rollNumber", rollNumber));
        return mapToResponse(student);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> searchStudents(String department, Double minCgpa,
                                                 Boolean isPlaced, String keyword, Pageable pageable) {
        return studentRepository.searchStudents(department, minCgpa, isPlaced, keyword, pageable)
                                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = findById(id);

        // Check uniqueness only if changing roll/email
        if (!student.getRollNumber().equals(request.getRollNumber()) &&
            studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new DuplicateResourceException("Roll number '" + request.getRollNumber() + "' already in use");
        }
        if (!student.getEmail().equals(request.getEmail()) &&
            studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' already in use");
        }

        mapToEntity(student, request);
        return mapToResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        Student student = findById(id);
        studentRepository.delete(student);
        log.info("Deleted student id={}", id);
    }

    @Override
    @Transactional
    public StudentResponse markAsPlaced(Long id, String company, Double packageLpa) {
        Student student = findById(id);
        student.setIsPlaced(true);
        student.setPlacedCompany(company);
        student.setPackageLpa(packageLpa);
        student.setStatus(Student.StudentStatus.PLACED);
        return mapToResponse(studentRepository.save(student));
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------
    private Student findById(Long id) {
        return studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
    }

    private Student mapToEntity(Student student, StudentRequest req) {
        student.setRollNumber(req.getRollNumber());
        student.setFirstName(req.getFirstName());
        student.setLastName(req.getLastName());
        student.setEmail(req.getEmail());
        student.setPhone(req.getPhone());
        student.setDepartment(req.getDepartment());
        student.setDegree(req.getDegree());
        student.setCgpa(req.getCgpa());
        student.setGraduationYear(req.getGraduationYear());
        student.setSkills(req.getSkills());
        student.setResumeUrl(req.getResumeUrl());
        if (req.getStatus() != null) student.setStatus(req.getStatus());

        if (req.getUserId() != null) {
            User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", req.getUserId()));
            student.setUser(user);
        }
        return student;
    }

    public StudentResponse mapToResponse(Student s) {
        return StudentResponse.builder()
            .id(s.getId())
            .rollNumber(s.getRollNumber())
            .firstName(s.getFirstName())
            .lastName(s.getLastName())
            .fullName(s.getFullName())
            .email(s.getEmail())
            .phone(s.getPhone())
            .department(s.getDepartment())
            .degree(s.getDegree())
            .cgpa(s.getCgpa())
            .graduationYear(s.getGraduationYear())
            .skills(s.getSkills())
            .resumeUrl(s.getResumeUrl())
            .status(s.getStatus())
            .isPlaced(s.getIsPlaced())
            .placedCompany(s.getPlacedCompany())
            .packageLpa(s.getPackageLpa())
            .createdAt(s.getCreatedAt())
            .updatedAt(s.getUpdatedAt())
            .build();
    }
}
