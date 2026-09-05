package com.studentmanagement.repository;

import com.studentmanagement.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByStudentId(Long studentId);

    @Query("SELECT COALESCE(SUM(f.dueAmount), 0) FROM Fee f WHERE f.paymentStatus != 'PAID'")
    BigDecimal sumPendingFees();

    @Query("SELECT COALESCE(SUM(f.paidAmount), 0) FROM Fee f")
    BigDecimal sumCollectedFees();
}
