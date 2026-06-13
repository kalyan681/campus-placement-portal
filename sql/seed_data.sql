-- ============================================================
--  Campus Placement Portal — Seed Data
--  Run AFTER schema.sql
-- ============================================================

USE placement_db;

-- ---------------------------------------------------------------
-- ROLES
-- ---------------------------------------------------------------
INSERT IGNORE INTO roles (name) VALUES
    ('ROLE_ADMIN'),
    ('ROLE_STUDENT'),
    ('ROLE_COMPANY');

-- ---------------------------------------------------------------
-- USERS
-- password for all accounts = "password123"  (BCrypt hashed)
-- ---------------------------------------------------------------
INSERT IGNORE INTO users (username, email, password, full_name, phone, enabled) VALUES
('admin',       'admin@placement.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Admin',    '9000000001', 1),
('john_doe',    'john@student.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Doe',        '9000000002', 1),
('jane_smith',  'jane@student.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane Smith',      '9000000003', 1),
('raj_kumar',   'raj@student.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Raj Kumar',       '9000000004', 1),
('priya_m',     'priya@student.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Priya Mehta',     '9000000005', 1),
('arjun_v',     'arjun@student.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Arjun Verma',     '9000000006', 1);

-- ---------------------------------------------------------------
-- USER ROLES
-- ---------------------------------------------------------------
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin'      AND r.name = 'ROLE_ADMIN';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username IN ('john_doe','jane_smith','raj_kumar','priya_m','arjun_v')
  AND r.name = 'ROLE_STUDENT';

-- ---------------------------------------------------------------
-- COMPANIES
-- ---------------------------------------------------------------
INSERT IGNORE INTO companies (name, email, phone, website, industry, description, city, country, status, hr_contact_name, hr_contact_email) VALUES
('Google India',        'hr@google.in',         '080-12340001', 'https://careers.google.com',   'Technology',    'Leading global tech company',              'Hyderabad',  'India', 'ACTIVE',   'Ananya Sharma',  'ananya@google.in'),
('Microsoft India',     'hr@microsoft.in',      '080-12340002', 'https://careers.microsoft.com','Technology',    'Cloud, AI, and productivity solutions',     'Hyderabad',  'India', 'ACTIVE',   'Vikram Patel',   'vikram@microsoft.in'),
('Infosys',             'campus@infosys.com',   '080-22093261', 'https://www.infosys.com',      'IT Services',   'Global IT consulting and services',         'Bengaluru',  'India', 'ACTIVE',   'Deepa Nair',     'deepa@infosys.com'),
('Tata Consultancy',    'campus@tcs.com',       '022-67789595', 'https://www.tcs.com',          'IT Services',   'World largest IT services company',         'Mumbai',     'India', 'ACTIVE',   'Suresh Babu',    'suresh@tcs.com'),
('Amazon India',        'university@amazon.in', '080-39876543', 'https://amazon.jobs',          'E-Commerce',    'E-commerce and cloud computing',            'Bengaluru',  'India', 'ACTIVE',   'Kavya Reddy',    'kavya@amazon.in'),
('Wipro',               'campus@wipro.com',     '080-28440011', 'https://careers.wipro.com',    'IT Services',   'IT, consulting, and BPO services',          'Bengaluru',  'India', 'ACTIVE',   'Ramesh Iyer',    'ramesh@wipro.com'),
('Flipkart',            'campus@flipkart.com',  '080-49400000', 'https://www.flipkart.com',     'E-Commerce',    'India leading e-commerce platform',         'Bengaluru',  'India', 'ACTIVE',   'Neha Gupta',     'neha@flipkart.com'),
('Accenture',           'india@accenture.com',  '022-66715000', 'https://accenture.com',        'Consulting',    'Management consulting and outsourcing',      'Mumbai',     'India', 'ACTIVE',   'Pooja Singh',    'pooja@accenture.com');

