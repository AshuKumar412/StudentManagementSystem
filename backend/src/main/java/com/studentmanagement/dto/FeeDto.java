package com.studentmanagement.dto;

import com.studentmanagement.entity.Fee;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class FeeDto {

    public static class Request {
        private Long studentId;
        private BigDecimal amount, paidAmount;
        private LocalDate dueDate, paymentDate;
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long v) { this.studentId = v; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal v) { this.amount = v; }
        public BigDecimal getPaidAmount() { return paidAmount; }
        public void setPaidAmount(BigDecimal v) { this.paidAmount = v; }
        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate v) { this.dueDate = v; }
        public LocalDate getPaymentDate() { return paymentDate; }
        public void setPaymentDate(LocalDate v) { this.paymentDate = v; }
    }

    public static class Response {
        private Long id, studentId;
        private String studentName, studentStudentId;
        private BigDecimal amount, paidAmount, dueAmount;
        private Fee.PaymentStatus paymentStatus;
        private LocalDate dueDate, paymentDate;
        private LocalDateTime createdAt, updatedAt;
        public Long getId() { return id; }
        public void setId(Long v) { this.id = v; }
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long v) { this.studentId = v; }
        public String getStudentName() { return studentName; }
        public void setStudentName(String v) { this.studentName = v; }
        public String getStudentStudentId() { return studentStudentId; }
        public void setStudentStudentId(String v) { this.studentStudentId = v; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal v) { this.amount = v; }
        public BigDecimal getPaidAmount() { return paidAmount; }
        public void setPaidAmount(BigDecimal v) { this.paidAmount = v; }
        public BigDecimal getDueAmount() { return dueAmount; }
        public void setDueAmount(BigDecimal v) { this.dueAmount = v; }
        public Fee.PaymentStatus getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(Fee.PaymentStatus v) { this.paymentStatus = v; }
        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate v) { this.dueDate = v; }
        public LocalDate getPaymentDate() { return paymentDate; }
        public void setPaymentDate(LocalDate v) { this.paymentDate = v; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime v) { this.updatedAt = v; }
    }
}
