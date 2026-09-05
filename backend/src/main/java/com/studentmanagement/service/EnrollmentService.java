package com.studentmanagement.service;

import com.studentmanagement.dto.EnrollmentDto;
import com.studentmanagement.entity.*;
import com.studentmanagement.exception.*;
import com.studentmanagement.repository.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, StudentRepository studentRepository,
                             CourseRepository courseRepository, SimpMessagingTemplate messagingTemplate) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<EnrollmentDto.Response> getAll() {
        return enrollmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<EnrollmentDto.Response> getByStudentId(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId).stream().map(this::toResponse).toList();
    }

    public List<EnrollmentDto.Response> getByCourseId(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public EnrollmentDto.Response create(EnrollmentDto.Request request) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(request.getStudentId(), request.getCourseId())) {
            throw new DuplicateResourceException("Student is already enrolled in this course");
        }

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enrollmentDate(request.getEnrollmentDate() != null ? request.getEnrollmentDate() : LocalDate.now())
                .status(request.getStatus() != null ? request.getStatus() : Enrollment.Status.ENROLLED)
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);

        // Broadcast enrollment update via WebSocket
        messagingTemplate.convertAndSend("/topic/enrollments", toResponse(saved));

        return toResponse(saved);
    }

    @Transactional
    public EnrollmentDto.Response update(Long id, EnrollmentDto.Request request) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", id));

        if (request.getEnrollmentDate() != null) {
            enrollment.setEnrollmentDate(request.getEnrollmentDate());
        }
        if (request.getStatus() != null) {
            enrollment.setStatus(request.getStatus());
        }

        Enrollment updated = enrollmentRepository.save(enrollment);
        messagingTemplate.convertAndSend("/topic/enrollments", toResponse(updated));
        return toResponse(updated);
    }

    @Transactional
    public void delete(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", id));
        enrollmentRepository.delete(enrollment);
    }

    public EnrollmentDto.Response toResponse(Enrollment e) {
        EnrollmentDto.Response r = new EnrollmentDto.Response();
        r.setId(e.getId());
        r.setStudentId(e.getStudent().getId());
        r.setStudentName(e.getStudent().getFirstName() + " " + e.getStudent().getLastName());
        r.setStudentStudentId(e.getStudent().getStudentId());
        r.setCourseId(e.getCourse().getId());
        r.setCourseName(e.getCourse().getCourseName());
        r.setCourseCode(e.getCourse().getCourseCode());
        r.setEnrollmentDate(e.getEnrollmentDate());
        r.setStatus(e.getStatus());
        r.setCreatedAt(e.getCreatedAt());
        return r;
    }
}
