package com.placement.portal.dto.request;

import com.placement.portal.entity.Company;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 150)
    private String name;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    private String phone;
    private String website;

    @NotBlank(message = "Industry is required")
    private String industry;

    private String description;
    private String logoUrl;
    private String address;
    private String city;
    private String country;
    private String hrContactName;
    private String hrContactEmail;
    private Company.CompanyStatus status;
}
