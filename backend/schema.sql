-- ============================================================
-- SHELVES ACADEMIC MANAGEMENT SYSTEM — DATABASE SETUP
-- Run this entire file in MySQL Workbench
-- ============================================================

CREATE DATABASE IF NOT EXISTS academic_app;
USE academic_app;

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student table
CREATE TABLE IF NOT EXISTS student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subject table
CREATE TABLE IF NOT EXISTS subject (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    credits INT NOT NULL DEFAULT 3
);

-- Enrollment (student <-> subject)
CREATE TABLE IF NOT EXISTS enrollment (
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    PRIMARY KEY (student_id, subject_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE CASCADE
);

-- Assignment table
CREATE TABLE IF NOT EXISTS assignment (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    subject_id INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE CASCADE
);

-- Learning Material table
CREATE TABLE IF NOT EXISTS learning_material (
    material_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    upload_date DATE,
    subject_id INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE CASCADE
);

-- Resource Link table
CREATE TABLE IF NOT EXISTS resource_link (
    link_id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    material_id INT NOT NULL,
    FOREIGN KEY (material_id) REFERENCES learning_material(material_id) ON DELETE CASCADE
);

-- Exam table
CREATE TABLE IF NOT EXISTS exam (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    exam_name VARCHAR(200) NOT NULL,
    exam_date DATE NOT NULL,
    max_marks INT DEFAULT 100,
    subject_id INT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON DELETE CASCADE
);

-- Announcement table
CREATE TABLE IF NOT EXISTS announcement (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    date DATE NOT NULL,
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE SET NULL
);

-- Community Post table
CREATE TABLE IF NOT EXISTS community_post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    post_date DATE NOT NULL,
    student_id INT,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE SET NULL
);

-- ============================================================
-- SAMPLE DATA
-- ============================================================

INSERT IGNORE INTO admin (admin_id, name, email) VALUES
(1, 'Admin One',   'admin1@college.edu'),
(2, 'Admin Two',   'admin2@college.edu');

INSERT IGNORE INTO student (name, email, password, branch, year) VALUES
('Aarav Sharma',   'aarav@gmail.com',   'pass123', 'CSE', 1),
('Priya Patel',    'priya@gmail.com',   'pass123', 'ECE', 2),
('Rohan Mehta',    'rohan@gmail.com',   'pass123', 'IT',  3),
('Sneha Kumar',    'sneha@gmail.com',   'pass123', 'ME',  4),
('Karan Singh',    'karan@gmail.com',   'pass123', 'CSE', 2);

INSERT IGNORE INTO subject (subject_name, semester, credits) VALUES
('Data Structures',          1, 4),
('Operating Systems',        3, 4),
('Database Management',      3, 3),
('Computer Networks',        5, 3),
('Software Engineering',     5, 3),
('Machine Learning',         7, 4),
('Web Technologies',         5, 3),
('Digital Electronics',      2, 3);

INSERT IGNORE INTO assignment (title, description, due_date, status, subject_id) VALUES
('Linked List Implementation', 'Implement singly and doubly linked lists', '2025-05-10', 'Pending',   1),
('OS Process Scheduling',      'Simulate FCFS and Round Robin',             '2025-05-15', 'Pending',   2),
('ER Diagram Design',          'Create ER diagram for a library system',    '2025-04-30', 'Completed', 3),
('TCP/IP Lab Report',          'Write report on TCP/IP protocols',          '2025-04-20', 'Overdue',   4),
('ML Model Training',          'Train a classification model using sklearn', '2025-06-01', 'Pending',  6);

INSERT IGNORE INTO learning_material (title, type, upload_date, subject_id) VALUES
('DS Lecture Notes Week 1',  'PDF',   '2025-04-01', 1),
('OS Slides Chapter 3',      'PPT',   '2025-04-05', 2),
('DBMS Tutorial Video',      'Video', '2025-04-10', 3),
('CN Lab Manual',            'PDF',   '2025-04-12', 4),
('ML Python Notebook',       'Other', '2025-04-15', 6);

INSERT IGNORE INTO exam (exam_name, exam_date, max_marks, subject_id) VALUES
('DS Mid Semester',    '2025-06-10', 50,  1),
('OS End Semester',    '2025-07-15', 100, 2),
('DBMS Quiz 1',        '2025-05-20', 25,  3),
('CN Lab Practical',   '2025-06-25', 50,  4),
('ML Final Project',   '2025-07-30', 100, 6);

INSERT IGNORE INTO announcement (title, message, date, admin_id) VALUES
('Welcome to Semester!',         'Welcome back students. Classes begin April 1st.',               '2025-04-01', 1),
('Assignment Submission Reminder','All pending assignments must be submitted by end of week.',    '2025-04-20', 1),
('Exam Schedule Released',       'The mid-semester exam schedule has been published. Check now.', '2025-04-25', 2);

INSERT IGNORE INTO community_post (content, post_date, student_id) VALUES
('Can anyone share notes for Data Structures Chapter 4?',    '2025-04-18', 1),
('Study group for OS exam — Saturday 10am library!',         '2025-04-19', 2),
('Found great ML resources on YouTube, will share the link.','2025-04-20', 3);

-- ============================================================
-- VERIFY SETUP (run these to confirm everything is in order)
-- ============================================================
-- SHOW TABLES;
-- SELECT * FROM student;
-- SELECT * FROM subject;
-- SELECT * FROM assignment;
-- SELECT * FROM exam;
-- SELECT * FROM announcement;
-- SELECT * FROM community_post;
