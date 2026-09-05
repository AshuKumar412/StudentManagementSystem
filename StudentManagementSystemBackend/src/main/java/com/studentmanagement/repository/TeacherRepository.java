package com.studentmanagement.repository;

import com.studentmanagement.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByTeacherId(String teacherId);
    Optional<Teacher> findByUserId(Long userId);
    boolean existsByTeacherId(String teacherId);
    boolean existsByEmail(String email);

    @Query(value = """
        SELECT t.* FROM teachers t
        LEFT JOIN departments d ON d.id = t.department_id
        WHERE (:search IS NULL OR :search = ''
               OR LOWER(t.name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(t.email) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(t.teacher_id) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))
          AND (:departmentId IS NULL OR d.id = :departmentId)
        """,
        countQuery = """
        SELECT count(t.id) FROM teachers t
        LEFT JOIN departments d ON d.id = t.department_id
        WHERE (:search IS NULL OR :search = ''
               OR LOWER(t.name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(t.email) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(t.teacher_id) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))
          AND (:departmentId IS NULL OR d.id = :departmentId)
        """,
        nativeQuery = true)
    Page<Teacher> findWithFilters(
        @Param("search") String search,
        @Param("departmentId") Long departmentId,
        Pageable pageable
    );
}
