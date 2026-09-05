package com.studentmanagement.dto;

import java.time.LocalDateTime;

public class TeacherDto {

    public static class Request {
        private String teacherId, name, email, phone, password;
        private Long departmentId;
        public String getTeacherId() { return teacherId; }
        public void setTeacherId(String v) { this.teacherId = v; }
        public String getName() { return name; }
        public void setName(String v) { this.name = v; }
        public String getEmail() { return email; }
        public void setEmail(String v) { this.email = v; }
        public String getPhone() { return phone; }
        public void setPhone(String v) { this.phone = v; }
        public String getPassword() { return password; }
        public void setPassword(String v) { this.password = v; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long v) { this.departmentId = v; }
    }

    public static class Response {
        private Long id, departmentId, userId;
        private String teacherId, name, email, phone, departmentName;
        private LocalDateTime createdAt, updatedAt;
        public Long getId() { return id; }
        public void setId(Long v) { this.id = v; }
        public String getTeacherId() { return teacherId; }
        public void setTeacherId(String v) { this.teacherId = v; }
        public String getName() { return name; }
        public void setName(String v) { this.name = v; }
        public String getEmail() { return email; }
        public void setEmail(String v) { this.email = v; }
        public String getPhone() { return phone; }
        public void setPhone(String v) { this.phone = v; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long v) { this.departmentId = v; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String v) { this.departmentName = v; }
        public Long getUserId() { return userId; }
        public void setUserId(Long v) { this.userId = v; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }
    }
}
