package com.studentmanagement.repository;

import com.studentmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByAccountStatus(User.AccountStatus accountStatus);
    List<User> findByRole(User.Role role);
    List<User> findByAccountStatusAndRole(User.AccountStatus accountStatus, User.Role role);
    long countByAccountStatus(User.AccountStatus accountStatus);
}

