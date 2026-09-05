package com.studentmanagement.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardDto {

    public static class AdminDashboard {
        private long totalStudents, totalTeachers, totalCourses, totalDepartments, totalEnrollments, presentToday;
        private BigDecimal pendingFees, collectedFees;
        private List<Map<String, Object>> studentsByDepartment, courseEnrollments, gradeDistribution;

        public long getTotalStudents() { return totalStudents; }
        public void setTotalStudents(long v) { this.totalStudents = v; }
        public long getTotalTeachers() { return totalTeachers; }
        public void setTotalTeachers(long v) { this.totalTeachers = v; }
        public long getTotalCourses() { return totalCourses; }
        public void setTotalCourses(long v) { this.totalCourses = v; }
        public long getTotalDepartments() { return totalDepartments; }
        public void setTotalDepartments(long v) { this.totalDepartments = v; }
        public long getTotalEnrollments() { return totalEnrollments; }
        public void setTotalEnrollments(long v) { this.totalEnrollments = v; }
        public long getPresentToday() { return presentToday; }
        public void setPresentToday(long v) { this.presentToday = v; }
        public BigDecimal getPendingFees() { return pendingFees; }
        public void setPendingFees(BigDecimal v) { this.pendingFees = v; }
        public BigDecimal getCollectedFees() { return collectedFees; }
        public void setCollectedFees(BigDecimal v) { this.collectedFees = v; }
        public List<Map<String, Object>> getStudentsByDepartment() { return studentsByDepartment; }
        public void setStudentsByDepartment(List<Map<String, Object>> v) { this.studentsByDepartment = v; }
        public List<Map<String, Object>> getCourseEnrollments() { return courseEnrollments; }
        public void setCourseEnrollments(List<Map<String, Object>> v) { this.courseEnrollments = v; }
        public List<Map<String, Object>> getGradeDistribution() { return gradeDistribution; }
        public void setGradeDistribution(List<Map<String, Object>> v) { this.gradeDistribution = v; }
    }

    public static class TeacherDashboard {
        private long assignedCourses, totalStudents, presentToday;
        private List<CourseDto.Response> courses;
        public long getAssignedCourses() { return assignedCourses; }
        public void setAssignedCourses(long v) { this.assignedCourses = v; }
        public long getTotalStudents() { return totalStudents; }
        public void setTotalStudents(long v) { this.totalStudents = v; }
        public long getPresentToday() { return presentToday; }
        public void setPresentToday(long v) { this.presentToday = v; }
        public List<CourseDto.Response> getCourses() { return courses; }
        public void setCourses(List<CourseDto.Response> v) { this.courses = v; }
    }

    public static class StudentDashboard {
        private long enrolledCourses;
        private double overallAttendance;
        private String currentGrade;
        private java.math.BigDecimal pendingFees;
        private List<EnrollmentDto.Response> enrollments;
        private List<AttendanceDto.StudentAttendanceSummary> attendanceSummary;
        private List<MarksDto.Response> marks;
        private List<FeeDto.Response> fees;
        public long getEnrolledCourses() { return enrolledCourses; }
        public void setEnrolledCourses(long v) { this.enrolledCourses = v; }
        public double getOverallAttendance() { return overallAttendance; }
        public void setOverallAttendance(double v) { this.overallAttendance = v; }
        public String getCurrentGrade() { return currentGrade; }
        public void setCurrentGrade(String v) { this.currentGrade = v; }
        public java.math.BigDecimal getPendingFees() { return pendingFees; }
        public void setPendingFees(java.math.BigDecimal v) { this.pendingFees = v; }
        public List<EnrollmentDto.Response> getEnrollments() { return enrollments; }
        public void setEnrollments(List<EnrollmentDto.Response> v) { this.enrollments = v; }
        public List<AttendanceDto.StudentAttendanceSummary> getAttendanceSummary() { return attendanceSummary; }
        public void setAttendanceSummary(List<AttendanceDto.StudentAttendanceSummary> v) { this.attendanceSummary = v; }
        public List<MarksDto.Response> getMarks() { return marks; }
        public void setMarks(List<MarksDto.Response> v) { this.marks = v; }
        public List<FeeDto.Response> getFees() { return fees; }
        public void setFees(List<FeeDto.Response> v) { this.fees = v; }
    }
}
