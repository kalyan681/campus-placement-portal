package com.placement.portal.dto.response;

import com.placement.portal.entity.Company;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CompanyResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String website;
    private String industry;
    private String description;
    private String logoUrl;
    private String address;
    private String city;
    private String country;
    private Company.CompanyStatus status;
    private String hrContactName;
    private String hrContactEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
