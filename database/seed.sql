-- Seed Data for Student Management System
-- Passwords are BCrypt hashed (cost 10)
-- Admin password: admin123
-- Teacher password: teacher123
-- Student password: student123

-- Users
INSERT INTO users (name, email, password, role, account_status) VALUES
('Admin User', 'admin@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'ACTIVE'),
('Dr. Rajesh Kumar', 'rajesh@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER', 'ACTIVE'),
('Prof. Priya Sharma', 'priya@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER', 'ACTIVE'),
('Dr. Amit Verma', 'amit@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER', 'ACTIVE'),
('Prof. Sunita Patel', 'sunita@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER', 'ACTIVE'),
('Dr. Vikram Singh', 'vikram@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER', 'ACTIVE'),
('Rahul Kumar', 'rahul@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'ACTIVE'),
('Priya Patel', 'priyap@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'ACTIVE'),
('Amit Singh', 'amits@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'ACTIVE'),
('Sunita Sharma', 'sunitas@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'ACTIVE'),
('Vikram Gupta', 'vikramg@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'ACTIVE'),
('Pooja Verma', 'pooja@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'ACTIVE'),
('Rohit Jain', 'rohit@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'ACTIVE'),
('Neha Agarwal', 'neha@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'ACTIVE'),
('Suresh Yadav', 'suresh@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'ACTIVE'),
('Kavita Mehta', 'kavita@sms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'ACTIVE');

-- Departments
INSERT INTO departments (department_code, department_name, description) VALUES
('CS', 'Computer Science', 'Department of Computer Science and Engineering'),
('EC', 'Electronics & Communication', 'Department of Electronics and Communication Engineering'),
('ME', 'Mechanical Engineering', 'Department of Mechanical Engineering');

-- Teachers (user_id 2-6)
INSERT INTO teachers (teacher_id, name, email, phone, department_id, user_id) VALUES
('TCH001', 'Dr. Rajesh Kumar', 'rajesh@sms.com', '9876543201', 1, 2),
('TCH002', 'Prof. Priya Sharma', 'priya@sms.com', '9876543202', 1, 3),
('TCH003', 'Dr. Amit Verma', 'amit@sms.com', '9876543203', 2, 4),
('TCH004', 'Prof. Sunita Patel', 'sunita@sms.com', '9876543204', 2, 5),
('TCH005', 'Dr. Vikram Singh', 'vikram@sms.com', '9876543205', 3, 6);

-- Students (user_id 7-16)
INSERT INTO students (student_id, first_name, last_name, email, phone, date_of_birth, gender, department_id, admission_date, semester, status, user_id) VALUES
('STU001', 'Rahul', 'Kumar', 'rahul@sms.com', '9876543001', '2004-03-15', 'Male', 1, '2022-07-01', 4, 'ACTIVE', 7),
('STU002', 'Priya', 'Patel', 'priyap@sms.com', '9876543002', '2004-05-20', 'Female', 1, '2022-07-01', 4, 'ACTIVE', 8),
('STU003', 'Amit', 'Singh', 'amits@sms.com', '9876543003', '2003-11-10', 'Male', 2, '2021-07-01', 6, 'ACTIVE', 9),
('STU004', 'Sunita', 'Sharma', 'sunitas@sms.com', '9876543004', '2004-01-25', 'Female', 1, '2022-07-01', 4, 'ACTIVE', 10),
('STU005', 'Vikram', 'Gupta', 'vikramg@sms.com', '9876543005', '2003-08-30', 'Male', 3, '2021-07-01', 6, 'ACTIVE', 11),
('STU006', 'Pooja', 'Verma', 'pooja@sms.com', '9876543006', '2004-07-12', 'Female', 2, '2022-07-01', 4, 'ACTIVE', 12),
('STU007', 'Rohit', 'Jain', 'rohit@sms.com', '9876543007', '2004-09-05', 'Male', 1, '2022-07-01', 4, 'ACTIVE', 13),
('STU008', 'Neha', 'Agarwal', 'neha@sms.com', '9876543008', '2003-12-18', 'Female', 3, '2021-07-01', 6, 'ACTIVE', 14),
('STU009', 'Suresh', 'Yadav', 'suresh@sms.com', '9876543009', '2004-02-28', 'Male', 2, '2022-07-01', 4, 'ACTIVE', 15),
('STU010', 'Kavita', 'Mehta', 'kavita@sms.com', '9876543010', '2003-06-22', 'Female', 1, '2023-07-01', 2, 'ACTIVE', 16);

-- Courses
INSERT INTO courses (course_code, course_name, description, credits, semester, department_id, teacher_id) VALUES
('CS301', 'Data Structures', 'Fundamental data structures and algorithms', 4, 3, 1, 1),
('CS302', 'Database Management', 'Relational databases, SQL and NoSQL', 3, 3, 1, 2),
('CS401', 'Operating Systems', 'Process management, memory, file systems', 4, 4, 1, 1),
('CS402', 'Computer Networks', 'Network protocols, TCP/IP, security', 3, 4, 1, 2),
('EC301', 'Digital Electronics', 'Logic gates, circuits and systems', 4, 3, 2, 3),
('EC302', 'Signal Processing', 'Signals, systems and Fourier analysis', 3, 3, 2, 4),
('ME301', 'Thermodynamics', 'Laws of thermodynamics and applications', 4, 3, 3, 5),
('ME401', 'Fluid Mechanics', 'Fluid statics, dynamics and applications', 3, 4, 3, 5);

-- Enrollments
INSERT INTO enrollments (student_id, course_id, enrollment_date, status) VALUES
(1, 1, '2024-07-15', 'ACTIVE'), (1, 2, '2024-07-15', 'ACTIVE'),
(1, 3, '2024-07-15', 'ACTIVE'), (1, 4, '2024-07-15', 'ACTIVE'),
(2, 1, '2024-07-15', 'ACTIVE'), (2, 2, '2024-07-15', 'ACTIVE'),
(2, 3, '2024-07-15', 'ACTIVE'),
(3, 5, '2024-07-15', 'ACTIVE'), (3, 6, '2024-07-15', 'ACTIVE'),
(4, 1, '2024-07-15', 'ACTIVE'), (4, 2, '2024-07-15', 'ACTIVE'),
(5, 7, '2024-07-15', 'ACTIVE'), (5, 8, '2024-07-15', 'ACTIVE'),
(6, 5, '2024-07-15', 'ACTIVE'), (6, 6, '2024-07-15', 'ACTIVE'),
(7, 1, '2024-07-15', 'ACTIVE'), (7, 4, '2024-07-15', 'ACTIVE'),
(9, 5, '2024-07-15', 'ACTIVE'), (9, 6, '2024-07-15', 'ACTIVE'),
(10, 1, '2024-07-15', 'ACTIVE'), (10, 2, '2024-07-15', 'ACTIVE');

-- Sample Attendance
INSERT INTO attendance (student_id, course_id, date, status, marked_by) VALUES
(1, 1, CURRENT_DATE - INTERVAL '10 days', 'PRESENT', 2),
(1, 1, CURRENT_DATE - INTERVAL '9 days', 'PRESENT', 2),
(1, 1, CURRENT_DATE - INTERVAL '8 days', 'ABSENT', 2),
(1, 1, CURRENT_DATE - INTERVAL '7 days', 'PRESENT', 2),
(1, 1, CURRENT_DATE - INTERVAL '6 days', 'PRESENT', 2),
(2, 1, CURRENT_DATE - INTERVAL '10 days', 'PRESENT', 2),
(2, 1, CURRENT_DATE - INTERVAL '9 days', 'ABSENT', 2),
(2, 1, CURRENT_DATE - INTERVAL '8 days', 'PRESENT', 2),
(4, 1, CURRENT_DATE - INTERVAL '10 days', 'PRESENT', 2),
(7, 1, CURRENT_DATE - INTERVAL '10 days', 'PRESENT', 2);

-- Sample Marks
INSERT INTO marks (student_id, course_id, assignment_marks, midterm_marks, final_marks, total_marks, percentage, grade) VALUES
(1, 1, 25, 40, 58, 123, 82.0, 'A'),
(1, 2, 28, 42, 60, 130, 86.67, 'A'),
(2, 1, 22, 38, 55, 115, 76.67, 'B'),
(2, 2, 27, 44, 62, 133, 88.67, 'A'),
(4, 1, 20, 35, 50, 105, 70.0, 'B'),
(7, 1, 18, 30, 45, 93, 62.0, 'C');

-- Sample Fees
INSERT INTO fees (student_id, amount, paid_amount, due_amount, payment_status, due_date, payment_date) VALUES
(1, 50000.00, 50000.00, 0.00, 'PAID', '2024-08-01', '2024-07-30'),
(2, 50000.00, 25000.00, 25000.00, 'PARTIAL', '2024-08-01', '2024-07-28'),
(3, 50000.00, 0.00, 50000.00, 'OVERDUE', '2024-08-01', NULL),
(4, 50000.00, 50000.00, 0.00, 'PAID', '2024-08-01', '2024-07-25'),
(5, 50000.00, 0.00, 50000.00, 'PENDING', '2024-09-01', NULL),
(6, 50000.00, 30000.00, 20000.00, 'PARTIAL', '2024-08-01', '2024-07-20'),
(7, 50000.00, 50000.00, 0.00, 'PAID', '2024-08-01', '2024-07-22'),
(9, 50000.00, 0.00, 50000.00, 'PENDING', '2024-09-01', NULL),
(10, 50000.00, 15000.00, 35000.00, 'PARTIAL', '2024-08-15', '2024-08-10');