-- ---------------------------------------------------------------
-- STUDENTS
-- ---------------------------------------------------------------
INSERT IGNORE INTO students (roll_number, first_name, last_name, email, phone, department, degree, cgpa, graduation_year, skills, status, is_placed, user_id) VALUES
('CS2025001', 'John',    'Doe',     'john@student.com',  '9111001001', 'CSE',  'B.Tech', 8.90, 2025, 'Java,Spring Boot,React,MySQL',            'ACTIVE', 0, (SELECT id FROM users WHERE username='john_doe')),
('CS2025002', 'Jane',    'Smith',   'jane@student.com',  '9111001002', 'CSE',  'B.Tech', 9.20, 2025, 'Python,Django,Machine Learning,SQL',       'ACTIVE', 0, (SELECT id FROM users WHERE username='jane_smith')),
('IT2025001', 'Raj',     'Kumar',   'raj@student.com',   '9111001003', 'IT',   'B.Tech', 7.80, 2025, 'JavaScript,Node.js,MongoDB,Docker',        'ACTIVE', 0, (SELECT id FROM users WHERE username='raj_kumar')),
('EC2025001', 'Priya',   'Mehta',   'priya@student.com', '9111001004', 'ECE',  'B.Tech', 8.50, 2025, 'Embedded C,VLSI,IoT,PCB Design',           'ACTIVE', 0, (SELECT id FROM users WHERE username='priya_m')),
('ME2025001', 'Arjun',   'Verma',   'arjun@student.com', '9111001005', 'MECH', 'B.Tech', 7.60, 2025, 'AutoCAD,SolidWorks,MATLAB,Manufacturing',  'ACTIVE', 0, (SELECT id FROM users WHERE username='arjun_v')),
('CS2025003', 'Sneha',   'Patil',   'sneha@student.com', '9111001006', 'CSE',  'B.Tech', 9.50, 2025, 'Data Structures,Algorithms,C++,Python',    'ACTIVE', 0, NULL),
('CS2025004', 'Rohan',   'Gupta',   'rohan@student.com', '9111001007', 'CSE',  'B.Tech', 8.10, 2025, 'Android,Kotlin,Firebase,REST APIs',        'ACTIVE', 0, NULL),
('IT2025002', 'Aisha',   'Khan',    'aisha@student.com', '9111001008', 'IT',   'B.Tech', 8.70, 2025, 'DevOps,AWS,Kubernetes,Terraform',          'ACTIVE', 0, NULL),
('CS2024001', 'Karthik', 'Rajan',   'karthik@student.com','9111001009','CSE',  'B.Tech', 8.30, 2024, 'Java,Microservices,Spring Cloud,Kafka',    'GRADUATED', 0, NULL),
('CS2024002', 'Meera',   'Pillai',  'meera@student.com', '9111001010', 'CSE',  'B.Tech', 9.10, 2024, 'ML,TensorFlow,PyTorch,NLP',               'PLACED', 1, NULL);

-- Mark Meera as placed
UPDATE students SET placed_company='Google India', package_lpa=18.5 WHERE roll_number='CS2024002';

-- ---------------------------------------------------------------
-- PLACEMENT DRIVES
-- ---------------------------------------------------------------
INSERT IGNORE INTO placement_drives
    (title, description, company_id, job_role, job_type, package_lpa, min_cgpa, eligible_departments, required_skills, drive_date, last_date_to_apply, location, vacancy_count, status)
