package com.placement.portal.service;

import com.placement.portal.dto.request.CompanyRequest;
import com.placement.portal.dto.response.CompanyResponse;
import com.placement.portal.entity.Company;
import com.placement.portal.exception.DuplicateResourceException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.CompanyRepository;
import com.placement.portal.service.impl.CompanyServiceImpl;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {

    @Mock private CompanyRepository companyRepository;
    @InjectMocks private CompanyServiceImpl companyService;

    private Company sampleCompany;
    private CompanyRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleCompany = Company.builder()
            .id(1L).name("Google").email("hr@google.com")
            .industry("Technology").city("Bangalore")
            .status(Company.CompanyStatus.ACTIVE).build();

        sampleRequest = new CompanyRequest();
        sampleRequest.setName("Google");
        sampleRequest.setEmail("hr@google.com");
        sampleRequest.setIndustry("Technology");
        sampleRequest.setCity("Bangalore");
    }

    @Test
    @DisplayName("Should create company when email is unique")
    void createCompany_Success() {
        when(companyRepository.existsByEmail(anyString())).thenReturn(false);
        when(companyRepository.save(any(Company.class))).thenReturn(sampleCompany);

        CompanyResponse response = companyService.createCompany(sampleRequest);

        assertThat(response.getName()).isEqualTo("Google");
        assertThat(response.getIndustry()).isEqualTo("Technology");
        verify(companyRepository).save(any(Company.class));
    }

    @Test
    @DisplayName("Should throw when company email already exists")
    void createCompany_DuplicateEmail() {
        when(companyRepository.existsByEmail(anyString())).thenReturn(true);

        assertThatThrownBy(() -> companyService.createCompany(sampleRequest))
            .isInstanceOf(DuplicateResourceException.class);
        verify(companyRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should return company by ID")
    void getCompanyById_Found() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(sampleCompany));
        CompanyResponse response = companyService.getCompanyById(1L);
        assertThat(response.getName()).isEqualTo("Google");
    }

    @Test
    @DisplayName("Should throw when company not found")
    void getCompanyById_NotFound() {
        when(companyRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> companyService.getCompanyById(99L))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should update company status")
    void updateStatus_Success() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(sampleCompany));
        sampleCompany.setStatus(Company.CompanyStatus.INACTIVE);
        when(companyRepository.save(any())).thenReturn(sampleCompany);

        CompanyResponse response = companyService.updateStatus(1L, Company.CompanyStatus.INACTIVE);
        assertThat(response.getStatus()).isEqualTo(Company.CompanyStatus.INACTIVE);
    }
}
