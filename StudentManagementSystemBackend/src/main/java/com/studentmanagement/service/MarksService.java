package com.studentmanagement.service;

import com.studentmanagement.dto.MarksDto;
import com.studentmanagement.entity.*;
import com.studentmanagement.exception.*;
import com.studentmanagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MarksService {

    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public MarksService(MarksRepository marksRepository, StudentRepository studentRepository,
                        CourseRepository courseRepository, EnrollmentRepository enrollmentRepository) {
        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<MarksDto.Response> getAll() {
        return marksRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<MarksDto.Response> getByStudentId(Long studentId) {
        return marksRepository.findByStudentId(studentId).stream().map(this::toResponse).toList();
    }

    public List<MarksDto.Response> getByCourseId(Long courseId) {
        return marksRepository.findByCourseId(courseId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public MarksDto.Response create(MarksDto.Request request) {
        if (marksRepository.existsByStudentIdAndCourseId(request.getStudentId(), request.getCourseId())) {
            throw new DuplicateResourceException("Marks already exist for this student and course. Use update instead.");
        }

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

        if (!enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
            throw new BadRequestException("Student is not enrolled in this course");
        }

        Marks marks = Marks.builder()
                .student(student)
                .course(course)
                .assignmentMarks(request.getAssignmentMarks())
                .midtermMarks(request.getMidtermMarks())
                .finalMarks(request.getFinalMarks())
                .build();
        // @PrePersist will calculate total, percentage, grade
        return toResponse(marksRepository.save(marks));
    }

    @Transactional
    public MarksDto.Response update(Long id, MarksDto.Request request) {
        Marks marks = marksRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marks", "id", id));
        marks.setAssignmentMarks(request.getAssignmentMarks());
        marks.setMidtermMarks(request.getMidtermMarks());
        marks.setFinalMarks(request.getFinalMarks());
        // @PreUpdate will recalculate
        return toResponse(marksRepository.save(marks));
    }

    private MarksDto.Response toResponse(Marks m) {
        MarksDto.Response r = new MarksDto.Response();
        r.setId(m.getId());
        r.setStudentId(m.getStudent().getId());
        r.setStudentName(m.getStudent().getFirstName() + " " + m.getStudent().getLastName());
        r.setStudentStudentId(m.getStudent().getStudentId());
        r.setCourseId(m.getCourse().getId());
        r.setCourseName(m.getCourse().getCourseName());
        r.setAssignmentMarks(m.getAssignmentMarks());
        r.setMidtermMarks(m.getMidtermMarks());
        r.setFinalMarks(m.getFinalMarks());
        r.setTotalMarks(m.getTotalMarks());
        r.setPercentage(m.getPercentage());
        r.setGrade(m.getGrade());
        r.setUpdatedAt(m.getUpdatedAt());
        return r;
    }
}
