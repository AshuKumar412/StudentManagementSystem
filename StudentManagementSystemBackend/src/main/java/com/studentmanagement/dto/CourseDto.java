package com.studentmanagement.dto;

import java.time.LocalDateTime;

public class CourseDto {

    public static class Request {
        private String courseCode, courseName, description;
        private Integer credits, semester;
        private Long departmentId, teacherId;
        public String getCourseCode() { return courseCode; }
        public void setCourseCode(String v) { this.courseCode = v; }
        public String getCourseName() { return courseName; }
        public void setCourseName(String v) { this.courseName = v; }
        public String getDescription() { return description; }
        public void setDescription(String v) { this.description = v; }
        public Integer getCredits() { return credits; }
        public void setCredits(Integer v) { this.credits = v; }
        public Integer getSemester() { return semester; }
        public void setSemester(Integer v) { this.semester = v; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long v) { this.departmentId = v; }
        public Long getTeacherId() { return teacherId; }
        public void setTeacherId(Long v) { this.teacherId = v; }
    }

    public static class Response {
        private Long id, departmentId, teacherId;
        private String courseCode, courseName, description, departmentName, teacherName;
        private Integer credits, semester;
        private long enrollmentCount;
        private LocalDateTime createdAt, updatedAt;
        public Long getId() { return id; }
        public void setId(Long v) { this.id = v; }
        public String getCourseCode() { return courseCode; }
        public void setCourseCode(String v) { this.courseCode = v; }
        public String getCourseName() { return courseName; }
        public void setCourseName(String v) { this.courseName = v; }
        public String getDescription() { return description; }
        public void setDescription(String v) { this.description = v; }
        public Integer getCredits() { return credits; }
        public void setCredits(Integer v) { this.credits = v; }
        public Integer getSemester() { return semester; }
        public void setSemester(Integer v) { this.semester = v; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long v) { this.departmentId = v; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String v) { this.departmentName = v; }
        public Long getTeacherId() { return teacherId; }
        public void setTeacherId(Long v) { this.teacherId = v; }
        public String getTeacherName() { return teacherName; }
        public void setTeacherName(String v) { this.teacherName = v; }
        public long getEnrollmentCount() { return enrollmentCount; }
        public void setEnrollmentCount(long v) { this.enrollmentCount = v; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }
    }
}
