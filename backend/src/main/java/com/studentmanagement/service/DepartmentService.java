package com.studentmanagement.service;

import com.studentmanagement.dto.DepartmentDto;
import com.studentmanagement.entity.Department;
import com.studentmanagement.exception.DuplicateResourceException;
import com.studentmanagement.exception.ResourceNotFoundException;
import com.studentmanagement.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<DepartmentDto.Response> getAll() {
        return departmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public DepartmentDto.Response getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public DepartmentDto.Response create(DepartmentDto.Request request) {
        if (departmentRepository.existsByDepartmentCode(request.getDepartmentCode())) {
            throw new DuplicateResourceException("Department with code '" + request.getDepartmentCode() + "' already exists");
        }
        Department dept = Department.builder()
                .departmentCode(request.getDepartmentCode())
                .departmentName(request.getDepartmentName())
                .description(request.getDescription())
                .build();
        return toResponse(departmentRepository.save(dept));
    }

    @Transactional
    public DepartmentDto.Response update(Long id, DepartmentDto.Request request) {
        Department dept = findById(id);
        if (!dept.getDepartmentCode().equals(request.getDepartmentCode())
                && departmentRepository.existsByDepartmentCode(request.getDepartmentCode())) {
            throw new DuplicateResourceException("Department code already in use");
        }
        dept.setDepartmentCode(request.getDepartmentCode());
        dept.setDepartmentName(request.getDepartmentName());
        dept.setDescription(request.getDescription());
        return toResponse(departmentRepository.save(dept));
    }

    @Transactional
    public void delete(Long id) {
        departmentRepository.delete(findById(id));
    }

    private Department findById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
    }

    private DepartmentDto.Response toResponse(Department dept) {
        DepartmentDto.Response r = new DepartmentDto.Response();
        r.setId(dept.getId());
        r.setDepartmentCode(dept.getDepartmentCode());
        r.setDepartmentName(dept.getDepartmentName());
        r.setDescription(dept.getDescription());
        r.setCreatedAt(dept.getCreatedAt());
        r.setUpdatedAt(dept.getUpdatedAt());
        return r;
    }
}
