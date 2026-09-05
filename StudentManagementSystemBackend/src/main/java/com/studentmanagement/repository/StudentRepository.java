package com.studentmanagement.repository;

import com.studentmanagement.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentId(String studentId);
    Optional<Student> findByUserId(Long userId);
    boolean existsByStudentId(String studentId);
    boolean existsByEmail(String email);

    @Query(value = """
        SELECT s.* FROM students s
        LEFT JOIN departments d ON d.id = s.department_id
        WHERE (:search IS NULL OR :search = ''
               OR LOWER(s.first_name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(s.last_name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(s.email) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(s.student_id) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))
          AND (:departmentId IS NULL OR d.id = :departmentId)
          AND (:semester IS NULL OR s.semester = :semester)
          AND (:status IS NULL OR s.status = :status)
        """,
        countQuery = """
        SELECT count(s.id) FROM students s
        LEFT JOIN departments d ON d.id = s.department_id
        WHERE (:search IS NULL OR :search = ''
               OR LOWER(s.first_name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(s.last_name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(s.email) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(s.student_id) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))
          AND (:departmentId IS NULL OR d.id = :departmentId)
          AND (:semester IS NULL OR s.semester = :semester)
          AND (:status IS NULL OR s.status = :status)
        """,
        nativeQuery = true)
    Page<Student> findWithFilters(
        @Param("search") String search,
        @Param("departmentId") Long departmentId,
        @Param("semester") Integer semester,
        @Param("status") String status,
        Pageable pageable
    );

    long countByStatus(Student.Status status);
}
