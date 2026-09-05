package com.studentmanagement.dto;

import com.studentmanagement.entity.Enrollment;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EnrollmentDto {

    public static class Request {
        private Long studentId, courseId;
        private LocalDate enrollmentDate;
        private Enrollment.Status status;
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long v) { this.studentId = v; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long v) { this.courseId = v; }
        public LocalDate getEnrollmentDate() { return enrollmentDate; }
        public void setEnrollmentDate(LocalDate v) { this.enrollmentDate = v; }
        public Enrollment.Status getStatus() { return status; }
        public void setStatus(Enrollment.Status v) { this.status = v; }
    }

    public static class Response {
        private Long id, studentId, courseId;
        private String studentName, studentStudentId, courseName, courseCode;
        private LocalDate enrollmentDate;
        private Enrollment.Status status;
        private LocalDateTime createdAt;
        public Long getId() { return id; }
        public void setId(Long v) { this.id = v; }
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long v) { this.studentId = v; }
        public String getStudentName() { return studentName; }
        public void setStudentName(String v) { this.studentName = v; }
        public String getStudentStudentId() { return studentStudentId; }
        public void setStudentStudentId(String v) { this.studentStudentId = v; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long v) { this.courseId = v; }
        public String getCourseName() { return courseName; }
        public void setCourseName(String v) { this.courseName = v; }
        public String getCourseCode() { return courseCode; }
        public void setCourseCode(String v) { this.courseCode = v; }
        public LocalDate getEnrollmentDate() { return enrollmentDate; }
        public void setEnrollmentDate(LocalDate v) { this.enrollmentDate = v; }
        public Enrollment.Status getStatus() { return status; }
        public void setStatus(Enrollment.Status v) { this.status = v; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    }
}
