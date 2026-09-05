package com.studentmanagement.dto;

import java.time.LocalDateTime;

public class DepartmentDto {

    public static class Request {
        private String departmentCode, departmentName, description;
        public String getDepartmentCode() { return departmentCode; }
        public void setDepartmentCode(String v) { this.departmentCode = v; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String v) { this.departmentName = v; }
        public String getDescription() { return description; }
        public void setDescription(String v) { this.description = v; }
    }

    public static class Response {
        private Long id;
        private String departmentCode, departmentName, description;
        private LocalDateTime createdAt, updatedAt;
        public Long getId() { return id; }
        public void setId(Long v) { this.id = v; }
        public String getDepartmentCode() { return departmentCode; }
        public void setDepartmentCode(String v) { this.departmentCode = v; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String v) { this.departmentName = v; }
        public String getDescription() { return description; }
        public void setDescription(String v) { this.description = v; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }
    }
}
