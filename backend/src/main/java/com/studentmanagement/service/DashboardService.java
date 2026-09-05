package com.studentmanagement.service;

import com.studentmanagement.dto.*;
import com.studentmanagement.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeeRepository feeRepository;
    private final MarksRepository marksRepository;

    public DashboardService(StudentRepository studentRepository, TeacherRepository teacherRepository,
                            CourseRepository courseRepository, DepartmentRepository departmentRepository,
                            EnrollmentRepository enrollmentRepository, AttendanceRepository attendanceRepository,
                            FeeRepository feeRepository, MarksRepository marksRepository) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.courseRepository = courseRepository;
        this.departmentRepository = departmentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.feeRepository = feeRepository;
        this.marksRepository = marksRepository;
    }

    public DashboardDto.AdminDashboard getAdminDashboard() {
        DashboardDto.AdminDashboard dashboard = new DashboardDto.AdminDashboard();
        dashboard.setTotalStudents(studentRepository.count());
        dashboard.setTotalTeachers(teacherRepository.count());
        dashboard.setTotalCourses(courseRepository.count());
        dashboard.setTotalDepartments(departmentRepository.count());
        dashboard.setTotalEnrollments(enrollmentRepository.count());
        dashboard.setPresentToday(attendanceRepository.countPresentToday());
        dashboard.setPendingFees(feeRepository.sumPendingFees());
        dashboard.setCollectedFees(feeRepository.sumCollectedFees());

        // Students by department
        List<Map<String, Object>> byDept = departmentRepository.findAll().stream().map(dept -> {
            Map<String, Object> m = new HashMap<>();
            m.put("department", dept.getDepartmentName());
            m.put("count", studentRepository.findAll().stream()
                    .filter(s -> s.getDepartment() != null && s.getDepartment().getId().equals(dept.getId()))
                    .count());
            return m;
        }).toList();
        dashboard.setStudentsByDepartment(byDept);

        // Course enrollments
        List<Map<String, Object>> courseEnroll = courseRepository.findAll().stream().map(c -> {
            Map<String, Object> m = new HashMap<>();
            m.put("course", c.getCourseName());
            m.put("count", enrollmentRepository.countByCourseId(c.getId()));
            return m;
        }).toList();
        dashboard.setCourseEnrollments(courseEnroll);

        // Grade distribution
        Map<String, Long> gradeCount = new HashMap<>();
        marksRepository.findAll().forEach(m -> {
            String grade = m.getGrade() != null ? m.getGrade() : "N/A";
            gradeCount.merge(grade, 1L, Long::sum);
        });
        List<Map<String, Object>> gradeDist = gradeCount.entrySet().stream().map(e -> {
            Map<String, Object> m = new HashMap<>();
            m.put("grade", e.getKey());
            m.put("count", e.getValue());
            return m;
        }).toList();
        dashboard.setGradeDistribution(gradeDist);

        return dashboard;
    }

    public DashboardDto.TeacherDashboard getTeacherDashboard(String email) {
        var teacherOpt = teacherRepository.findAll().stream()
                .filter(t -> t.getUser() != null && t.getUser().getEmail().equalsIgnoreCase(email))
                .findFirst();

        DashboardDto.TeacherDashboard dashboard = new DashboardDto.TeacherDashboard();
        dashboard.setPresentToday(attendanceRepository.countPresentToday());

        if (teacherOpt.isPresent()) {
            var teacher = teacherOpt.get();
            var courses = courseRepository.findByTeacherId(teacher.getId());
            dashboard.setAssignedCourses(courses.size());
            dashboard.setTotalStudents(enrollmentRepository.countByTeacherId(teacher.getId()));
        } else {
            dashboard.setAssignedCourses(0);
            dashboard.setTotalStudents(0);
        }

        return dashboard;
    }

    public DashboardDto.StudentDashboard getStudentDashboard(String email) {
        var studentOpt = studentRepository.findAll().stream()
                .filter(s -> s.getUser() != null && s.getUser().getEmail().equalsIgnoreCase(email))
                .findFirst();

        DashboardDto.StudentDashboard dashboard = new DashboardDto.StudentDashboard();
        dashboard.setPendingFees(feeRepository.sumPendingFees());

        if (studentOpt.isPresent()) {
            var student = studentOpt.get();
            dashboard.setEnrolledCourses(enrollmentRepository.countByStudentId(student.getId()));
        } else {
            dashboard.setEnrolledCourses(0);
        }

        return dashboard;
    }
}
