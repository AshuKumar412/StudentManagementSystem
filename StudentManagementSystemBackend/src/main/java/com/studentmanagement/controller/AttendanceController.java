package com.studentmanagement.controller;

import com.studentmanagement.dto.*;
import com.studentmanagement.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> get(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (courseId != null && date != null) {
            List<AttendanceDto.Response> data = attendanceService.getByCourseAndDate(courseId, date);
            return ResponseEntity.ok(ApiResponse.success(data));
        }
        if (studentId != null && courseId != null) {
            List<AttendanceDto.Response> data = attendanceService.getByStudentAndCourse(studentId, courseId);
            return ResponseEntity.ok(ApiResponse.success(data));
        }
        if (studentId != null) {
            List<AttendanceDto.StudentAttendanceSummary> data = attendanceService.getStudentSummary(studentId);
            return ResponseEntity.ok(ApiResponse.success(data));
        }
        return ResponseEntity.ok(ApiResponse.success(List.of()));
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<AttendanceDto.Response>>> markBulk(
            @Valid @RequestBody AttendanceDto.BulkRequest request) {
        List<AttendanceDto.Response> result = attendanceService.markBulk(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Attendance marked", result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<List<AttendanceDto.Response>>> mark(
            @Valid @RequestBody AttendanceDto.BulkRequest request) {
        List<AttendanceDto.Response> result = attendanceService.markBulk(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Attendance marked", result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AttendanceDto.Response>> update(
            @PathVariable Long id, @RequestBody AttendanceDto.Request request) {
        return ResponseEntity.ok(ApiResponse.success("Attendance updated", attendanceService.update(id, request)));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<List<AttendanceDto.StudentAttendanceSummary>>> getSummary(
            @RequestParam Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getStudentSummary(studentId)));
    }
}
