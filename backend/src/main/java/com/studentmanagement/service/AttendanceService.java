package com.studentmanagement.service;

import com.studentmanagement.dto.AttendanceDto;
import com.studentmanagement.entity.*;
import com.studentmanagement.exception.*;
import com.studentmanagement.repository.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository,
                             CourseRepository courseRepository, UserRepository userRepository,
                             EnrollmentRepository enrollmentRepository, SimpMessagingTemplate messagingTemplate) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<AttendanceDto.Response> getByCourseAndDate(Long courseId, LocalDate date) {
        return attendanceRepository.findByCourseAndDate(courseId, date)
                .stream().map(this::toResponse).toList();
    }

    public List<AttendanceDto.Response> getByStudentAndCourse(Long studentId, Long courseId) {
        return attendanceRepository.findByStudentIdAndCourseId(studentId, courseId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public List<AttendanceDto.Response> markBulk(AttendanceDto.BulkRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> markedByOpt = userRepository.findByEmail(email);
        User markedBy = markedByOpt.orElse(null);

        List<AttendanceDto.Response> results = new ArrayList<>();

        for (AttendanceDto.BulkRequest.AttendanceEntry entry : request.getAttendanceList()) {
            Student student = studentRepository.findById(entry.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student", "id", entry.getStudentId()));

            if (!enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
                throw new BadRequestException("Student " + student.getStudentId() + " is not enrolled in this course");
            }

            Optional<Attendance> existingOpt = attendanceRepository
                    .findByStudentIdAndCourseIdAndDate(student.getId(), course.getId(), request.getDate());

            Attendance attendance;
            if (existingOpt.isPresent()) {
                attendance = existingOpt.get();
            } else {
                attendance = new Attendance();
                attendance.setStudent(student);
                attendance.setCourse(course);
                attendance.setDate(request.getDate());
            }
            attendance.setStatus(entry.getStatus());
            attendance.setMarkedBy(markedBy);
            Attendance saved = attendanceRepository.save(attendance);
            results.add(toResponse(saved));
        }

        messagingTemplate.convertAndSend("/topic/attendance/" + request.getCourseId(), results);
        return results;
    }

    @Transactional
    public AttendanceDto.Response update(Long id, AttendanceDto.Request request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance", "id", id));
        attendance.setStatus(request.getStatus());
        return toResponse(attendanceRepository.save(attendance));
    }

    public List<AttendanceDto.StudentAttendanceSummary> getStudentSummary(Long studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findActiveByStudentId(studentId);
        List<AttendanceDto.StudentAttendanceSummary> summaries = new ArrayList<>();
        for (Enrollment e : enrollments) {
            AttendanceDto.StudentAttendanceSummary s = new AttendanceDto.StudentAttendanceSummary();
            s.setCourseId(e.getCourse().getId());
            s.setCourseName(e.getCourse().getCourseName());
            long total = attendanceRepository.countTotalByStudentAndCourse(studentId, e.getCourse().getId());
            long present = attendanceRepository.countPresentByStudentAndCourse(studentId, e.getCourse().getId());
            s.setTotalClasses(total);
            s.setPresentCount(present);
            s.setPercentage(total > 0 ? (double) present / total * 100 : 0.0);
            summaries.add(s);
        }
        return summaries;
    }

    private AttendanceDto.Response toResponse(Attendance a) {
        AttendanceDto.Response r = new AttendanceDto.Response();
        r.setId(a.getId());
        r.setStudentId(a.getStudent().getId());
        r.setStudentName(a.getStudent().getFirstName() + " " + a.getStudent().getLastName());
        r.setStudentStudentId(a.getStudent().getStudentId());
        r.setCourseId(a.getCourse().getId());
        r.setCourseName(a.getCourse().getCourseName());
        r.setDate(a.getDate());
        r.setStatus(a.getStatus());
        r.setCreatedAt(a.getCreatedAt());
        return r;
    }
}
