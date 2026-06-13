package com.placement.portal.repository;

import com.placement.portal.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNumber(String rollNumber);

    Optional<Student> findByEmail(String email);

    Boolean existsByRollNumber(String rollNumber);

    Boolean existsByEmail(String email);

    Page<Student> findByDepartment(String department, Pageable pageable);

    List<Student> findByIsPlaced(Boolean isPlaced);

    List<Student> findByGraduationYear(Integer graduationYear);

    @Query("SELECT s FROM Student s WHERE " +
           "(:department IS NULL OR s.department = :department) AND " +
           "(:minCgpa IS NULL OR s.cgpa >= :minCgpa) AND " +
           "(:isPlaced IS NULL OR s.isPlaced = :isPlaced) AND " +
           "(:keyword IS NULL OR LOWER(s.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Student> searchStudents(@Param("department") String department,
                                  @Param("minCgpa") Double minCgpa,
                                  @Param("isPlaced") Boolean isPlaced,
                                  @Param("keyword") String keyword,
                                  Pageable pageable);

    @Query("SELECT COUNT(s) FROM Student s WHERE s.isPlaced = true")
    Long countPlacedStudents();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.graduationYear = :year")
    Long countByGraduationYear(@Param("year") Integer year);

    @Query("SELECT s.department, COUNT(s) FROM Student s GROUP BY s.department")
    List<Object[]> countByDepartment();
}
