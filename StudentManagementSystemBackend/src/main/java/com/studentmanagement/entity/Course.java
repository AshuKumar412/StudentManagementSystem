package com.studentmanagement.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "course_code", nullable = false, unique = true)
    private String courseCode;
    @Column(name = "course_name", nullable = false)
    private String courseName;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Integer credits;
    private Integer semester;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "department_id")
    private Department department;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "teacher_id")
    private Teacher teacher;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Course() {}
    public static CourseBuilder builder() { return new CourseBuilder(); }

    public Long getId() { return id; }
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String v) { this.courseCode = v; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String v) { this.courseName = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public Integer getCredits() { return credits; }
    public void setCredits(Integer v) { this.credits = v; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer v) { this.semester = v; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department v) { this.department = v; }
    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher v) { this.teacher = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static class CourseBuilder {
        private String courseCode, courseName, description;
        private Integer credits, semester;
        private Department department; private Teacher teacher;
        public CourseBuilder courseCode(String v) { this.courseCode = v; return this; }
        public CourseBuilder courseName(String v) { this.courseName = v; return this; }
        public CourseBuilder description(String v) { this.description = v; return this; }
        public CourseBuilder credits(Integer v) { this.credits = v; return this; }
        public CourseBuilder semester(Integer v) { this.semester = v; return this; }
        public CourseBuilder department(Department v) { this.department = v; return this; }
        public CourseBuilder teacher(Teacher v) { this.teacher = v; return this; }
        public Course build() {
            Course c = new Course(); c.courseCode = courseCode; c.courseName = courseName;
            c.description = description; c.credits = credits; c.semester = semester;
            c.department = department; c.teacher = teacher; return c;
        }
    }
}
