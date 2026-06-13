package com.placement.portal.repository;

import com.placement.portal.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findByStudentId(Long studentId, Pageable pageable);

    Page<Application> findByPlacementDriveId(Long driveId, Pageable pageable);

    Optional<Application> findByStudentIdAndPlacementDriveId(Long studentId, Long driveId);

    Boolean existsByStudentIdAndPlacementDriveId(Long studentId, Long driveId);

    List<Application> findByStatus(Application.ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.placementDrive.id = :driveId AND a.status = :status")
    Long countByDriveIdAndStatus(@Param("driveId") Long driveId,
                                  @Param("status") Application.ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.student.id = :studentId AND a.status = 'SELECTED'")
    Long countSelectedByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countByStatus();
}
