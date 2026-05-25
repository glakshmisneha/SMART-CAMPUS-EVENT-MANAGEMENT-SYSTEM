package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDepartmentContainingIgnoreCaseOrTypeContainingIgnoreCase(String department, String type);
    List<Event> findByDateAfter(LocalDate date);

    @Query("SELECT e FROM Event e WHERE " +
           "(:name IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:date IS NULL OR e.date = :date) AND " +
           "(:department IS NULL OR LOWER(e.department) LIKE LOWER(CONCAT('%', :department, '%')))")
    List<Event> searchEvents(@Param("name") String name, @Param("date") LocalDate date, @Param("department") String department);
}
