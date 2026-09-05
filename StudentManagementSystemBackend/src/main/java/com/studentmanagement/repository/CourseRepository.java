package com.studentmanagement.repository;

import com.studentmanagement.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseCode(String courseCode);
    boolean existsByCourseCode(String courseCode);
    List<Course> findByTeacherId(Long teacherId);
    List<Course> findByDepartmentId(Long departmentId);

    @Query(value = """
        SELECT c.* FROM courses c
        LEFT JOIN departments d ON d.id = c.department_id
        LEFT JOIN teachers t ON t.id = c.teacher_id
        WHERE (:search IS NULL OR :search = ''
               OR LOWER(c.course_name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(c.course_code) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))
          AND (:departmentId IS NULL OR d.id = :departmentId)
          AND (:teacherId IS NULL OR t.id = :teacherId)
        """,
        countQuery = """
        SELECT count(c.id) FROM courses c
        LEFT JOIN departments d ON d.id = c.department_id
        LEFT JOIN teachers t ON t.id = c.teacher_id
        WHERE (:search IS NULL OR :search = ''
               OR LOWER(c.course_name) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%'))
               OR LOWER(c.course_code) LIKE LOWER(CONCAT('%', CAST(:search AS text), '%')))
          AND (:departmentId IS NULL OR d.id = :departmentId)
          AND (:teacherId IS NULL OR t.id = :teacherId)
        """,
        nativeQuery = true)
    Page<Course> findWithFilters(
        @Param("search") String search,
        @Param("departmentId") Long departmentId,
        @Param("teacherId") Long teacherId,
        Pageable pageable
    );
}
