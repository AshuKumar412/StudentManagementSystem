package com.studentmanagement.controller;

import com.studentmanagement.dto.ApiResponse;
import com.studentmanagement.dto.AuthDto;
import com.studentmanagement.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDto.LoginResponse>> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        AuthDto.LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping({"/register/admin", "/admin/register"})
    public ResponseEntity<ApiResponse<String>> registerAdmin(@Valid @RequestBody AuthDto.AdminRegisterRequest request) {
        String msg = authService.registerAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(msg, msg));
    }

    @PostMapping("/register/student")
    public ResponseEntity<ApiResponse<String>> registerStudent(@Valid @RequestBody AuthDto.StudentRegisterRequest request) {
        String msg = authService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(msg, msg));
    }

    @PostMapping("/register/faculty")
    public ResponseEntity<ApiResponse<String>> registerFaculty(@Valid @RequestBody AuthDto.FacultyRegisterRequest request) {
        String msg = authService.registerFaculty(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(msg, msg));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDto.LoginResponse>> register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        AuthDto.LoginResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthDto.LoginResponse.UserInfo>> getCurrentUser(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthenticated"));
        }
        return ResponseEntity.ok(ApiResponse.success(authService.getMe(auth.getName())));
    }
}

