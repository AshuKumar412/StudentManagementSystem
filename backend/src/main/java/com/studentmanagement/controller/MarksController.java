package com.studentmanagement.controller;

import com.studentmanagement.dto.*;
import com.studentmanagement.service.MarksService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
public class MarksController {

    private final MarksService marksService;

    public MarksController(MarksService marksService) {
        this.marksService = marksService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MarksDto.Response>>> getAll(
            @RequestParam(required = false) Long courseId) {
        if (courseId != null) return ResponseEntity.ok(ApiResponse.success(marksService.getByCourseId(courseId)));
        return ResponseEntity.ok(ApiResponse.success(marksService.getAll()));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<MarksDto.Response>>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(marksService.getByStudentId(studentId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MarksDto.Response>> create(@Valid @RequestBody MarksDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Marks saved", marksService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MarksDto.Response>> update(
            @PathVariable Long id, @Valid @RequestBody MarksDto.Request request) {
        return ResponseEntity.ok(ApiResponse.success("Marks updated", marksService.update(id, request)));
    }
}
