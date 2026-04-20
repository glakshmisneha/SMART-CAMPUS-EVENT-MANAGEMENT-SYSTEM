package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudentEmail(String studentEmail);
    long countByEventId(Long eventId);
    boolean existsByEventIdAndStudentEmail(Long eventId, String studentEmail);
}
