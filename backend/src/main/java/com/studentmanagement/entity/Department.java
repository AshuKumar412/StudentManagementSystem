package com.studentmanagement.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "department_code", nullable = false, unique = true)
    private String departmentCode;
    @Column(name = "department_name", nullable = false)
    private String departmentName;
    @Column(columnDefinition = "TEXT")
    private String description;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Department() {}
    public static DeptBuilder builder() { return new DeptBuilder(); }

    public Long getId() { return id; }
    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String v) { this.departmentCode = v; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String v) { this.departmentName = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static class DeptBuilder {
        private String departmentCode, departmentName, description;
        public DeptBuilder departmentCode(String v) { this.departmentCode = v; return this; }
        public DeptBuilder departmentName(String v) { this.departmentName = v; return this; }
        public DeptBuilder description(String v) { this.description = v; return this; }
        public Department build() {
            Department d = new Department();
            d.departmentCode = departmentCode; d.departmentName = departmentName; d.description = description;
            return d;
        }
    }
}
