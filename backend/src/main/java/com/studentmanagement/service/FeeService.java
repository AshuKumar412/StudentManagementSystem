package com.studentmanagement.service;

import com.studentmanagement.dto.FeeDto;
import com.studentmanagement.entity.*;
import com.studentmanagement.exception.*;
import com.studentmanagement.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FeeService {

    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;

    public FeeService(FeeRepository feeRepository, StudentRepository studentRepository) {
        this.feeRepository = feeRepository;
        this.studentRepository = studentRepository;
    }

    public List<FeeDto.Response> getAll() {
        return feeRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<FeeDto.Response> getByStudentId(Long studentId) {
        return feeRepository.findByStudentId(studentId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public FeeDto.Response create(FeeDto.Request request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        BigDecimal paidAmount = request.getPaidAmount() != null ? request.getPaidAmount() : BigDecimal.ZERO;
        if (paidAmount.compareTo(request.getAmount()) > 0) {
            throw new BadRequestException("Paid amount cannot exceed total amount");
        }

        Fee fee = Fee.builder()
                .student(student)
                .amount(request.getAmount())
                .paidAmount(paidAmount)
                .dueDate(request.getDueDate())
                .paymentDate(request.getPaymentDate())
                .build();
        // @PrePersist calculates dueAmount and paymentStatus
        return toResponse(feeRepository.save(fee));
    }

    @Transactional
    public FeeDto.Response update(Long id, FeeDto.Request request) {
        Fee fee = feeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee", "id", id));

        BigDecimal paidAmount = request.getPaidAmount() != null ? request.getPaidAmount() : BigDecimal.ZERO;
        if (paidAmount.compareTo(request.getAmount()) > 0) {
            throw new BadRequestException("Paid amount cannot exceed total amount");
        }

        fee.setAmount(request.getAmount());
        fee.setPaidAmount(paidAmount);
        fee.setDueDate(request.getDueDate());
        fee.setPaymentDate(request.getPaymentDate());
        // @PreUpdate recalculates
        return toResponse(feeRepository.save(fee));
    }

    private FeeDto.Response toResponse(Fee f) {
        FeeDto.Response r = new FeeDto.Response();
        r.setId(f.getId());
        r.setStudentId(f.getStudent().getId());
        r.setStudentName(f.getStudent().getFirstName() + " " + f.getStudent().getLastName());
        r.setStudentStudentId(f.getStudent().getStudentId());
        r.setAmount(f.getAmount());
        r.setPaidAmount(f.getPaidAmount());
        r.setDueAmount(f.getDueAmount());
        r.setPaymentStatus(f.getPaymentStatus());
        r.setDueDate(f.getDueDate());
        r.setPaymentDate(f.getPaymentDate());
        r.setCreatedAt(f.getCreatedAt());
        r.setUpdatedAt(f.getUpdatedAt());
        return r;
    }
}
