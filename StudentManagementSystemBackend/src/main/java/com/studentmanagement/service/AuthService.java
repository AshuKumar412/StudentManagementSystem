package com.studentmanagement.service;

import com.studentmanagement.dto.AuthDto;
import com.studentmanagement.entity.Department;
import com.studentmanagement.entity.Student;
import com.studentmanagement.entity.Teacher;
import com.studentmanagement.entity.User;
import com.studentmanagement.exception.BadRequestException;
import com.studentmanagement.exception.DuplicateResourceException;
import com.studentmanagement.exception.UnauthorizedException;
import com.studentmanagement.repository.DepartmentRepository;
import com.studentmanagement.repository.StudentRepository;
import com.studentmanagement.repository.TeacherRepository;
import com.studentmanagement.repository.UserRepository;
import com.studentmanagement.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       StudentRepository studentRepository,
                       TeacherRepository teacherRepository,
                       DepartmentRepository departmentRepository,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.departmentRepository = departmentRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // Account status checks for non-ADMIN users
        if (user.getRole() != User.Role.ADMIN) {
            User.AccountStatus status = user.getAccountStatus();
            if (status == User.AccountStatus.PENDING) {
                throw new UnauthorizedException("Your registration is pending admin approval.");
            } else if (status == User.AccountStatus.REJECTED) {
                String reason = user.getRejectionReason();
                String message = "Your registration has been rejected.";
                if (reason != null && !reason.isBlank()) {
                    message += " Reason: " + reason;
                }
                throw new UnauthorizedException(message);
            } else if (status == User.AccountStatus.INACTIVE) {
                throw new UnauthorizedException("Your account is currently inactive. Please contact administrator.");
            }
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        AuthDto.LoginResponse response = new AuthDto.LoginResponse();
        response.setToken(token);
        String roleStr = user.getRole().name();
        if ("TEACHER".equalsIgnoreCase(roleStr)) {
            roleStr = "TEACHER"; // Mapped consistently
        }
        response.setRole(roleStr);
        response.setAccountStatus(user.getAccountStatus() != null ? user.getAccountStatus().name() : "ACTIVE");

        AuthDto.LoginResponse.UserInfo userInfo = new AuthDto.LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setName(user.getName());
        userInfo.setEmail(user.getEmail());
        userInfo.setRole(roleStr);
        userInfo.setAccountStatus(user.getAccountStatus() != null ? user.getAccountStatus().name() : "ACTIVE");
        response.setUser(userInfo);

        return response;
    }

    @Transactional
    public String registerAdmin(AuthDto.AdminRegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new DuplicateResourceException("An account with this email already exists.");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(cleanEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.ADMIN)
                .accountStatus(User.AccountStatus.ACTIVE)
                .build();
        userRepository.save(user);

        return "Admin account created successfully. You can now sign in.";
    }

    @Transactional
    public String registerStudent(AuthDto.StudentRegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new DuplicateResourceException("Email '" + cleanEmail + "' is already registered");
        }

        String fullName = request.getFirstName().trim();
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            fullName += " " + request.getLastName().trim();
        }

        // Create user with PENDING status
        User user = User.builder()
                .name(fullName)
                .email(cleanEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.STUDENT)
                .accountStatus(User.AccountStatus.PENDING)
                .build();
        user = userRepository.save(user);

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }

        String studentId = request.getStudentId();
        if (studentId == null || studentId.isBlank()) {
            studentId = "STU" + String.format("%04d", (System.currentTimeMillis() / 100) % 10000);
        }
        if (studentRepository.existsByStudentId(studentId)) {
            studentId = "STU" + String.format("%04d", (System.currentTimeMillis() + 1) % 10000);
        }

        Student student = Student.builder()
                .studentId(studentId)
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName() != null ? request.getLastName().trim() : "")
                .email(user.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender() != null && !request.getGender().isBlank() ? request.getGender() : "Not Specified")
                .address(request.getAddress())
                .profilePicture(request.getProfilePicture())
                .department(dept)
                .semester(request.getSemester() != null ? request.getSemester() : 1)
                .admissionDate(LocalDate.now())
                .status(Student.Status.ACTIVE)
                .user(user)
                .build();
        studentRepository.save(student);

        return "Registration submitted. Wait for admin approval.";
    }

    @Transactional
    public String registerFaculty(AuthDto.FacultyRegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new DuplicateResourceException("Email '" + cleanEmail + "' is already registered");
        }

        // Create user with PENDING status
        User user = User.builder()
                .name(request.getName().trim())
                .email(cleanEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.TEACHER)
                .accountStatus(User.AccountStatus.PENDING)
                .build();
        user = userRepository.save(user);

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }

        String teacherId = request.getFacultyId();
        if (teacherId == null || teacherId.isBlank()) {
            teacherId = "FAC" + String.format("%04d", (System.currentTimeMillis() / 100) % 10000);
        }
        if (teacherRepository.existsByTeacherId(teacherId)) {
            teacherId = "FAC" + String.format("%04d", (System.currentTimeMillis() + 1) % 10000);
        }

        Teacher teacher = Teacher.builder()
                .teacherId(teacherId)
                .name(request.getName().trim())
                .email(user.getEmail())
                .phone(request.getPhone())
                .department(dept)
                .user(user)
                .build();
        teacherRepository.save(teacher);

        return "Registration submitted. Wait for admin approval.";
    }

    @Transactional
    public AuthDto.LoginResponse register(AuthDto.RegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new DuplicateResourceException("Email '" + cleanEmail + "' is already registered");
        }

        User.Role roleEnum = User.Role.STUDENT;
        if (request.getRole() != null) {
            try {
                String r = request.getRole().toUpperCase().replace("ROLE_", "");
                if ("FACULTY".equals(r)) r = "TEACHER";
                roleEnum = User.Role.valueOf(r);
            } catch (Exception ignored) {}
        }

        // If not ADMIN, set to PENDING
        User.AccountStatus initialStatus = (roleEnum == User.Role.ADMIN) ? User.AccountStatus.ACTIVE : User.AccountStatus.PENDING;

        User user = User.builder()
                .name(request.getName().trim())
                .email(cleanEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(roleEnum)
                .accountStatus(initialStatus)
                .build();
        user = userRepository.save(user);

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }

        if (roleEnum == User.Role.STUDENT) {
            String studentId = request.getIdentifier();
            if (studentId == null || studentId.isBlank()) {
                studentId = "STU" + String.format("%04d", (System.currentTimeMillis() / 100) % 10000);
            }
            if (studentRepository.existsByStudentId(studentId)) {
                studentId = "STU" + String.format("%04d", (System.currentTimeMillis() + 1) % 10000);
            }

            String[] names = request.getName().trim().split("\\s+", 2);
            String firstName = names[0];
            String lastName = names.length > 1 ? names[1] : "";

            Student student = Student.builder()
                    .studentId(studentId)
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(user.getEmail())
                    .phone(request.getPhone())
                    .gender(request.getGender() != null ? request.getGender() : "Not Specified")
                    .address(request.getAddress())
                    .department(dept)
                    .semester(request.getSemester() != null ? request.getSemester() : 1)
                    .admissionDate(LocalDate.now())
                    .status(Student.Status.ACTIVE)
                    .user(user)
                    .build();
            studentRepository.save(student);
        } else if (roleEnum == User.Role.TEACHER) {
            String teacherId = request.getIdentifier();
            if (teacherId == null || teacherId.isBlank()) {
                teacherId = "TCH" + String.format("%04d", (System.currentTimeMillis() / 100) % 10000);
            }
            if (teacherRepository.existsByTeacherId(teacherId)) {
                teacherId = "TCH" + String.format("%04d", (System.currentTimeMillis() + 1) % 10000);
            }

            Teacher teacher = Teacher.builder()
                    .teacherId(teacherId)
                    .name(request.getName().trim())
                    .email(user.getEmail())
                    .phone(request.getPhone())
                    .department(dept)
                    .user(user)
                    .build();
            teacherRepository.save(teacher);
        }

        AuthDto.LoginResponse response = new AuthDto.LoginResponse();
        response.setRole(user.getRole().name());
        response.setAccountStatus(user.getAccountStatus().name());

        AuthDto.LoginResponse.UserInfo userInfo = new AuthDto.LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setName(user.getName());
        userInfo.setEmail(user.getEmail());
        userInfo.setRole(user.getRole().name());
        userInfo.setAccountStatus(user.getAccountStatus().name());
        response.setUser(userInfo);

        return response;
    }

    public AuthDto.LoginResponse.UserInfo getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        AuthDto.LoginResponse.UserInfo userInfo = new AuthDto.LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setName(user.getName());
        userInfo.setEmail(user.getEmail());
        userInfo.setRole(user.getRole().name());
        userInfo.setAccountStatus(user.getAccountStatus() != null ? user.getAccountStatus().name() : "ACTIVE");
        return userInfo;
    }
}

