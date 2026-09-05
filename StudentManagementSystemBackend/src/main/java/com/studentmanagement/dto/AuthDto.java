package com.studentmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AuthDto {

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String v) { this.email = v; }
        public String getPassword() { return password; }
        public void setPassword(String v) { this.password = v; }
    }

    public static class StudentRegisterRequest {
        @NotBlank(message = "First name is required")
        private String firstName;

        private String lastName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        private String phone;
        private LocalDate dateOfBirth;
        private String gender;
        private String address;
        private Long departmentId;
        private Integer semester = 1;
        private String studentId;

        private String profilePicture;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public LocalDate getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
        public Integer getSemester() { return semester; }
        public void setSemester(Integer semester) { this.semester = semester; }
        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }
        public String getProfilePicture() { return profilePicture; }
        public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class FacultyRegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        private String phone;
        private Long departmentId;
        private String qualification;
        private String gender;
        private String facultyId;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
        public String getQualification() { return qualification; }
        public void setQualification(String qualification) { this.qualification = qualification; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public String getFacultyId() { return facultyId; }
        public void setFacultyId(String facultyId) { this.facultyId = facultyId; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String role; // STUDENT, FACULTY, TEACHER
        private String phone;
        private Long departmentId;
        private String identifier;
        private Integer semester;
        private String gender;
        private String address;

        public String getName() { return name; }
        public void setName(String v) { this.name = v; }
        public String getEmail() { return email; }
        public void setEmail(String v) { this.email = v; }
        public String getPassword() { return password; }
        public void setPassword(String v) { this.password = v; }
        public String getRole() { return role; }
        public void setRole(String v) { this.role = v; }
        public String getPhone() { return phone; }
        public void setPhone(String v) { this.phone = v; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long v) { this.departmentId = v; }
        public String getIdentifier() { return identifier; }
        public void setIdentifier(String v) { this.identifier = v; }
        public Integer getSemester() { return semester; }
        public void setSemester(Integer v) { this.semester = v; }
        public String getGender() { return gender; }
        public void setGender(String v) { this.gender = v; }
        public String getAddress() { return address; }
        public void setAddress(String v) { this.address = v; }
    }

    public static class LoginResponse {
        private String token;
        private String role;
        private String accountStatus;
        private UserInfo user;

        public String getToken() { return token; }
        public void setToken(String v) { this.token = v; }
        public String getRole() { return role; }
        public void setRole(String v) { this.role = v; }
        public String getAccountStatus() { return accountStatus; }
        public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
        public UserInfo getUser() { return user; }
        public void setUser(UserInfo v) { this.user = v; }

        public static class UserInfo {
            private Long id;
            private String name;
            private String email;
            private String role;
            private String accountStatus;

            public Long getId() { return id; }
            public void setId(Long v) { this.id = v; }
            public String getName() { return name; }
            public void setName(String v) { this.name = v; }
            public String getEmail() { return email; }
            public void setEmail(String v) { this.email = v; }
            public String getRole() { return role; }
            public void setRole(String role) { this.role = role; }
            public String getAccountStatus() { return accountStatus; }
            public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
        }
    }

    public static class RegistrationApprovalRequest {
        private String rejectionReason;
        public String getRejectionReason() { return rejectionReason; }
        public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    }

    public static class RegistrationItemDto {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String role;
        private String department;
        private Long departmentId;
        private String status;
        private String rejectionReason;
        private LocalDateTime registrationDate;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getRejectionReason() { return rejectionReason; }
        public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
        public LocalDateTime getRegistrationDate() { return registrationDate; }
        public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
    }
}

