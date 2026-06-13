package com.placement.portal;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@OpenAPIDefinition(
    info = @Info(
        title = "Campus Placement Portal API",
        version = "1.0",
        description = "REST API documentation for Campus Placement Portal",
        contact = @Contact(name = "Admin", email = "admin@placement.com"),
        license = @License(name = "MIT")
    )
)
public class CampusPlacementPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusPlacementPortalApplication.class, args);
    }
}