VALUES
(
    'Google SWE Campus Drive 2025',
    'Google is hiring Software Engineers for its Hyderabad office. Join a world-class team working on products used by billions.',
    (SELECT id FROM companies WHERE name='Google India'),
    'Software Engineer', 'Full-time', 22.0, 7.5, 'CSE,IT', 'Data Structures,Algorithms,Java/Python/C++',
    DATE_ADD(CURDATE(), INTERVAL 20 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY),
    'Hyderabad', 10, 'ACTIVE'
),
(
    'Microsoft SDET Recruitment 2025',
    'Microsoft is recruiting SDETs for the Azure team. Work on world-class cloud infrastructure.',
    (SELECT id FROM companies WHERE name='Microsoft India'),
    'SDET (Software Dev Engineer in Test)', 'Full-time', 18.0, 7.0, 'CSE,IT,ECE',
    'Testing,Automation,Java,C#,Selenium',
    DATE_ADD(CURDATE(), INTERVAL 30 DAY), DATE_ADD(CURDATE(), INTERVAL 15 DAY),
    'Hyderabad', 15, 'UPCOMING'
),
(
    'TCS National Qualifier Test 2025',
    'TCS NQT is a common placement drive for all engineering graduates. Multiple roles available.',
    (SELECT id FROM companies WHERE name='Tata Consultancy'),
    'Systems Engineer', 'Full-time', 7.0, 6.0, 'CSE,IT,ECE,MECH,CIVIL',
    'Aptitude,Logical Reasoning,Programming Basics',
    DATE_ADD(CURDATE(), INTERVAL 45 DAY), DATE_ADD(CURDATE(), INTERVAL 30 DAY),
    'Pan India', 200, 'UPCOMING'
),
(
    'Amazon SDE-1 Drive 2025',
    'Amazon is looking for talented engineers to join their Bengaluru team working on cutting-edge e-commerce solutions.',
    (SELECT id FROM companies WHERE name='Amazon India'),
    'Software Development Engineer I', 'Full-time', 26.0, 8.0, 'CSE,IT',
    'DSA,System Design,Java/Python,Problem Solving',
    DATE_ADD(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 5 DAY),
    'Bengaluru', 8, 'ACTIVE'
),
(
    'Infosys Instep Internship 2025',
    'Infosys InStep is a global internship program offering 2-6 month internships across various technology domains.',
    (SELECT id FROM companies WHERE name='Infosys'),
    'Technology Analyst Intern', 'Internship', 3.5, 6.5, 'CSE,IT,ECE',
    'Java,SQL,Communication Skills',
    DATE_ADD(CURDATE(), INTERVAL 60 DAY), DATE_ADD(CURDATE(), INTERVAL 40 DAY),
    'Bengaluru / Pune', 50, 'UPCOMING'
),
(
    'Flipkart SDE Campus 2024',
    'Completed recruitment drive. Flipkart hired engineers for their supply chain and payments teams.',
    (SELECT id FROM companies WHERE name='Flipkart'),
    'Software Development Engineer', 'Full-time', 20.0, 7.5, 'CSE,IT',
    'DSA,Backend Development,Distributed Systems',
    DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_SUB(CURDATE(), INTERVAL 45 DAY),
    'Bengaluru', 5, 'COMPLETED'
);

-- ---------------------------------------------------------------
-- SAMPLE APPLICATIONS
-- ---------------------------------------------------------------
-- Get drive IDs dynamically
SET @google_drive  = (SELECT id FROM placement_drives WHERE title LIKE 'Google SWE%' LIMIT 1);
SET @amazon_drive  = (SELECT id FROM placement_drives WHERE title LIKE 'Amazon SDE%' LIMIT 1);
SET @flipkart_drive= (SELECT id FROM placement_drives WHERE title LIKE 'Flipkart SDE%' LIMIT 1);

-- Students apply to Google drive
INSERT IGNORE INTO applications (student_id, drive_id, status, cover_letter)
SELECT s.id, @google_drive, 'APPLIED',
       CONCAT('I am ', s.first_name, ', a CSE student with ', s.cgpa, ' CGPA. I am passionate about software engineering.')
FROM students s WHERE s.roll_number IN ('CS2025001','CS2025002','CS2025003','CS2025004');

-- Update some statuses for realism
UPDATE applications SET status='SHORTLISTED'
WHERE drive_id=@google_drive AND student_id=(SELECT id FROM students WHERE roll_number='CS2025002');

UPDATE applications SET status='INTERVIEW_SCHEDULED', interview_date=DATE_ADD(CURDATE(), INTERVAL 7 DAY)
WHERE drive_id=@google_drive AND student_id=(SELECT id FROM students WHERE roll_number='CS2025003');

-- Students apply to Amazon drive
INSERT IGNORE INTO applications (student_id, drive_id, status, cover_letter)
SELECT s.id, @amazon_drive, 'APPLIED',
       CONCAT('I am ', s.first_name, ' and I would love to join Amazon as SDE.')
FROM students s WHERE s.roll_number IN ('CS2025001','CS2025002','IT2025002');

-- Historical applications to Flipkart (completed drive)
INSERT IGNORE INTO applications (student_id, drive_id, status, remarks, offered_package)
SELECT s.id, @flipkart_drive, 'SELECTED', 'Excellent performance in all interview rounds', 20.0
FROM students s WHERE s.roll_number='CS2024002';

UPDATE applications SET status='REJECTED', remarks='Did not clear technical round'
WHERE drive_id=@flipkart_drive AND student_id=(SELECT id FROM students WHERE roll_number='CS2025001');
