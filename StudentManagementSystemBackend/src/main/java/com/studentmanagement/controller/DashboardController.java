package com.studentmanagement.controller;

import com.studentmanagement.dto.*;
import com.studentmanagement.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<DashboardDto.AdminDashboard>> adminDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminDashboard()));
    }

    @GetMapping("/teacher")
    public ResponseEntity<ApiResponse<DashboardDto.TeacherDashboard>> teacherDashboard(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getTeacherDashboard(auth.getName())));
    }

    @GetMapping("/student")
    public ResponseEntity<ApiResponse<DashboardDto.StudentDashboard>> studentDashboard(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStudentDashboard(auth.getName())));
    }
}
