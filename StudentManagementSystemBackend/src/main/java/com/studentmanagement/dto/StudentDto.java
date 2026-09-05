package com.studentmanagement.dto;

import com.studentmanagement.entity.Student;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class StudentDto {

    public static class Request {
        private String studentId, firstName, lastName, email, phone, gender, address, password, profilePicture;
        private LocalDate dateOfBirth, admissionDate;
        private Long departmentId;
        private Integer semester;
        private Student.Status status;

        public String getStudentId() { return studentId; }
        public void setStudentId(String v) { this.studentId = v; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String v) { this.firstName = v; }
        public String getLastName() { return lastName; }
        public void setLastName(String v) { this.lastName = v; }
        public String getEmail() { return email; }
        public void setEmail(String v) { this.email = v; }
        public String getPhone() { return phone; }
        public void setPhone(String v) { this.phone = v; }
        public String getGender() { return gender; }
        public void setGender(String v) { this.gender = v; }
        public String getAddress() { return address; }
        public void setAddress(String v) { this.address = v; }
        public String getPassword() { return password; }
        public void setPassword(String v) { this.password = v; }
        public String getProfilePicture() { return profilePicture; }
        public void setProfilePicture(String v) { this.profilePicture = v; }
        public LocalDate getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(LocalDate v) { this.dateOfBirth = v; }
        public LocalDate getAdmissionDate() { return admissionDate; }
        public void setAdmissionDate(LocalDate v) { this.admissionDate = v; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long v) { this.departmentId = v; }
        public Integer getSemester() { return semester; }
        public void setSemester(Integer v) { this.semester = v; }
        public Student.Status getStatus() { return status; }
        public void setStatus(Student.Status v) { this.status = v; }
    }

    public static class Response {
        private Long id, departmentId, userId;
        private String studentId, firstName, lastName, email, phone, gender, address, departmentName, profilePicture;
        private LocalDate dateOfBirth, admissionDate;
        private Integer semester;
        private Student.Status status;
        private LocalDateTime createdAt, updatedAt;

        public Long getId() { return id; }
        public void setId(Long v) { this.id = v; }
        public String getStudentId() { return studentId; }
        public void setStudentId(String v) { this.studentId = v; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String v) { this.firstName = v; }
        public String getLastName() { return lastName; }
        public void setLastName(String v) { this.lastName = v; }
        public String getEmail() { return email; }
        public void setEmail(String v) { this.email = v; }
        public String getPhone() { return phone; }
        public void setPhone(String v) { this.phone = v; }
        public String getGender() { return gender; }
        public void setGender(String v) { this.gender = v; }
        public String getAddress() { return address; }
        public void setAddress(String v) { this.address = v; }
        public String getProfilePicture() { return profilePicture; }
        public void setProfilePicture(String v) { this.profilePicture = v; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long v) { this.departmentId = v; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String v) { this.departmentName = v; }
        public LocalDate getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(LocalDate v) { this.dateOfBirth = v; }
        public LocalDate getAdmissionDate() { return admissionDate; }
        public void setAdmissionDate(LocalDate v) { this.admissionDate = v; }
        public Integer getSemester() { return semester; }
        public void setSemester(Integer v) { this.semester = v; }
        public Student.Status getStatus() { return status; }
        public void setStatus(Student.Status v) { this.status = v; }
        public Long getUserId() { return userId; }
        public void setUserId(Long v) { this.userId = v; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }
    }
}
