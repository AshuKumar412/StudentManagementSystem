package com.studentmanagement.controller;

import com.studentmanagement.dto.*;
import com.studentmanagement.service.FeeService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeeDto.Response>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(feeService.getAll()));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<FeeDto.Response>>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(feeService.getByStudentId(studentId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeeDto.Response>> create(@Valid @RequestBody FeeDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Fee record created", feeService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FeeDto.Response>> update(
            @PathVariable Long id, @Valid @RequestBody FeeDto.Request request) {
        return ResponseEntity.ok(ApiResponse.success("Fee updated", feeService.update(id, request)));
    }
}
