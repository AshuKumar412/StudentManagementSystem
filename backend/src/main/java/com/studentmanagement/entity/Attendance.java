package com.studentmanagement.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id", "date"}))
public class Attendance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    @Column(nullable = false)
    private LocalDate date;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Status status;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "marked_by")
    private User markedBy;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Status { PRESENT, ABSENT }

    public Attendance() {}

    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public void setStudent(Student v) { this.student = v; }
    public Course getCourse() { return course; }
    public void setCourse(Course v) { this.course = v; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate v) { this.date = v; }
    public Status getStatus() { return status; }
    public void setStatus(Status v) { this.status = v; }
    public User getMarkedBy() { return markedBy; }
    public void setMarkedBy(User v) { this.markedBy = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
