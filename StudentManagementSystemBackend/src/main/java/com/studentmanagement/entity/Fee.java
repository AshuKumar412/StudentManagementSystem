package com.studentmanagement.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fees")
public class Fee {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    @Column(name = "paid_amount", precision = 10, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;
    @Column(name = "due_amount", precision = 10, scale = 2)
    private BigDecimal dueAmount;
    @Enumerated(EnumType.STRING) @Column(name = "payment_status")
    private PaymentStatus paymentStatus;
    @Column(name = "due_date") private LocalDate dueDate;
    @Column(name = "payment_date") private LocalDate paymentDate;
    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PaymentStatus { PAID, PARTIAL, PENDING, OVERDUE }

    public Fee() {}
    public static FeeBuilder builder() { return new FeeBuilder(); }

    @PrePersist @PreUpdate
    public void calculateDueAndStatus() {
        if (amount != null) {
            if (paidAmount == null) paidAmount = BigDecimal.ZERO;
            this.dueAmount = amount.subtract(paidAmount);
            if (dueAmount.compareTo(BigDecimal.ZERO) <= 0) {
                this.paymentStatus = PaymentStatus.PAID;
                this.dueAmount = BigDecimal.ZERO;
            } else if (paidAmount.compareTo(BigDecimal.ZERO) > 0) {
                this.paymentStatus = PaymentStatus.PARTIAL;
            } else {
                if (dueDate != null && dueDate.isBefore(LocalDate.now())) {
                    this.paymentStatus = PaymentStatus.OVERDUE;
                } else {
                    this.paymentStatus = PaymentStatus.PENDING;
                }
            }
        }
    }

    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public void setStudent(Student v) { this.student = v; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal v) { this.amount = v; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal v) { this.paidAmount = v; }
    public BigDecimal getDueAmount() { return dueAmount; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate v) { this.dueDate = v; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate v) { this.paymentDate = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static class FeeBuilder {
        private Student student; private BigDecimal amount;
        private BigDecimal paidAmount = BigDecimal.ZERO;
        private LocalDate dueDate, paymentDate;
        public FeeBuilder student(Student v) { this.student = v; return this; }
        public FeeBuilder amount(BigDecimal v) { this.amount = v; return this; }
        public FeeBuilder paidAmount(BigDecimal v) { this.paidAmount = v; return this; }
        public FeeBuilder dueDate(LocalDate v) { this.dueDate = v; return this; }
        public FeeBuilder paymentDate(LocalDate v) { this.paymentDate = v; return this; }
        public Fee build() {
            Fee f = new Fee(); f.student = student; f.amount = amount;
            f.paidAmount = paidAmount; f.dueDate = dueDate; f.paymentDate = paymentDate; return f;
        }
    }
}
