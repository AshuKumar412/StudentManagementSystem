package com.studentmanagement.dto;

import java.time.LocalDateTime;

public class MarksDto {

    public static class Request {
        private Long studentId, courseId;
        private Double assignmentMarks, midtermMarks, finalMarks;
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long v) { this.studentId = v; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long v) { this.courseId = v; }
        public Double getAssignmentMarks() { return assignmentMarks; }
        public void setAssignmentMarks(Double v) { this.assignmentMarks = v; }
        public Double getMidtermMarks() { return midtermMarks; }
        public void setMidtermMarks(Double v) { this.midtermMarks = v; }
        public Double getFinalMarks() { return finalMarks; }
        public void setFinalMarks(Double v) { this.finalMarks = v; }
    }

    public static class Response {
        private Long id, studentId, courseId;
        private String studentName, studentStudentId, courseName, grade;
        private Double assignmentMarks, midtermMarks, finalMarks, totalMarks, percentage;
        private LocalDateTime updatedAt;
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
        public Double getAssignmentMarks() { return assignmentMarks; }
        public void setAssignmentMarks(Double v) { this.assignmentMarks = v; }
        public Double getMidtermMarks() { return midtermMarks; }
        public void setMidtermMarks(Double v) { this.midtermMarks = v; }
        public Double getFinalMarks() { return finalMarks; }
        public void setFinalMarks(Double v) { this.finalMarks = v; }
        public Double getTotalMarks() { return totalMarks; }
        public void setTotalMarks(Double v) { this.totalMarks = v; }
        public Double getPercentage() { return percentage; }
        public void setPercentage(Double v) { this.percentage = v; }
        public String getGrade() { return grade; }
        public void setGrade(String v) { this.grade = v; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }
    }
}
