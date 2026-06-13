package com.placement.portal.service;

import com.placement.portal.dto.request.CompanyRequest;
import com.placement.portal.dto.response.CompanyResponse;
import com.placement.portal.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CompanyService {
    CompanyResponse createCompany(CompanyRequest request);
    CompanyResponse getCompanyById(Long id);
    Page<CompanyResponse> getAllCompanies(Pageable pageable);
    Page<CompanyResponse> searchCompanies(String keyword, Company.CompanyStatus status, Pageable pageable);
    CompanyResponse updateCompany(Long id, CompanyRequest request);
    void deleteCompany(Long id);
    CompanyResponse updateStatus(Long id, Company.CompanyStatus status);
}
