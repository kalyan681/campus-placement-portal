-- ============================================================
--  Campus Placement Portal — Database Schema
--  Database: placement_db  |  Engine: MySQL 8.x
-- ============================================================

CREATE DATABASE IF NOT EXISTS placement_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE placement_db;

-- ---------------------------------------------------------------
-- ROLES
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id   BIGINT       NOT NULL AUTO_INCREMENT,
    name VARCHAR(20)  NOT NULL UNIQUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- USERS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(120) NOT NULL,
    full_name  VARCHAR(100),
    phone      VARCHAR(20),
    enabled    TINYINT(1)   NOT NULL DEFAULT 1,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- USER_ROLES  (join table)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id)  ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- STUDENTS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id               BIGINT         NOT NULL AUTO_INCREMENT,
    roll_number      VARCHAR(30)    NOT NULL UNIQUE,
    first_name       VARCHAR(100)   NOT NULL,
    last_name        VARCHAR(100)   NOT NULL,
    email            VARCHAR(150)   NOT NULL UNIQUE,
    phone            VARCHAR(20),
    department       VARCHAR(80)    NOT NULL,
    degree           VARCHAR(80)    NOT NULL,
    cgpa             DECIMAL(4,2),
    graduation_year  INT,
    skills           TEXT,
    resume_url       VARCHAR(500),
    status           ENUM('ACTIVE','INACTIVE','GRADUATED','PLACED') NOT NULL DEFAULT 'ACTIVE',
    is_placed        TINYINT(1)     NOT NULL DEFAULT 0,
    placed_company   VARCHAR(150),
    package_lpa      DOUBLE,
    user_id          BIGINT,
    created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME       ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- COMPANIES
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS companies (
    id               BIGINT         NOT NULL AUTO_INCREMENT,
    name             VARCHAR(150)   NOT NULL,
    email            VARCHAR(150)   NOT NULL UNIQUE,
    phone            VARCHAR(20),
    website          VARCHAR(255),
    industry         VARCHAR(100)   NOT NULL,
    description      TEXT,
    logo_url         VARCHAR(500),
    address          TEXT,
    city             VARCHAR(80),
    country          VARCHAR(80)    DEFAULT 'India',
    status           ENUM('ACTIVE','INACTIVE','BLACKLISTED') NOT NULL DEFAULT 'ACTIVE',
    hr_contact_name  VARCHAR(100),
    hr_contact_email VARCHAR(150),
    created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME       ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- PLACEMENT_DRIVES
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS placement_drives (
    id                    BIGINT      NOT NULL AUTO_INCREMENT,
    title                 VARCHAR(200) NOT NULL,
    description           TEXT,
    company_id            BIGINT      NOT NULL,
    job_role              VARCHAR(100) NOT NULL,
    job_type              VARCHAR(50),
    package_lpa           DOUBLE,
    min_cgpa              DOUBLE       DEFAULT 0.0,
    eligible_departments  TEXT,
    required_skills       TEXT,
    drive_date            DATE,
    last_date_to_apply    DATE,
    location              VARCHAR(100),
    vacancy_count         INT,
    status                ENUM('UPCOMING','ACTIVE','COMPLETED','CANCELLED') NOT NULL DEFAULT 'UPCOMING',
    created_at            DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_drive_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- APPLICATIONS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
    id               BIGINT     NOT NULL AUTO_INCREMENT,
    student_id       BIGINT     NOT NULL,
    drive_id         BIGINT     NOT NULL,
    status           ENUM('APPLIED','SHORTLISTED','INTERVIEW_SCHEDULED','SELECTED','REJECTED','WITHDRAWN')
                               NOT NULL DEFAULT 'APPLIED',
    cover_letter     TEXT,
    remarks          TEXT,
    interview_date   DATE,
    offer_letter_url VARCHAR(500),
    offered_package  DOUBLE,
    created_at       DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME   ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_student_drive (student_id, drive_id),
    CONSTRAINT fk_app_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_drive   FOREIGN KEY (drive_id)   REFERENCES placement_drives(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- INDEXES for performance
-- ---------------------------------------------------------------
CREATE INDEX idx_students_dept        ON students(department);
CREATE INDEX idx_students_grad_year   ON students(graduation_year);
CREATE INDEX idx_students_is_placed   ON students(is_placed);
CREATE INDEX idx_companies_industry   ON companies(industry);
CREATE INDEX idx_companies_status     ON companies(status);
CREATE INDEX idx_drives_status        ON placement_drives(status);
CREATE INDEX idx_drives_company       ON placement_drives(company_id);
CREATE INDEX idx_apps_status          ON applications(status);
CREATE INDEX idx_apps_student         ON applications(student_id);
CREATE INDEX idx_apps_drive           ON applications(drive_id);
