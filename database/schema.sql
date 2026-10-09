CREATE DATABASE IF NOT EXISTS student_attendance_db;
USE student_attendance_db;

CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  roll_no VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  branch VARCHAR(100),
  semester INT,
  section VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subject_code VARCHAR(30) UNIQUE NOT NULL,
  subject_name VARCHAR(100) NOT NULL,
  semester INT,
  faculty_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('Present','Absent') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE(student_id, subject_id, attendance_date)
);

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_subject ON attendance(subject_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

INSERT INTO students (roll_no, name, email, branch, semester, section) VALUES
('CSE001', 'Aarav Sharma', 'aarav@college.edu', 'Computer Science', 5, 'A'),
('CSE002', 'Priya Patel', 'priya@college.edu', 'Computer Science', 5, 'A'),
('CSE003', 'Rohan Mehta', 'rohan@college.edu', 'Computer Science', 5, 'A'),
('CSE004', 'Sneha Reddy', 'sneha@college.edu', 'Computer Science', 5, 'B'),
('CSE005', 'Vikram Singh', 'vikram@college.edu', 'Computer Science', 5, 'B'),
('CSE006', 'Anjali Gupta', 'anjali@college.edu', 'Computer Science', 5, 'B'),
('CSE007', 'Arjun Nair', 'arjun@college.edu', 'Computer Science', 5, 'A'),
('CSE008', 'Kavya Rao', 'kavya@college.edu', 'Computer Science', 5, 'A'),
('CSE009', 'Manish Kumar', 'manish@college.edu', 'Computer Science', 5, 'B'),
('CSE010', 'Deepika Iyer', 'deepika@college.edu', 'Computer Science', 5, 'B'),
('ECE001', 'Rahul Verma', 'rahul@college.edu', 'Electronics', 5, 'A'),
('ECE002', 'Pooja Sharma', 'pooja@college.edu', 'Electronics', 5, 'A'),
('ECE003', 'Nikhil Joshi', 'nikhil@college.edu', 'Electronics', 5, 'A'),
('ECE004', 'Sonal Desai', 'sonal@college.edu', 'Electronics', 5, 'B'),
('ECE005', 'Aditya Yadav', 'aditya@college.edu', 'Electronics', 5, 'B'),
('MECH001', 'Ravi Pandey', 'ravi@college.edu', 'Mechanical', 5, 'A'),
('MECH002', 'Nisha Tiwari', 'nisha@college.edu', 'Mechanical', 5, 'A'),
('MECH003', 'Suresh Bhat', 'suresh@college.edu', 'Mechanical', 5, 'B'),
('CIVIL001', 'Tanya Mishra', 'tanya@college.edu', 'Civil', 5, 'A'),
('CIVIL002', 'Karan Kapoor', 'karan@college.edu', 'Civil', 5, 'A');

INSERT INTO subjects (subject_code, subject_name, semester, faculty_name) VALUES
('CS501', 'Data Structures & Algorithms', 5, 'Dr. Rajesh Kumar'),
('CS502', 'Database Management Systems', 5, 'Prof. Sunita Sharma'),
('CS503', 'Operating Systems', 5, 'Dr. Amit Verma'),
('CS504', 'Computer Networks', 5, 'Prof. Meena Joshi'),
('CS505', 'Software Engineering', 5, 'Dr. Pradeep Nair'),
('CS506', 'Machine Learning', 5, 'Prof. Kavita Reddy');

-- Generate attendance for 30 days (2024-10-01 to 2024-10-30)
-- Student 1 (CSE001 - Aarav): ~95% attendance (excellent)
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(1,1,'2024-10-01','Present'),(1,1,'2024-10-02','Present'),(1,1,'2024-10-03','Present'),(1,1,'2024-10-04','Present'),(1,1,'2024-10-07','Present'),
(1,1,'2024-10-08','Present'),(1,1,'2024-10-09','Present'),(1,1,'2024-10-10','Present'),(1,1,'2024-10-11','Present'),(1,1,'2024-10-14','Present'),
(1,1,'2024-10-15','Present'),(1,1,'2024-10-16','Present'),(1,1,'2024-10-17','Present'),(1,1,'2024-10-18','Absent'),(1,1,'2024-10-21','Present'),
(1,1,'2024-10-22','Present'),(1,1,'2024-10-23','Present'),(1,1,'2024-10-24','Present'),(1,1,'2024-10-25','Present'),(1,1,'2024-10-28','Present'),
(1,2,'2024-10-01','Present'),(1,2,'2024-10-02','Present'),(1,2,'2024-10-03','Present'),(1,2,'2024-10-04','Present'),(1,2,'2024-10-07','Present'),
(1,2,'2024-10-08','Present'),(1,2,'2024-10-09','Present'),(1,2,'2024-10-10','Present'),(1,2,'2024-10-11','Present'),(1,2,'2024-10-14','Present'),
(1,2,'2024-10-15','Present'),(1,2,'2024-10-16','Present'),(1,2,'2024-10-17','Present'),(1,2,'2024-10-18','Present'),(1,2,'2024-10-21','Present'),
(1,2,'2024-10-22','Present'),(1,2,'2024-10-23','Present'),(1,2,'2024-10-24','Present'),(1,2,'2024-10-25','Present'),(1,2,'2024-10-28','Present'),
(1,3,'2024-10-01','Present'),(1,3,'2024-10-02','Present'),(1,3,'2024-10-03','Present'),(1,3,'2024-10-04','Absent'),(1,3,'2024-10-07','Present'),
(1,3,'2024-10-08','Present'),(1,3,'2024-10-09','Present'),(1,3,'2024-10-10','Present'),(1,3,'2024-10-11','Present'),(1,3,'2024-10-14','Present'),
(1,3,'2024-10-15','Present'),(1,3,'2024-10-16','Present'),(1,3,'2024-10-17','Present'),(1,3,'2024-10-18','Present'),(1,3,'2024-10-21','Present'),
(1,3,'2024-10-22','Present'),(1,3,'2024-10-23','Present'),(1,3,'2024-10-24','Present'),(1,3,'2024-10-25','Present'),(1,3,'2024-10-28','Present');

-- Student 2 (CSE002 - Priya): ~88% attendance (good)
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(2,1,'2024-10-01','Present'),(2,1,'2024-10-02','Present'),(2,1,'2024-10-03','Absent'),(2,1,'2024-10-04','Present'),(2,1,'2024-10-07','Present'),
(2,1,'2024-10-08','Present'),(2,1,'2024-10-09','Present'),(2,1,'2024-10-10','Absent'),(2,1,'2024-10-11','Present'),(2,1,'2024-10-14','Present'),
(2,1,'2024-10-15','Present'),(2,1,'2024-10-16','Present'),(2,1,'2024-10-17','Present'),(2,1,'2024-10-18','Present'),(2,1,'2024-10-21','Present'),
(2,1,'2024-10-22','Present'),(2,1,'2024-10-23','Present'),(2,1,'2024-10-24','Present'),(2,1,'2024-10-25','Present'),(2,1,'2024-10-28','Present'),
(2,2,'2024-10-01','Present'),(2,2,'2024-10-02','Present'),(2,2,'2024-10-03','Present'),(2,2,'2024-10-04','Present'),(2,2,'2024-10-07','Absent'),
(2,2,'2024-10-08','Present'),(2,2,'2024-10-09','Present'),(2,2,'2024-10-10','Present'),(2,2,'2024-10-11','Absent'),(2,2,'2024-10-14','Present'),
(2,2,'2024-10-15','Present'),(2,2,'2024-10-16','Present'),(2,2,'2024-10-17','Present'),(2,2,'2024-10-18','Present'),(2,2,'2024-10-21','Present'),
(2,2,'2024-10-22','Present'),(2,2,'2024-10-23','Present'),(2,2,'2024-10-24','Present'),(2,2,'2024-10-25','Present'),(2,2,'2024-10-28','Present'),
(2,4,'2024-10-01','Present'),(2,4,'2024-10-02','Absent'),(2,4,'2024-10-03','Present'),(2,4,'2024-10-04','Present'),(2,4,'2024-10-07','Present'),
(2,4,'2024-10-08','Present'),(2,4,'2024-10-09','Absent'),(2,4,'2024-10-10','Present'),(2,4,'2024-10-11','Present'),(2,4,'2024-10-14','Present'),
(2,4,'2024-10-15','Present'),(2,4,'2024-10-16','Present'),(2,4,'2024-10-17','Present'),(2,4,'2024-10-18','Present'),(2,4,'2024-10-21','Present'),
(2,4,'2024-10-22','Present'),(2,4,'2024-10-23','Present'),(2,4,'2024-10-24','Present'),(2,4,'2024-10-25','Present'),(2,4,'2024-10-28','Present');

-- Student 3 (CSE003 - Rohan): ~70% attendance (warning)
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(3,1,'2024-10-01','Present'),(3,1,'2024-10-02','Absent'),(3,1,'2024-10-03','Absent'),(3,1,'2024-10-04','Present'),(3,1,'2024-10-07','Present'),
(3,1,'2024-10-08','Absent'),(3,1,'2024-10-09','Present'),(3,1,'2024-10-10','Present'),(3,1,'2024-10-11','Absent'),(3,1,'2024-10-14','Present'),
(3,1,'2024-10-15','Present'),(3,1,'2024-10-16','Absent'),(3,1,'2024-10-17','Present'),(3,1,'2024-10-18','Present'),(3,1,'2024-10-21','Absent'),
(3,1,'2024-10-22','Present'),(3,1,'2024-10-23','Present'),(3,1,'2024-10-24','Absent'),(3,1,'2024-10-25','Present'),(3,1,'2024-10-28','Present'),
(3,2,'2024-10-01','Absent'),(3,2,'2024-10-02','Present'),(3,2,'2024-10-03','Absent'),(3,2,'2024-10-04','Present'),(3,2,'2024-10-07','Present'),
(3,2,'2024-10-08','Absent'),(3,2,'2024-10-09','Present'),(3,2,'2024-10-10','Absent'),(3,2,'2024-10-11','Present'),(3,2,'2024-10-14','Present'),
(3,2,'2024-10-15','Absent'),(3,2,'2024-10-16','Present'),(3,2,'2024-10-17','Present'),(3,2,'2024-10-18','Absent'),(3,2,'2024-10-21','Present'),
(3,2,'2024-10-22','Present'),(3,2,'2024-10-23','Absent'),(3,2,'2024-10-24','Present'),(3,2,'2024-10-25','Present'),(3,2,'2024-10-28','Present'),
(3,3,'2024-10-01','Present'),(3,3,'2024-10-02','Absent'),(3,3,'2024-10-03','Present'),(3,3,'2024-10-04','Absent'),(3,3,'2024-10-07','Present'),
(3,3,'2024-10-08','Present'),(3,3,'2024-10-09','Absent'),(3,3,'2024-10-10','Present'),(3,3,'2024-10-11','Present'),(3,3,'2024-10-14','Absent'),
(3,3,'2024-10-15','Present'),(3,3,'2024-10-16','Present'),(3,3,'2024-10-17','Absent'),(3,3,'2024-10-18','Present'),(3,3,'2024-10-21','Present'),
(3,3,'2024-10-22','Absent'),(3,3,'2024-10-23','Present'),(3,3,'2024-10-24','Present'),(3,3,'2024-10-25','Absent'),(3,3,'2024-10-28','Present');

-- Student 4 (CSE004 - Sneha): ~92% attendance (excellent)
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(4,1,'2024-10-01','Present'),(4,1,'2024-10-02','Present'),(4,1,'2024-10-03','Present'),(4,1,'2024-10-04','Present'),(4,1,'2024-10-07','Present'),
(4,1,'2024-10-08','Present'),(4,1,'2024-10-09','Present'),(4,1,'2024-10-10','Present'),(4,1,'2024-10-11','Absent'),(4,1,'2024-10-14','Present'),
(4,1,'2024-10-15','Present'),(4,1,'2024-10-16','Present'),(4,1,'2024-10-17','Present'),(4,1,'2024-10-18','Present'),(4,1,'2024-10-21','Present'),
(4,1,'2024-10-22','Present'),(4,1,'2024-10-23','Present'),(4,1,'2024-10-24','Present'),(4,1,'2024-10-25','Present'),(4,1,'2024-10-28','Present'),
(4,2,'2024-10-01','Present'),(4,2,'2024-10-02','Present'),(4,2,'2024-10-03','Present'),(4,2,'2024-10-04','Present'),(4,2,'2024-10-07','Present'),
(4,2,'2024-10-08','Present'),(4,2,'2024-10-09','Present'),(4,2,'2024-10-10','Present'),(4,2,'2024-10-11','Present'),(4,2,'2024-10-14','Present'),
(4,2,'2024-10-15','Present'),(4,2,'2024-10-16','Present'),(4,2,'2024-10-17','Present'),(4,2,'2024-10-18','Present'),(4,2,'2024-10-21','Present'),
(4,2,'2024-10-22','Present'),(4,2,'2024-10-23','Present'),(4,2,'2024-10-24','Present'),(4,2,'2024-10-25','Absent'),(4,2,'2024-10-28','Present'),
(4,5,'2024-10-01','Present'),(4,5,'2024-10-02','Present'),(4,5,'2024-10-03','Present'),(4,5,'2024-10-04','Present'),(4,5,'2024-10-07','Present'),
(4,5,'2024-10-08','Present'),(4,5,'2024-10-09','Present'),(4,5,'2024-10-10','Present'),(4,5,'2024-10-11','Present'),(4,5,'2024-10-14','Present'),
(4,5,'2024-10-15','Present'),(4,5,'2024-10-16','Present'),(4,5,'2024-10-17','Absent'),(4,5,'2024-10-18','Present'),(4,5,'2024-10-21','Present'),
(4,5,'2024-10-22','Present'),(4,5,'2024-10-23','Present'),(4,5,'2024-10-24','Present'),(4,5,'2024-10-25','Present'),(4,5,'2024-10-28','Present');

-- Student 5 (CSE005 - Vikram): ~55% attendance (critical)
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(5,1,'2024-10-01','Absent'),(5,1,'2024-10-02','Present'),(5,1,'2024-10-03','Absent'),(5,1,'2024-10-04','Absent'),(5,1,'2024-10-07','Present'),
(5,1,'2024-10-08','Absent'),(5,1,'2024-10-09','Present'),(5,1,'2024-10-10','Absent'),(5,1,'2024-10-11','Absent'),(5,1,'2024-10-14','Present'),
(5,1,'2024-10-15','Absent'),(5,1,'2024-10-16','Present'),(5,1,'2024-10-17','Absent'),(5,1,'2024-10-18','Present'),(5,1,'2024-10-21','Absent'),
(5,1,'2024-10-22','Present'),(5,1,'2024-10-23','Absent'),(5,1,'2024-10-24','Present'),(5,1,'2024-10-25','Absent'),(5,1,'2024-10-28','Present'),
(5,3,'2024-10-01','Present'),(5,3,'2024-10-02','Absent'),(5,3,'2024-10-03','Absent'),(5,3,'2024-10-04','Present'),(5,3,'2024-10-07','Absent'),
(5,3,'2024-10-08','Present'),(5,3,'2024-10-09','Absent'),(5,3,'2024-10-10','Absent'),(5,3,'2024-10-11','Present'),(5,3,'2024-10-14','Absent'),
(5,3,'2024-10-15','Present'),(5,3,'2024-10-16','Absent'),(5,3,'2024-10-17','Present'),(5,3,'2024-10-18','Absent'),(5,3,'2024-10-21','Present'),
(5,3,'2024-10-22','Absent'),(5,3,'2024-10-23','Present'),(5,3,'2024-10-24','Absent'),(5,3,'2024-10-25','Absent'),(5,3,'2024-10-28','Present');

-- Student 6 (CSE006 - Anjali): ~80% attendance (good)
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(6,2,'2024-10-01','Present'),(6,2,'2024-10-02','Present'),(6,2,'2024-10-03','Present'),(6,2,'2024-10-04','Absent'),(6,2,'2024-10-07','Present'),
(6,2,'2024-10-08','Present'),(6,2,'2024-10-09','Present'),(6,2,'2024-10-10','Present'),(6,2,'2024-10-11','Present'),(6,2,'2024-10-14','Absent'),
(6,2,'2024-10-15','Present'),(6,2,'2024-10-16','Present'),(6,2,'2024-10-17','Present'),(6,2,'2024-10-18','Present'),(6,2,'2024-10-21','Present'),
(6,2,'2024-10-22','Absent'),(6,2,'2024-10-23','Present'),(6,2,'2024-10-24','Present'),(6,2,'2024-10-25','Present'),(6,2,'2024-10-28','Present'),
(6,4,'2024-10-01','Present'),(6,4,'2024-10-02','Present'),(6,4,'2024-10-03','Absent'),(6,4,'2024-10-04','Present'),(6,4,'2024-10-07','Present'),
(6,4,'2024-10-08','Present'),(6,4,'2024-10-09','Present'),(6,4,'2024-10-10','Absent'),(6,4,'2024-10-11','Present'),(6,4,'2024-10-14','Present'),
(6,4,'2024-10-15','Present'),(6,4,'2024-10-16','Present'),(6,4,'2024-10-17','Present'),(6,4,'2024-10-18','Present'),(6,4,'2024-10-21','Absent'),
(6,4,'2024-10-22','Present'),(6,4,'2024-10-23','Present'),(6,4,'2024-10-24','Present'),(6,4,'2024-10-25','Present'),(6,4,'2024-10-28','Present'),
(6,6,'2024-10-01','Present'),(6,6,'2024-10-02','Present'),(6,6,'2024-10-03','Present'),(6,6,'2024-10-04','Present'),(6,6,'2024-10-07','Absent'),
(6,6,'2024-10-08','Present'),(6,6,'2024-10-09','Present'),(6,6,'2024-10-10','Present'),(6,6,'2024-10-11','Present'),(6,6,'2024-10-14','Present'),
(6,6,'2024-10-15','Absent'),(6,6,'2024-10-16','Present'),(6,6,'2024-10-17','Present'),(6,6,'2024-10-18','Present'),(6,6,'2024-10-21','Present'),
(6,6,'2024-10-22','Present'),(6,6,'2024-10-23','Present'),(6,6,'2024-10-24','Absent'),(6,6,'2024-10-25','Present'),(6,6,'2024-10-28','Present');

-- Student 7 (CSE007 - Arjun): ~96% attendance (excellent)
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(7,1,'2024-10-01','Present'),(7,1,'2024-10-02','Present'),(7,1,'2024-10-03','Present'),(7,1,'2024-10-04','Present'),(7,1,'2024-10-07','Present'),
(7,1,'2024-10-08','Present'),(7,1,'2024-10-09','Present'),(7,1,'2024-10-10','Present'),(7,1,'2024-10-11','Present'),(7,1,'2024-10-14','Present'),
(7,1,'2024-10-15','Present'),(7,1,'2024-10-16','Present'),(7,1,'2024-10-17','Present'),(7,1,'2024-10-18','Present'),(7,1,'2024-10-21','Present'),
(7,1,'2024-10-22','Present'),(7,1,'2024-10-23','Present'),(7,1,'2024-10-24','Absent'),(7,1,'2024-10-25','Present'),(7,1,'2024-10-28','Present'),
(7,5,'2024-10-01','Present'),(7,5,'2024-10-02','Present'),(7,5,'2024-10-03','Present'),(7,5,'2024-10-04','Present'),(7,5,'2024-10-07','Present'),
(7,5,'2024-10-08','Present'),(7,5,'2024-10-09','Present'),(7,5,'2024-10-10','Present'),(7,5,'2024-10-11','Present'),(7,5,'2024-10-14','Present'),
(7,5,'2024-10-15','Present'),(7,5,'2024-10-16','Present'),(7,5,'2024-10-17','Present'),(7,5,'2024-10-18','Present'),(7,5,'2024-10-21','Present'),
(7,5,'2024-10-22','Present'),(7,5,'2024-10-23','Present'),(7,5,'2024-10-24','Present'),(7,5,'2024-10-25','Present'),(7,5,'2024-10-28','Present');

-- Student 8 (CSE008 - Kavya): ~65% attendance (warning)
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(8,2,'2024-10-01','Present'),(8,2,'2024-10-02','Absent'),(8,2,'2024-10-03','Present'),(8,2,'2024-10-04','Absent'),(8,2,'2024-10-07','Present'),
(8,2,'2024-10-08','Absent'),(8,2,'2024-10-09','Present'),(8,2,'2024-10-10','Present'),(8,2,'2024-10-11','Absent'),(8,2,'2024-10-14','Present'),
(8,2,'2024-10-15','Absent'),(8,2,'2024-10-16','Present'),(8,2,'2024-10-17','Present'),(8,2,'2024-10-18','Absent'),(8,2,'2024-10-21','Present'),
(8,2,'2024-10-22','Present'),(8,2,'2024-10-23','Absent'),(8,2,'2024-10-24','Present'),(8,2,'2024-10-25','Present'),(8,2,'2024-10-28','Present'),
(8,3,'2024-10-01','Absent'),(8,3,'2024-10-02','Present'),(8,3,'2024-10-03','Absent'),(8,3,'2024-10-04','Present'),(8,3,'2024-10-07','Absent'),
(8,3,'2024-10-08','Present'),(8,3,'2024-10-09','Present'),(8,3,'2024-10-10','Absent'),(8,3,'2024-10-11','Present'),(8,3,'2024-10-14','Present'),
(8,3,'2024-10-15','Absent'),(8,3,'2024-10-16','Present'),(8,3,'2024-10-17','Absent'),(8,3,'2024-10-18','Present'),(8,3,'2024-10-21','Present'),
(8,3,'2024-10-22','Absent'),(8,3,'2024-10-23','Present'),(8,3,'2024-10-24','Present'),(8,3,'2024-10-25','Absent'),(8,3,'2024-10-28','Present');

-- Students 9-20 with varying attendance
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
-- Student 9 (Manish ~78%)
(9,1,'2024-10-01','Present'),(9,1,'2024-10-02','Present'),(9,1,'2024-10-03','Absent'),(9,1,'2024-10-04','Present'),(9,1,'2024-10-07','Present'),
(9,1,'2024-10-08','Present'),(9,1,'2024-10-09','Absent'),(9,1,'2024-10-10','Present'),(9,1,'2024-10-11','Present'),(9,1,'2024-10-14','Present'),
(9,1,'2024-10-15','Present'),(9,1,'2024-10-16','Absent'),(9,1,'2024-10-17','Present'),(9,1,'2024-10-18','Present'),(9,1,'2024-10-21','Present'),
(9,1,'2024-10-22','Present'),(9,1,'2024-10-23','Present'),(9,1,'2024-10-24','Absent'),(9,1,'2024-10-25','Present'),(9,1,'2024-10-28','Present'),
(9,4,'2024-10-01','Present'),(9,4,'2024-10-02','Present'),(9,4,'2024-10-03','Present'),(9,4,'2024-10-04','Absent'),(9,4,'2024-10-07','Present'),
(9,4,'2024-10-08','Present'),(9,4,'2024-10-09','Present'),(9,4,'2024-10-10','Present'),(9,4,'2024-10-11','Present'),(9,4,'2024-10-14','Absent'),
(9,4,'2024-10-15','Present'),(9,4,'2024-10-16','Present'),(9,4,'2024-10-17','Present'),(9,4,'2024-10-18','Present'),(9,4,'2024-10-21','Present'),
(9,4,'2024-10-22','Present'),(9,4,'2024-10-23','Absent'),(9,4,'2024-10-24','Present'),(9,4,'2024-10-25','Present'),(9,4,'2024-10-28','Present'),
-- Student 10 (Deepika ~50% - critical)
(10,2,'2024-10-01','Absent'),(10,2,'2024-10-02','Absent'),(10,2,'2024-10-03','Present'),(10,2,'2024-10-04','Absent'),(10,2,'2024-10-07','Present'),
(10,2,'2024-10-08','Absent'),(10,2,'2024-10-09','Present'),(10,2,'2024-10-10','Absent'),(10,2,'2024-10-11','Absent'),(10,2,'2024-10-14','Present'),
(10,2,'2024-10-15','Absent'),(10,2,'2024-10-16','Present'),(10,2,'2024-10-17','Absent'),(10,2,'2024-10-18','Present'),(10,2,'2024-10-21','Absent'),
(10,2,'2024-10-22','Present'),(10,2,'2024-10-23','Absent'),(10,2,'2024-10-24','Present'),(10,2,'2024-10-25','Absent'),(10,2,'2024-10-28','Present'),
(10,5,'2024-10-01','Present'),(10,5,'2024-10-02','Absent'),(10,5,'2024-10-03','Absent'),(10,5,'2024-10-04','Present'),(10,5,'2024-10-07','Absent'),
(10,5,'2024-10-08','Absent'),(10,5,'2024-10-09','Present'),(10,5,'2024-10-10','Absent'),(10,5,'2024-10-11','Present'),(10,5,'2024-10-14','Absent'),
(10,5,'2024-10-15','Present'),(10,5,'2024-10-16','Absent'),(10,5,'2024-10-17','Absent'),(10,5,'2024-10-18','Present'),(10,5,'2024-10-21','Absent'),
(10,5,'2024-10-22','Present'),(10,5,'2024-10-23','Absent'),(10,5,'2024-10-24','Absent'),(10,5,'2024-10-25','Present'),(10,5,'2024-10-28','Absent');

-- Students 11-20 with various attendance across subjects
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(11,3,'2024-10-01','Present'),(11,3,'2024-10-02','Present'),(11,3,'2024-10-03','Present'),(11,3,'2024-10-04','Present'),(11,3,'2024-10-07','Present'),
(11,3,'2024-10-08','Present'),(11,3,'2024-10-09','Present'),(11,3,'2024-10-10','Absent'),(11,3,'2024-10-11','Present'),(11,3,'2024-10-14','Present'),
(11,3,'2024-10-15','Present'),(11,3,'2024-10-16','Present'),(11,3,'2024-10-17','Present'),(11,3,'2024-10-18','Present'),(11,3,'2024-10-21','Present'),
(11,3,'2024-10-22','Present'),(11,3,'2024-10-23','Present'),(11,3,'2024-10-24','Present'),(11,3,'2024-10-25','Present'),(11,3,'2024-10-28','Present'),
(12,4,'2024-10-01','Present'),(12,4,'2024-10-02','Absent'),(12,4,'2024-10-03','Present'),(12,4,'2024-10-04','Present'),(12,4,'2024-10-07','Present'),
(12,4,'2024-10-08','Absent'),(12,4,'2024-10-09','Present'),(12,4,'2024-10-10','Present'),(12,4,'2024-10-11','Present'),(12,4,'2024-10-14','Present'),
(12,4,'2024-10-15','Present'),(12,4,'2024-10-16','Absent'),(12,4,'2024-10-17','Present'),(12,4,'2024-10-18','Present'),(12,4,'2024-10-21','Present'),
(12,4,'2024-10-22','Present'),(12,4,'2024-10-23','Present'),(12,4,'2024-10-24','Present'),(12,4,'2024-10-25','Present'),(12,4,'2024-10-28','Present'),
(13,5,'2024-10-01','Absent'),(13,5,'2024-10-02','Present'),(13,5,'2024-10-03','Absent'),(13,5,'2024-10-04','Present'),(13,5,'2024-10-07','Present'),
(13,5,'2024-10-08','Absent'),(13,5,'2024-10-09','Present'),(13,5,'2024-10-10','Present'),(13,5,'2024-10-11','Absent'),(13,5,'2024-10-14','Present'),
(13,5,'2024-10-15','Present'),(13,5,'2024-10-16','Absent'),(13,5,'2024-10-17','Present'),(13,5,'2024-10-18','Present'),(13,5,'2024-10-21','Present'),
(13,5,'2024-10-22','Present'),(13,5,'2024-10-23','Absent'),(13,5,'2024-10-24','Present'),(13,5,'2024-10-25','Present'),(13,5,'2024-10-28','Present'),
(14,6,'2024-10-01','Present'),(14,6,'2024-10-02','Present'),(14,6,'2024-10-03','Present'),(14,6,'2024-10-04','Present'),(14,6,'2024-10-07','Present'),
(14,6,'2024-10-08','Present'),(14,6,'2024-10-09','Present'),(14,6,'2024-10-10','Present'),(14,6,'2024-10-11','Present'),(14,6,'2024-10-14','Present'),
(14,6,'2024-10-15','Present'),(14,6,'2024-10-16','Present'),(14,6,'2024-10-17','Present'),(14,6,'2024-10-18','Absent'),(14,6,'2024-10-21','Present'),
(14,6,'2024-10-22','Present'),(14,6,'2024-10-23','Present'),(14,6,'2024-10-24','Present'),(14,6,'2024-10-25','Present'),(14,6,'2024-10-28','Present'),
(15,1,'2024-10-01','Absent'),(15,1,'2024-10-02','Present'),(15,1,'2024-10-03','Present'),(15,1,'2024-10-04','Absent'),(15,1,'2024-10-07','Present'),
(15,1,'2024-10-08','Present'),(15,1,'2024-10-09','Absent'),(15,1,'2024-10-10','Present'),(15,1,'2024-10-11','Present'),(15,1,'2024-10-14','Absent'),
(15,1,'2024-10-15','Present'),(15,1,'2024-10-16','Present'),(15,1,'2024-10-17','Absent'),(15,1,'2024-10-18','Present'),(15,1,'2024-10-21','Present'),
(15,1,'2024-10-22','Absent'),(15,1,'2024-10-23','Present'),(15,1,'2024-10-24','Present'),(15,1,'2024-10-25','Absent'),(15,1,'2024-10-28','Present'),
(16,2,'2024-10-01','Present'),(16,2,'2024-10-02','Present'),(16,2,'2024-10-03','Present'),(16,2,'2024-10-04','Present'),(16,2,'2024-10-07','Absent'),
(16,2,'2024-10-08','Present'),(16,2,'2024-10-09','Present'),(16,2,'2024-10-10','Present'),(16,2,'2024-10-11','Present'),(16,2,'2024-10-14','Present'),
(16,2,'2024-10-15','Present'),(16,2,'2024-10-16','Present'),(16,2,'2024-10-17','Present'),(16,2,'2024-10-18','Present'),(16,2,'2024-10-21','Present'),
(16,2,'2024-10-22','Present'),(16,2,'2024-10-23','Absent'),(16,2,'2024-10-24','Present'),(16,2,'2024-10-25','Present'),(16,2,'2024-10-28','Present'),
(17,3,'2024-10-01','Absent'),(17,3,'2024-10-02','Absent'),(17,3,'2024-10-03','Present'),(17,3,'2024-10-04','Absent'),(17,3,'2024-10-07','Present'),
(17,3,'2024-10-08','Absent'),(17,3,'2024-10-09','Present'),(17,3,'2024-10-10','Present'),(17,3,'2024-10-11','Absent'),(17,3,'2024-10-14','Present'),
(17,3,'2024-10-15','Present'),(17,3,'2024-10-16','Absent'),(17,3,'2024-10-17','Present'),(17,3,'2024-10-18','Absent'),(17,3,'2024-10-21','Present'),
(17,3,'2024-10-22','Present'),(17,3,'2024-10-23','Absent'),(17,3,'2024-10-24','Present'),(17,3,'2024-10-25','Absent'),(17,3,'2024-10-28','Present'),
(18,4,'2024-10-01','Present'),(18,4,'2024-10-02','Present'),(18,4,'2024-10-03','Present'),(18,4,'2024-10-04','Present'),(18,4,'2024-10-07','Present'),
(18,4,'2024-10-08','Present'),(18,4,'2024-10-09','Absent'),(18,4,'2024-10-10','Present'),(18,4,'2024-10-11','Present'),(18,4,'2024-10-14','Present'),
(18,4,'2024-10-15','Present'),(18,4,'2024-10-16','Present'),(18,4,'2024-10-17','Present'),(18,4,'2024-10-18','Present'),(18,4,'2024-10-21','Present'),
(18,4,'2024-10-22','Present'),(18,4,'2024-10-23','Present'),(18,4,'2024-10-24','Present'),(18,4,'2024-10-25','Present'),(18,4,'2024-10-28','Present'),
(19,5,'2024-10-01','Present'),(19,5,'2024-10-02','Absent'),(19,5,'2024-10-03','Absent'),(19,5,'2024-10-04','Present'),(19,5,'2024-10-07','Absent'),
(19,5,'2024-10-08','Present'),(19,5,'2024-10-09','Absent'),(19,5,'2024-10-10','Present'),(19,5,'2024-10-11','Absent'),(19,5,'2024-10-14','Present'),
(19,5,'2024-10-15','Absent'),(19,5,'2024-10-16','Present'),(19,5,'2024-10-17','Present'),(19,5,'2024-10-18','Absent'),(19,5,'2024-10-21','Present'),
(19,5,'2024-10-22','Present'),(19,5,'2024-10-23','Absent'),(19,5,'2024-10-24','Present'),(19,5,'2024-10-25','Absent'),(19,5,'2024-10-28','Present'),
(20,6,'2024-10-01','Present'),(20,6,'2024-10-02','Present'),(20,6,'2024-10-03','Present'),(20,6,'2024-10-04','Absent'),(20,6,'2024-10-07','Present'),
(20,6,'2024-10-08','Present'),(20,6,'2024-10-09','Present'),(20,6,'2024-10-10','Present'),(20,6,'2024-10-11','Present'),(20,6,'2024-10-14','Present'),
(20,6,'2024-10-15','Present'),(20,6,'2024-10-16','Present'),(20,6,'2024-10-17','Absent'),(20,6,'2024-10-18','Present'),(20,6,'2024-10-21','Present'),
(20,6,'2024-10-22','Present'),(20,6,'2024-10-23','Present'),(20,6,'2024-10-24','Present'),(20,6,'2024-10-25','Present'),(20,6,'2024-10-28','Present');

-- Additional months for monthly trend chart (August and September 2024)
-- Using a subset of students and subjects to keep data lean but representative

-- August 2024 (students 1-10, subject 1 & 2, 10 working days)
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(1,1,'2024-08-01','Present'),(1,1,'2024-08-02','Present'),(1,1,'2024-08-05','Present'),(1,1,'2024-08-06','Present'),(1,1,'2024-08-07','Present'),
(1,1,'2024-08-08','Present'),(1,1,'2024-08-09','Present'),(1,1,'2024-08-12','Present'),(1,1,'2024-08-13','Absent'),(1,1,'2024-08-14','Present'),
(2,1,'2024-08-01','Present'),(2,1,'2024-08-02','Absent'),(2,1,'2024-08-05','Present'),(2,1,'2024-08-06','Present'),(2,1,'2024-08-07','Absent'),
(2,1,'2024-08-08','Present'),(2,1,'2024-08-09','Present'),(2,1,'2024-08-12','Present'),(2,1,'2024-08-13','Present'),(2,1,'2024-08-14','Present'),
(3,1,'2024-08-01','Absent'),(3,1,'2024-08-02','Present'),(3,1,'2024-08-05','Absent'),(3,1,'2024-08-06','Present'),(3,1,'2024-08-07','Present'),
(3,1,'2024-08-08','Absent'),(3,1,'2024-08-09','Present'),(3,1,'2024-08-12','Present'),(3,1,'2024-08-13','Absent'),(3,1,'2024-08-14','Present'),
(4,1,'2024-08-01','Present'),(4,1,'2024-08-02','Present'),(4,1,'2024-08-05','Present'),(4,1,'2024-08-06','Present'),(4,1,'2024-08-07','Present'),
(4,1,'2024-08-08','Present'),(4,1,'2024-08-09','Present'),(4,1,'2024-08-12','Present'),(4,1,'2024-08-13','Present'),(4,1,'2024-08-14','Present'),
(5,1,'2024-08-01','Absent'),(5,1,'2024-08-02','Absent'),(5,1,'2024-08-05','Present'),(5,1,'2024-08-06','Absent'),(5,1,'2024-08-07','Present'),
(5,1,'2024-08-08','Absent'),(5,1,'2024-08-09','Present'),(5,1,'2024-08-12','Absent'),(5,1,'2024-08-13','Present'),(5,1,'2024-08-14','Absent'),
(6,2,'2024-08-01','Present'),(6,2,'2024-08-02','Present'),(6,2,'2024-08-05','Present'),(6,2,'2024-08-06','Absent'),(6,2,'2024-08-07','Present'),
(6,2,'2024-08-08','Present'),(6,2,'2024-08-09','Present'),(6,2,'2024-08-12','Present'),(6,2,'2024-08-13','Present'),(6,2,'2024-08-14','Absent'),
(7,1,'2024-08-01','Present'),(7,1,'2024-08-02','Present'),(7,1,'2024-08-05','Present'),(7,1,'2024-08-06','Present'),(7,1,'2024-08-07','Present'),
(7,1,'2024-08-08','Present'),(7,1,'2024-08-09','Present'),(7,1,'2024-08-12','Present'),(7,1,'2024-08-13','Present'),(7,1,'2024-08-14','Present'),
(8,2,'2024-08-01','Present'),(8,2,'2024-08-02','Absent'),(8,2,'2024-08-05','Present'),(8,2,'2024-08-06','Absent'),(8,2,'2024-08-07','Present'),
(8,2,'2024-08-08','Present'),(8,2,'2024-08-09','Absent'),(8,2,'2024-08-12','Present'),(8,2,'2024-08-13','Present'),(8,2,'2024-08-14','Absent'),
(9,1,'2024-08-01','Present'),(9,1,'2024-08-02','Present'),(9,1,'2024-08-05','Absent'),(9,1,'2024-08-06','Present'),(9,1,'2024-08-07','Present'),
(9,1,'2024-08-08','Present'),(9,1,'2024-08-09','Present'),(9,1,'2024-08-12','Absent'),(9,1,'2024-08-13','Present'),(9,1,'2024-08-14','Present'),
(10,2,'2024-08-01','Absent'),(10,2,'2024-08-02','Present'),(10,2,'2024-08-05','Absent'),(10,2,'2024-08-06','Present'),(10,2,'2024-08-07','Absent'),
(10,2,'2024-08-08','Absent'),(10,2,'2024-08-09','Present'),(10,2,'2024-08-12','Absent'),(10,2,'2024-08-13','Present'),(10,2,'2024-08-14','Absent');

-- September 2024 (students 1-10, subject 1 & 2, 10 working days)
INSERT INTO attendance (student_id, subject_id, attendance_date, status) VALUES
(1,1,'2024-09-02','Present'),(1,1,'2024-09-03','Present'),(1,1,'2024-09-04','Present'),(1,1,'2024-09-05','Present'),(1,1,'2024-09-06','Present'),
(1,1,'2024-09-09','Present'),(1,1,'2024-09-10','Absent'),(1,1,'2024-09-11','Present'),(1,1,'2024-09-12','Present'),(1,1,'2024-09-13','Present'),
(2,1,'2024-09-02','Present'),(2,1,'2024-09-03','Present'),(2,1,'2024-09-04','Absent'),(2,1,'2024-09-05','Present'),(2,1,'2024-09-06','Present'),
(2,1,'2024-09-09','Present'),(2,1,'2024-09-10','Present'),(2,1,'2024-09-11','Absent'),(2,1,'2024-09-12','Present'),(2,1,'2024-09-13','Present'),
(3,1,'2024-09-02','Absent'),(3,1,'2024-09-03','Present'),(3,1,'2024-09-04','Absent'),(3,1,'2024-09-05','Present'),(3,1,'2024-09-06','Absent'),
(3,1,'2024-09-09','Present'),(3,1,'2024-09-10','Present'),(3,1,'2024-09-11','Absent'),(3,1,'2024-09-12','Present'),(3,1,'2024-09-13','Present'),
(4,1,'2024-09-02','Present'),(4,1,'2024-09-03','Present'),(4,1,'2024-09-04','Present'),(4,1,'2024-09-05','Present'),(4,1,'2024-09-06','Present'),
(4,1,'2024-09-09','Present'),(4,1,'2024-09-10','Present'),(4,1,'2024-09-11','Present'),(4,1,'2024-09-12','Present'),(4,1,'2024-09-13','Absent'),
(5,1,'2024-09-02','Absent'),(5,1,'2024-09-03','Absent'),(5,1,'2024-09-04','Present'),(5,1,'2024-09-05','Absent'),(5,1,'2024-09-06','Present'),
(5,1,'2024-09-09','Absent'),(5,1,'2024-09-10','Present'),(5,1,'2024-09-11','Absent'),(5,1,'2024-09-12','Absent'),(5,1,'2024-09-13','Present'),
(6,2,'2024-09-02','Present'),(6,2,'2024-09-03','Absent'),(6,2,'2024-09-04','Present'),(6,2,'2024-09-05','Present'),(6,2,'2024-09-06','Present'),
(6,2,'2024-09-09','Present'),(6,2,'2024-09-10','Present'),(6,2,'2024-09-11','Absent'),(6,2,'2024-09-12','Present'),(6,2,'2024-09-13','Present'),
(7,1,'2024-09-02','Present'),(7,1,'2024-09-03','Present'),(7,1,'2024-09-04','Present'),(7,1,'2024-09-05','Present'),(7,1,'2024-09-06','Present'),
(7,1,'2024-09-09','Present'),(7,1,'2024-09-10','Present'),(7,1,'2024-09-11','Present'),(7,1,'2024-09-12','Present'),(7,1,'2024-09-13','Present'),
(8,2,'2024-09-02','Absent'),(8,2,'2024-09-03','Present'),(8,2,'2024-09-04','Absent'),(8,2,'2024-09-05','Present'),(8,2,'2024-09-06','Present'),
(8,2,'2024-09-09','Absent'),(8,2,'2024-09-10','Present'),(8,2,'2024-09-11','Present'),(8,2,'2024-09-12','Absent'),(8,2,'2024-09-13','Present'),
(9,1,'2024-09-02','Present'),(9,1,'2024-09-03','Present'),(9,1,'2024-09-04','Present'),(9,1,'2024-09-05','Absent'),(9,1,'2024-09-06','Present'),
(9,1,'2024-09-09','Present'),(9,1,'2024-09-10','Present'),(9,1,'2024-09-11','Absent'),(9,1,'2024-09-12','Present'),(9,1,'2024-09-13','Present'),
(10,2,'2024-09-02','Present'),(10,2,'2024-09-03','Absent'),(10,2,'2024-09-04','Present'),(10,2,'2024-09-05','Absent'),(10,2,'2024-09-06','Present'),
(10,2,'2024-09-09','Absent'),(10,2,'2024-09-10','Present'),(10,2,'2024-09-11','Absent'),(10,2,'2024-09-12','Present'),(10,2,'2024-09-13','Absent');
