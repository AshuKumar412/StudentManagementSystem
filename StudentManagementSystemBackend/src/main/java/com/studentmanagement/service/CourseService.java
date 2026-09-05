package com.studentmanagement.service;

import com.studentmanagement.dto.CourseDto;
import com.studentmanagement.dto.PageResponse;
import com.studentmanagement.entity.*;
import com.studentmanagement.exception.*;
import com.studentmanagement.repository.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final TeacherRepository teacherRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseService(CourseRepository courseRepository, DepartmentRepository departmentRepository,
                         TeacherRepository teacherRepository, EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.departmentRepository = departmentRepository;
        this.teacherRepository = teacherRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public PageResponse<CourseDto.Response> getAll(String search, Long departmentId, Long teacherId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());
        Page<Course> result = courseRepository.findWithFilters(
                (search != null && search.isBlank()) ? null : search, departmentId, teacherId, pageable);
        List<CourseDto.Response> content = result.getContent().stream().map(this::toResponse).toList();
        return new PageResponse<>(content, result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    public CourseDto.Response getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public CourseDto.Response create(CourseDto.Request request) {
        if (courseRepository.existsByCourseCode(request.getCourseCode())) {
            throw new DuplicateResourceException("Course code '" + request.getCourseCode() + "' already exists");
        }

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
        }

        Teacher teacher = null;
        if (request.getTeacherId() != null) {
            teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", request.getTeacherId()));
        }

        Course course = Course.builder()
                .courseCode(request.getCourseCode())
                .courseName(request.getCourseName())
                .description(request.getDescription())
                .credits(request.getCredits())
                .semester(request.getSemester())
                .department(dept)
                .teacher(teacher)
                .build();

        return toResponse(courseRepository.save(course));
    }

    @Transactional
    public CourseDto.Response update(Long id, CourseDto.Request request) {
        Course course = findById(id);

        if (!course.getCourseCode().equals(request.getCourseCode())
                && courseRepository.existsByCourseCode(request.getCourseCode())) {
            throw new DuplicateResourceException("Course code already in use");
        }

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
        }
        Teacher teacher = null;
        if (request.getTeacherId() != null) {
            teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", request.getTeacherId()));
        }

        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());
        course.setSemester(request.getSemester());
        course.setDepartment(dept);
        course.setTeacher(teacher);

        return toResponse(courseRepository.save(course));
    }

    @Transactional
    public void delete(Long id) {
        courseRepository.delete(findById(id));
    }

    private Course findById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
    }

    public CourseDto.Response toResponse(Course c) {
        CourseDto.Response r = new CourseDto.Response();
        r.setId(c.getId());
        r.setCourseCode(c.getCourseCode());
        r.setCourseName(c.getCourseName());
        r.setDescription(c.getDescription());
        r.setCredits(c.getCredits());
        r.setSemester(c.getSemester());
        if (c.getDepartment() != null) {
            r.setDepartmentId(c.getDepartment().getId());
            r.setDepartmentName(c.getDepartment().getDepartmentName());
        }
        if (c.getTeacher() != null) {
            r.setTeacherId(c.getTeacher().getId());
            r.setTeacherName(c.getTeacher().getName());
        }
        r.setEnrollmentCount(enrollmentRepository.countByCourseId(c.getId()));
        r.setCreatedAt(c.getCreatedAt());
        r.setUpdatedAt(c.getUpdatedAt());
        return r;
    }
}
