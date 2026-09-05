package com.studentmanagement.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "student_id", nullable = false, unique = true)
    private String studentId;
    @Column(name = "first_name", nullable = false)
    private String firstName;
    @Column(name = "last_name", nullable = false)
    private String lastName;
    @Column(nullable = false, unique = true)
    private String email;
    private String phone;
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    private String gender;
    @Column(columnDefinition = "TEXT")
    private String address;
    @Column(name = "profile_picture")
    private String profilePicture;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
    @Column(name = "admission_date")
    private LocalDate admissionDate;
    private Integer semester;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Status { ACTIVE, INACTIVE, GRADUATED }

    public Student() {}
    public static StudentBuilder builder() { return new StudentBuilder(); }

    public Long getId() { return id; }
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
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate v) { this.dateOfBirth = v; }
    public String getGender() { return gender; }
    public void setGender(String v) { this.gender = v; }
    public String getAddress() { return address; }
    public void setAddress(String v) { this.address = v; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String v) { this.profilePicture = v; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department v) { this.department = v; }
    public LocalDate getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(LocalDate v) { this.admissionDate = v; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer v) { this.semester = v; }
    public Status getStatus() { return status; }
    public void setStatus(Status v) { this.status = v; }
    public User getUser() { return user; }
    public void setUser(User v) { this.user = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static class StudentBuilder {
        private String studentId, firstName, lastName, email, phone, gender, address, profilePicture;
        private LocalDate dateOfBirth, admissionDate;
        private Department department;
        private Integer semester;
        private Status status = Status.ACTIVE;
        private User user;
        public StudentBuilder studentId(String v) { this.studentId = v; return this; }
        public StudentBuilder firstName(String v) { this.firstName = v; return this; }
        public StudentBuilder lastName(String v) { this.lastName = v; return this; }
        public StudentBuilder email(String v) { this.email = v; return this; }
        public StudentBuilder phone(String v) { this.phone = v; return this; }
        public StudentBuilder gender(String v) { this.gender = v; return this; }
        public StudentBuilder address(String v) { this.address = v; return this; }
        public StudentBuilder profilePicture(String v) { this.profilePicture = v; return this; }
        public StudentBuilder dateOfBirth(LocalDate v) { this.dateOfBirth = v; return this; }
        public StudentBuilder admissionDate(LocalDate v) { this.admissionDate = v; return this; }
        public StudentBuilder department(Department v) { this.department = v; return this; }
        public StudentBuilder semester(Integer v) { this.semester = v; return this; }
        public StudentBuilder status(Status v) { this.status = v; return this; }
        public StudentBuilder user(User v) { this.user = v; return this; }
        public Student build() {
            Student s = new Student();
            s.studentId = studentId; s.firstName = firstName; s.lastName = lastName;
            s.email = email; s.phone = phone; s.gender = gender; s.address = address;
            s.profilePicture = profilePicture;
            s.dateOfBirth = dateOfBirth; s.admissionDate = admissionDate;
            s.department = department; s.semester = semester; s.status = status; s.user = user;
            return s;
        }
    }
}
