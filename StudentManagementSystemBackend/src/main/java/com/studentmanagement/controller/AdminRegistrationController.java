package com.studentmanagement.controller;

import com.studentmanagement.dto.ApiResponse;
import com.studentmanagement.dto.AuthDto;
import com.studentmanagement.service.AdminRegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/registrations")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRegistrationController {

    private final AdminRegistrationService registrationService;

    public AdminRegistrationController(AdminRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<AuthDto.RegistrationItemDto>>> getPending() {
        return ResponseEntity.ok(ApiResponse.success(registrationService.getPendingRegistrations()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuthDto.RegistrationItemDto>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(ApiResponse.success(registrationService.getRegistrationsByFilter(status, role)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AuthDto.RegistrationItemDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(registrationService.getRegistrationById(id)));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<AuthDto.RegistrationItemDto>> approve(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Registration approved successfully",
                registrationService.approveRegistration(id)));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<AuthDto.RegistrationItemDto>> reject(
            @PathVariable Long id,
            @RequestBody(required = false) AuthDto.RegistrationApprovalRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Registration rejected",
                registrationService.rejectRegistration(id, request)));
    }
}