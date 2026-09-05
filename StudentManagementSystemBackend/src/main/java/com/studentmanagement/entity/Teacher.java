package com.studentmanagement.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "teachers")
public class Teacher {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "teacher_id", nullable = false, unique = true)
    private String teacherId;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, unique = true)
    private String email;
    private String phone;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "department_id")
    private Department department;
    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id")
    private User user;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Teacher() {}
    public static TeacherBuilder builder() { return new TeacherBuilder(); }

    public Long getId() { return id; }
    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String v) { this.teacherId = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department v) { this.department = v; }
    public User getUser() { return user; }
    public void setUser(User v) { this.user = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static class TeacherBuilder {
        private String teacherId, name, email, phone;
        private Department department; private User user;
        public TeacherBuilder teacherId(String v) { this.teacherId = v; return this; }
        public TeacherBuilder name(String v) { this.name = v; return this; }
        public TeacherBuilder email(String v) { this.email = v; return this; }
        public TeacherBuilder phone(String v) { this.phone = v; return this; }
        public TeacherBuilder department(Department v) { this.department = v; return this; }
        public TeacherBuilder user(User v) { this.user = v; return this; }
        public Teacher build() {
            Teacher t = new Teacher(); t.teacherId = teacherId; t.name = name;
            t.email = email; t.phone = phone; t.department = department; t.user = user; return t;
        }
    }
}
