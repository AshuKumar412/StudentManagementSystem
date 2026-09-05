package com.studentmanagement.dto;

import com.studentmanagement.entity.Attendance;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AttendanceDto {

    public static class Request {
        private Long studentId, courseId;
        private LocalDate date;
        private Attendance.Status status;
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long v) { this.studentId = v; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long v) { this.courseId = v; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate v) { this.date = v; }
        public Attendance.Status getStatus() { return status; }
        public void setStatus(Attendance.Status v) { this.status = v; }
    }

    public static class BulkRequest {
        private Long courseId;
        private LocalDate date;
        private List<AttendanceEntry> attendanceList;
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long v) { this.courseId = v; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate v) { this.date = v; }
        public List<AttendanceEntry> getAttendanceList() { return attendanceList; }
        public void setAttendanceList(List<AttendanceEntry> v) { this.attendanceList = v; }

        public static class AttendanceEntry {
            private Long studentId;
            private Attendance.Status status;
            public Long getStudentId() { return studentId; }
            public void setStudentId(Long v) { this.studentId = v; }
            public Attendance.Status getStatus() { return status; }
            public void setStatus(Attendance.Status v) { this.status = v; }
        }
    }

    public static class Response {
        private Long id, studentId, courseId;
        private String studentName, studentStudentId, courseName;
        private LocalDate date;
        private Attendance.Status status;
        private LocalDateTime createdAt;
        public Long getId() { return id; }
        public void setId(Long v) { this.id = v; }
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long v) { this.studentId = v; }
        public String getStudentName() { return studentName; }
        public void setStudentName(String v) { this.studentName = v; }
        public String getStudentStudentId() { return studentStudentId; }
        public void setStudentStudentId(String v) { this.studentStudentId = v; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long v) { this.courseId = v; }
        public String getCourseName() { return courseName; }
        public void setCourseName(String v) { this.courseName = v; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate v) { this.date = v; }
        public Attendance.Status getStatus() { return status; }
        public void setStatus(Attendance.Status v) { this.status = v; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
    }

    public static class StudentAttendanceSummary {
        private Long courseId;
        private String courseName;
        private long totalClasses, presentCount;
        private double percentage;
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long v) { this.courseId = v; }
        public String getCourseName() { return courseName; }
        public void setCourseName(String v) { this.courseName = v; }
        public long getTotalClasses() { return totalClasses; }
        public void setTotalClasses(long v) { this.totalClasses = v; }
        public long getPresentCount() { return presentCount; }
        public void setPresentCount(long v) { this.presentCount = v; }
        public double getPercentage() { return percentage; }
        public void setPercentage(double v) { this.percentage = v; }
    }
}
