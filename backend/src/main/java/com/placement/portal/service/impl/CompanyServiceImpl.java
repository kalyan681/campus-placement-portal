package com.placement.portal.service.impl;

import com.placement.portal.dto.request.CompanyRequest;
import com.placement.portal.dto.response.CompanyResponse;
import com.placement.portal.entity.Company;
import com.placement.portal.exception.DuplicateResourceException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.CompanyRepository;
import com.placement.portal.service.CompanyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public CompanyResponse createCompany(CompanyRequest request) {
        if (companyRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Company with email '" + request.getEmail() + "' already exists");
        }
        Company company = mapToEntity(new Company(), request);
        return mapToResponse(companyRepository.save(company));
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long id) {
        return mapToResponse(findById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyResponse> getAllCompanies(Pageable pageable) {
        return companyRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyResponse> searchCompanies(String keyword, Company.CompanyStatus status, Pageable pageable) {
        return companyRepository.searchCompanies(keyword, status, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public CompanyResponse updateCompany(Long id, CompanyRequest request) {
        Company company = findById(id);
        if (!company.getEmail().equals(request.getEmail()) &&
            companyRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' already in use");
        }
        mapToEntity(company, request);
        return mapToResponse(companyRepository.save(company));
    }

    @Override
    @Transactional
    public void deleteCompany(Long id) {
        companyRepository.delete(findById(id));
        log.info("Deleted company id={}", id);
    }

    @Override
    @Transactional
    public CompanyResponse updateStatus(Long id, Company.CompanyStatus status) {
        Company company = findById(id);
        company.setStatus(status);
        return mapToResponse(companyRepository.save(company));
    }

    // -----------------------------------------------------------------------
    private Company findById(Long id) {
        return companyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
    }

    private Company mapToEntity(Company c, CompanyRequest req) {
        c.setName(req.getName());
        c.setEmail(req.getEmail());
        c.setPhone(req.getPhone());
        c.setWebsite(req.getWebsite());
        c.setIndustry(req.getIndustry());
        c.setDescription(req.getDescription());
        c.setLogoUrl(req.getLogoUrl());
        c.setAddress(req.getAddress());
        c.setCity(req.getCity());
        c.setCountry(req.getCountry() != null ? req.getCountry() : "India");
        c.setHrContactName(req.getHrContactName());
        c.setHrContactEmail(req.getHrContactEmail());
        if (req.getStatus() != null) c.setStatus(req.getStatus());
        return c;
    }

    public CompanyResponse mapToResponse(Company c) {
        return CompanyResponse.builder()
            .id(c.getId())
            .name(c.getName())
            .email(c.getEmail())
            .phone(c.getPhone())
            .website(c.getWebsite())
            .industry(c.getIndustry())
            .description(c.getDescription())
            .logoUrl(c.getLogoUrl())
            .address(c.getAddress())
            .city(c.getCity())
            .country(c.getCountry())
            .status(c.getStatus())
            .hrContactName(c.getHrContactName())
            .hrContactEmail(c.getHrContactEmail())
            .createdAt(c.getCreatedAt())
            .updatedAt(c.getUpdatedAt())
            .build();
    }
}
