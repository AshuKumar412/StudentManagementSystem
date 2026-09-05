package com.studentmanagement.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "marks",
    uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
public class Marks {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    @Column(name = "assignment_marks") private Double assignmentMarks;
    @Column(name = "midterm_marks") private Double midtermMarks;
    @Column(name = "final_marks") private Double finalMarks;
    @Column(name = "total_marks") private Double totalMarks;
    private Double percentage;
    private String grade;
    @UpdateTimestamp @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Marks() {}
    public static MarksBuilder builder() { return new MarksBuilder(); }

    @PrePersist @PreUpdate
    public void calculateGrade() {
        if (assignmentMarks != null && midtermMarks != null && finalMarks != null) {
            this.totalMarks = assignmentMarks + midtermMarks + finalMarks;
            this.percentage = (totalMarks / 150.0) * 100;
            if (percentage >= 90) grade = "A+";
            else if (percentage >= 80) grade = "A";
            else if (percentage >= 70) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 50) grade = "D";
            else grade = "F";
        }
    }

    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public void setStudent(Student v) { this.student = v; }
    public Course getCourse() { return course; }
    public void setCourse(Course v) { this.course = v; }
    public Double getAssignmentMarks() { return assignmentMarks; }
    public void setAssignmentMarks(Double v) { this.assignmentMarks = v; }
    public Double getMidtermMarks() { return midtermMarks; }
    public void setMidtermMarks(Double v) { this.midtermMarks = v; }
    public Double getFinalMarks() { return finalMarks; }
    public void setFinalMarks(Double v) { this.finalMarks = v; }
    public Double getTotalMarks() { return totalMarks; }
    public Double getPercentage() { return percentage; }
    public String getGrade() { return grade; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static class MarksBuilder {
        private Student student; private Course course;
        private Double assignmentMarks, midtermMarks, finalMarks;
        public MarksBuilder student(Student v) { this.student = v; return this; }
        public MarksBuilder course(Course v) { this.course = v; return this; }
        public MarksBuilder assignmentMarks(Double v) { this.assignmentMarks = v; return this; }
        public MarksBuilder midtermMarks(Double v) { this.midtermMarks = v; return this; }
        public MarksBuilder finalMarks(Double v) { this.finalMarks = v; return this; }
        public Marks build() {
            Marks m = new Marks(); m.student = student; m.course = course;
            m.assignmentMarks = assignmentMarks; m.midtermMarks = midtermMarks; m.finalMarks = finalMarks;
            return m;
        }
    }
}
