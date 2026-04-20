package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDepartmentContainingIgnoreCaseOrTypeContainingIgnoreCase(String department, String type);
    List<Event> findByDateAfter(LocalDate date);
}
