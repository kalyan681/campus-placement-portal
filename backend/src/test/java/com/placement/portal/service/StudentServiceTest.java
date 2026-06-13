package com.placement.portal.service;

import com.placement.portal.dto.request.StudentRequest;
import com.placement.portal.dto.response.StudentResponse;
import com.placement.portal.entity.Student;
import com.placement.portal.exception.DuplicateResourceException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.StudentRepository;
import com.placement.portal.repository.UserRepository;
import com.placement.portal.service.impl.StudentServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock private StudentRepository studentRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private StudentServiceImpl studentService;

    private Student sampleStudent;
    private StudentRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleStudent = Student.builder()
            .id(1L).rollNumber("CS001").firstName("John").lastName("Doe")
            .email("john@test.com").department("CSE").degree("B.Tech")
            .cgpa(8.5).graduationYear(2025).isPlaced(false)
            .status(Student.StudentStatus.ACTIVE).build();

        sampleRequest = new StudentRequest();
        sampleRequest.setRollNumber("CS001");
        sampleRequest.setFirstName("John");
        sampleRequest.setLastName("Doe");
        sampleRequest.setEmail("john@test.com");
        sampleRequest.setDepartment("CSE");
        sampleRequest.setDegree("B.Tech");
        sampleRequest.setCgpa(8.5);
        sampleRequest.setGraduationYear(2025);
    }

    @Test
    @DisplayName("Should create student successfully when no duplicates")
    void createStudent_Success() {
        when(studentRepository.existsByRollNumber(anyString())).thenReturn(false);
        when(studentRepository.existsByEmail(anyString())).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(sampleStudent);

        StudentResponse response = studentService.createStudent(sampleRequest);

        assertThat(response).isNotNull();
        assertThat(response.getRollNumber()).isEqualTo("CS001");
        assertThat(response.getFirstName()).isEqualTo("John");
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when roll number exists")
    void createStudent_DuplicateRollNumber() {
        when(studentRepository.existsByRollNumber("CS001")).thenReturn(true);

        assertThatThrownBy(() -> studentService.createStudent(sampleRequest))
            .isInstanceOf(DuplicateResourceException.class)
            .hasMessageContaining("CS001");
        verify(studentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email exists")
    void createStudent_DuplicateEmail() {
        when(studentRepository.existsByRollNumber(anyString())).thenReturn(false);
        when(studentRepository.existsByEmail("john@test.com")).thenReturn(true);

        assertThatThrownBy(() -> studentService.createStudent(sampleRequest))
            .isInstanceOf(DuplicateResourceException.class)
            .hasMessageContaining("john@test.com");
    }

    @Test
    @DisplayName("Should return student when found by ID")
    void getStudentById_Found() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));

        StudentResponse response = studentService.getStudentById(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("john@test.com");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when student not found")
    void getStudentById_NotFound() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.getStudentById(99L))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should return paginated list of students")
    void getAllStudents_ReturnPage() {
        Page<Student> page = new PageImpl<>(java.util.List.of(sampleStudent));
        when(studentRepository.findAll(any(Pageable.class))).thenReturn(page);

        Page<StudentResponse> result = studentService.getAllStudents(PageRequest.of(0, 10));

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getRollNumber()).isEqualTo("CS001");
    }

    @Test
    @DisplayName("Should delete student when exists")
    void deleteStudent_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));

        studentService.deleteStudent(1L);

        verify(studentRepository).delete(sampleStudent);
    }

    @Test
    @DisplayName("Should mark student as placed")
    void markAsPlaced_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));
        sampleStudent.setIsPlaced(true);
        sampleStudent.setPlacedCompany("Google");
        sampleStudent.setPackageLpa(24.0);
        sampleStudent.setStatus(Student.StudentStatus.PLACED);
        when(studentRepository.save(any())).thenReturn(sampleStudent);

        StudentResponse response = studentService.markAsPlaced(1L, "Google", 24.0);

        assertThat(response.getIsPlaced()).isTrue();
        assertThat(response.getPlacedCompany()).isEqualTo("Google");
        assertThat(response.getPackageLpa()).isEqualTo(24.0);
    }
}
