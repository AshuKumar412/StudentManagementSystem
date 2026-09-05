package com.studentmanagement.controller;

import com.studentmanagement.dto.*;
import com.studentmanagement.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EnrollmentDto.Response>>> getAll(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long courseId) {
        if (studentId != null) return ResponseEntity.ok(ApiResponse.success(enrollmentService.getByStudentId(studentId)));
        if (courseId != null) return ResponseEntity.ok(ApiResponse.success(enrollmentService.getByCourseId(courseId)));
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getAll()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EnrollmentDto.Response>> create(@Valid @RequestBody EnrollmentDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Enrollment created", enrollmentService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EnrollmentDto.Response>> update(@PathVariable Long id, @Valid @RequestBody EnrollmentDto.Request request) {
        return ResponseEntity.ok(ApiResponse.success("Enrollment updated", enrollmentService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        enrollmentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Enrollment deleted", null));
    }
}
