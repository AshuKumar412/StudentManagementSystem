package com.studentmanagement.service;

import com.studentmanagement.dto.PageResponse;
import com.studentmanagement.dto.StudentDto;
import com.studentmanagement.entity.*;
import com.studentmanagement.exception.*;
import com.studentmanagement.repository.*;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, DepartmentRepository departmentRepository,
                          UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public PageResponse<StudentDto.Response> getAll(String search, Long departmentId, Integer semester,
                                                     String status, int page, int size) {
        Student.Status statusEnum = null;
        if (status != null && !status.isBlank()) {
            try { statusEnum = Student.Status.valueOf(status.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());
        String statusStr = (status != null && !status.isBlank()) ? status.trim().toUpperCase() : null;
        Page<Student> result = studentRepository.findWithFilters(
                (search != null && !search.isBlank()) ? search.trim() : null,
                departmentId, semester, statusStr, pageable);
        List<StudentDto.Response> content = result.getContent().stream().map(this::toResponse).toList();
        return new PageResponse<>(content, result.getNumber(), result.getSize(),
                result.getTotalElements(), result.getTotalPages());
    }

    public StudentDto.Response getById(Long id) {
        return toResponse(findById(id));
    }

    public StudentDto.Response getByStudentId(String studentId) {
        return toResponse(studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "studentId", studentId)));
    }

    @Transactional
    public StudentDto.Response create(StudentDto.Request request) {
        if (studentRepository.existsByStudentId(request.getStudentId())) {
            throw new DuplicateResourceException("Student ID '" + request.getStudentId() + "' already exists");
        }
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' already registered");
        }

        // Create user account
        String password = (request.getPassword() != null && !request.getPassword().isBlank())
                ? request.getPassword() : "student123";
        User user = User.builder()
                .name(request.getFirstName() + " " + request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(password))
                .role(User.Role.STUDENT)
                .build();
        user = userRepository.save(user);

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
        }

        Student student = Student.builder()
                .studentId(request.getStudentId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .address(request.getAddress())
                .profilePicture(request.getProfilePicture())
                .department(dept)
                .admissionDate(request.getAdmissionDate())
                .semester(request.getSemester())
                .status(request.getStatus() != null ? request.getStatus() : Student.Status.ACTIVE)
                .user(user)
                .build();

        return toResponse(studentRepository.save(student));
    }

    @Transactional
    public StudentDto.Response update(Long id, StudentDto.Request request) {
        Student student = findById(id);

        if (!student.getStudentId().equals(request.getStudentId())
                && studentRepository.existsByStudentId(request.getStudentId())) {
            throw new DuplicateResourceException("Student ID already in use");
        }
        if (!student.getEmail().equals(request.getEmail())
                && studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
        }

        student.setStudentId(request.getStudentId());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setGender(request.getGender());
        student.setAddress(request.getAddress());
        student.setProfilePicture(request.getProfilePicture());
        student.setDepartment(dept);
        student.setAdmissionDate(request.getAdmissionDate());
        student.setSemester(request.getSemester());
        if (request.getStatus() != null) student.setStatus(request.getStatus());

        // Update linked user email/name
        if (student.getUser() != null) {
            User u = student.getUser();
            u.setName(request.getFirstName() + " " + request.getLastName());
            u.setEmail(request.getEmail());
            userRepository.save(u);
        }

        return toResponse(studentRepository.save(student));
    }

    @Transactional
    public void delete(Long id) {
        Student student = findById(id);
        studentRepository.delete(student);
    }

    private Student findById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
    }

    public StudentDto.Response toResponse(Student s) {
        StudentDto.Response r = new StudentDto.Response();
        r.setId(s.getId());
        r.setStudentId(s.getStudentId());
        r.setFirstName(s.getFirstName());
        r.setLastName(s.getLastName());
        r.setEmail(s.getEmail());
        r.setPhone(s.getPhone());
        r.setDateOfBirth(s.getDateOfBirth());
        r.setGender(s.getGender());
        r.setAddress(s.getAddress());
        r.setProfilePicture(s.getProfilePicture());
        if (s.getDepartment() != null) {
            r.setDepartmentId(s.getDepartment().getId());
            r.setDepartmentName(s.getDepartment().getDepartmentName());
        }
        r.setAdmissionDate(s.getAdmissionDate());
        r.setSemester(s.getSemester());
        r.setStatus(s.getStatus());
        if (s.getUser() != null) r.setUserId(s.getUser().getId());
        r.setCreatedAt(s.getCreatedAt());
        r.setUpdatedAt(s.getUpdatedAt());
        return r;
    }
}
