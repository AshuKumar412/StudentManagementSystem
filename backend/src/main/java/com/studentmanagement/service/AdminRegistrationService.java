package com.studentmanagement.service;

import com.studentmanagement.dto.AuthDto;
import com.studentmanagement.entity.Student;
import com.studentmanagement.entity.User;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.repository.StudentRepository;
import com.studentmanagement.repository.TeacherRepository;
import com.studentmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminRegistrationService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    public AdminRegistrationService(UserRepository userRepository,
                                    StudentRepository studentRepository,
                                    TeacherRepository teacherRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
    }

    public List<AuthDto.RegistrationItemDto> getPendingRegistrations() {
        return getRegistrationsByFilter("PENDING", null);
    }

    public List<AuthDto.RegistrationItemDto> getRegistrationsByFilter(String status, String role) {
        List<User> users;
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            User.AccountStatus accountStatus = User.AccountStatus.valueOf(status.toUpperCase());
            if (role != null && !role.isBlank() && !"ALL".equalsIgnoreCase(role)) {
                User.Role roleEnum = User.Role.valueOf(role.toUpperCase().replace("ROLE_", ""));
                users = userRepository.findByAccountStatusAndRole(accountStatus, roleEnum);
            } else {
                users = userRepository.findByAccountStatus(accountStatus);
            }
        } else if (role != null && !role.isBlank() && !"ALL".equalsIgnoreCase(role)) {
            User.Role roleEnum = User.Role.valueOf(role.toUpperCase().replace("ROLE_", ""));
            users = userRepository.findByRole(roleEnum);
        } else {
            users = userRepository.findAll();
        }

        List<AuthDto.RegistrationItemDto> items = new ArrayList<>();
        for (User u : users) {
            if (u.getRole() == User.Role.ADMIN && (status == null || "PENDING".equalsIgnoreCase(status))) {
                continue;
            }
            items.add(toDto(u));
        }
        return items;
    }

    public AuthDto.RegistrationItemDto getRegistrationById(Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User registration not found with id: " + id));
        return toDto(u);
    }

    @Transactional
    public AuthDto.RegistrationItemDto approveRegistration(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User registration not found with id: " + id));

        user.setAccountStatus(User.AccountStatus.APPROVED);
        user.setRejectionReason(null);
        User savedUser = userRepository.save(user);
        final Long userId = savedUser.getId();

        if (savedUser.getRole() == User.Role.STUDENT) {
            studentRepository.findAll().stream()
                    .filter(s -> s.getUser() != null && s.getUser().getId().equals(userId))
                    .findFirst()
                    .ifPresent(s -> {
                        s.setStatus(Student.Status.ACTIVE);
                        studentRepository.save(s);
                    });
        }

        return toDto(savedUser);
    }

    @Transactional
    public AuthDto.RegistrationItemDto rejectRegistration(Long id, AuthDto.RegistrationApprovalRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User registration not found with id: " + id));

        user.setAccountStatus(User.AccountStatus.REJECTED);
        String reason = (request != null && request.getRejectionReason() != null)
                ? request.getRejectionReason().trim()
                : "Application did not meet requirements.";
        user.setRejectionReason(reason);
        User savedUser = userRepository.save(user);
        final Long userId = savedUser.getId();

        if (savedUser.getRole() == User.Role.STUDENT) {
            studentRepository.findAll().stream()
                    .filter(s -> s.getUser() != null && s.getUser().getId().equals(userId))
                    .findFirst()
                    .ifPresent(s -> {
                        s.setStatus(Student.Status.INACTIVE);
                        studentRepository.save(s);
                    });
        }

        return toDto(savedUser);
    }

    private AuthDto.RegistrationItemDto toDto(User user) {
        AuthDto.RegistrationItemDto dto = new AuthDto.RegistrationItemDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setStatus(user.getAccountStatus() != null ? user.getAccountStatus().name() : "PENDING");
        dto.setRejectionReason(user.getRejectionReason());
        dto.setRegistrationDate(user.getCreatedAt());

        final Long userId = user.getId();
        if (user.getRole() == User.Role.STUDENT) {
            studentRepository.findAll().stream()
                    .filter(s -> s.getUser() != null && s.getUser().getId().equals(userId))
                    .findFirst()
                    .ifPresent(s -> {
                        dto.setPhone(s.getPhone());
                        if (s.getDepartment() != null) {
                            dto.setDepartment(s.getDepartment().getDepartmentName());
                            dto.setDepartmentId(s.getDepartment().getId());
                        }
                    });
        } else if (user.getRole() == User.Role.TEACHER || user.getRole() == User.Role.FACULTY) {
            teacherRepository.findAll().stream()
                    .filter(t -> t.getUser() != null && t.getUser().getId().equals(userId))
                    .findFirst()
                    .ifPresent(t -> {
                        dto.setPhone(t.getPhone());
                        if (t.getDepartment() != null) {
                            dto.setDepartment(t.getDepartment().getDepartmentName());
                            dto.setDepartmentId(t.getDepartment().getId());
                        }
                    });
        }

        return dto;
    }
}