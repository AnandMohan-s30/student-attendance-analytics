-- Migration: Add users table for authentication
-- Run against existing student_attendance_db (does NOT touch existing tables)
-- Usage: mysql -u root -p student_attendance_db < database/migrate_users.sql

USE student_attendance_db;

CREATE TABLE IF NOT EXISTS users (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL,
  password    VARCHAR(255)  NOT NULL,
  role        ENUM('admin','staff') NOT NULL DEFAULT 'staff',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
);
