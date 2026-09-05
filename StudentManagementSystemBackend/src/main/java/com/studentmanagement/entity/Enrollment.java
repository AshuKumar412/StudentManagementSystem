package com.studentmanagement.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
public class Enrollment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;
    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Status { ENROLLED, ACTIVE, COMPLETED, DROPPED }

    public Enrollment() {}
    public static EnrollmentBuilder builder() { return new EnrollmentBuilder(); }

    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public void setStudent(Student v) { this.student = v; }
    public Course getCourse() { return course; }
    public void setCourse(Course v) { this.course = v; }
    public LocalDate getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(LocalDate v) { this.enrollmentDate = v; }
    public Status getStatus() { return status; }
    public void setStatus(Status v) { this.status = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static class EnrollmentBuilder {
        private Student student; private Course course;
        private LocalDate enrollmentDate; private Status status = Status.ACTIVE;
        public EnrollmentBuilder student(Student v) { this.student = v; return this; }
        public EnrollmentBuilder course(Course v) { this.course = v; return this; }
        public EnrollmentBuilder enrollmentDate(LocalDate v) { this.enrollmentDate = v; return this; }
        public EnrollmentBuilder status(Status v) { this.status = v; return this; }
        public Enrollment build() {
            Enrollment e = new Enrollment(); e.student = student; e.course = course;
            e.enrollmentDate = enrollmentDate; e.status = status; return e;
        }
    }
}
