package com.studentmanagement.service;

import com.studentmanagement.dto.PageResponse;
import com.studentmanagement.dto.TeacherDto;
import com.studentmanagement.entity.*;
import com.studentmanagement.exception.*;
import com.studentmanagement.repository.*;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherService(TeacherRepository teacherRepository, DepartmentRepository departmentRepository,
                          UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.teacherRepository = teacherRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public PageResponse<TeacherDto.Response> getAll(String search, Long departmentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());
        Page<Teacher> result = teacherRepository.findWithFilters(
                (search != null && search.isBlank()) ? null : search, departmentId, pageable);
        List<TeacherDto.Response> content = result.getContent().stream().map(this::toResponse).toList();
        return new PageResponse<>(content, result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    public TeacherDto.Response getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public TeacherDto.Response create(TeacherDto.Request request) {
        if (teacherRepository.existsByTeacherId(request.getTeacherId())) {
            throw new DuplicateResourceException("Teacher ID '" + request.getTeacherId() + "' already exists");
        }
        if (teacherRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' already registered");
        }

        String password = (request.getPassword() != null && !request.getPassword().isBlank())
                ? request.getPassword() : "teacher123";
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(password))
                .role(User.Role.TEACHER)
                .build();
        user = userRepository.save(user);

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
        }

        Teacher teacher = Teacher.builder()
                .teacherId(request.getTeacherId())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .department(dept)
                .user(user)
                .build();

        return toResponse(teacherRepository.save(teacher));
    }

    @Transactional
    public TeacherDto.Response update(Long id, TeacherDto.Request request) {
        Teacher teacher = findById(id);

        if (!teacher.getTeacherId().equals(request.getTeacherId())
                && teacherRepository.existsByTeacherId(request.getTeacherId())) {
            throw new DuplicateResourceException("Teacher ID already in use");
        }
        if (!teacher.getEmail().equals(request.getEmail())
                && teacherRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
        }

        teacher.setTeacherId(request.getTeacherId());
        teacher.setName(request.getName());
        teacher.setEmail(request.getEmail());
        teacher.setPhone(request.getPhone());
        teacher.setDepartment(dept);

        if (teacher.getUser() != null) {
            User u = teacher.getUser();
            u.setName(request.getName());
            u.setEmail(request.getEmail());
            userRepository.save(u);
        }

        return toResponse(teacherRepository.save(teacher));
    }

    @Transactional
    public void delete(Long id) {
        teacherRepository.delete(findById(id));
    }

    private Teacher findById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));
    }

    public TeacherDto.Response toResponse(Teacher t) {
        TeacherDto.Response r = new TeacherDto.Response();
        r.setId(t.getId());
        r.setTeacherId(t.getTeacherId());
        r.setName(t.getName());
        r.setEmail(t.getEmail());
        r.setPhone(t.getPhone());
        if (t.getDepartment() != null) {
            r.setDepartmentId(t.getDepartment().getId());
            r.setDepartmentName(t.getDepartment().getDepartmentName());
        }
        if (t.getUser() != null) r.setUserId(t.getUser().getId());
        r.setCreatedAt(t.getCreatedAt());
        r.setUpdatedAt(t.getUpdatedAt());
        return r;
    }
}
