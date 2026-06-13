package com.placement.portal.repository;

import com.placement.portal.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByEmail(String email);

    Boolean existsByEmail(String email);

    Page<Company> findByIndustry(String industry, Pageable pageable);

    Page<Company> findByStatus(Company.CompanyStatus status, Pageable pageable);

    @Query("SELECT c FROM Company c WHERE " +
           "(:keyword IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.industry) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.city) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR c.status = :status)")
    Page<Company> searchCompanies(@Param("keyword") String keyword,
                                   @Param("status") Company.CompanyStatus status,
                                   Pageable pageable);
}
