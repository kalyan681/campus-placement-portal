package com.placement.portal.repository;

import com.placement.portal.entity.PlacementDrive;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {

    Page<PlacementDrive> findByCompanyId(Long companyId, Pageable pageable);

    Page<PlacementDrive> findByStatus(PlacementDrive.DriveStatus status, Pageable pageable);

    List<PlacementDrive> findByDriveDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT pd FROM PlacementDrive pd WHERE " +
           "(:status IS NULL OR pd.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(pd.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(pd.jobRole) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:companyId IS NULL OR pd.company.id = :companyId)")
    Page<PlacementDrive> searchDrives(@Param("status") PlacementDrive.DriveStatus status,
                                       @Param("keyword") String keyword,
                                       @Param("companyId") Long companyId,
                                       Pageable pageable);

    @Query("SELECT COUNT(pd) FROM PlacementDrive pd WHERE pd.status = :status")
    Long countByStatus(@Param("status") PlacementDrive.DriveStatus status);
}
