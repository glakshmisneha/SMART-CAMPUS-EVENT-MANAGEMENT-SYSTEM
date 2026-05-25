package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Event;
import com.smartcampus.backend.model.Registration;
import com.smartcampus.backend.model.Student;
import com.smartcampus.backend.repository.StudentAuthRepository;
import com.smartcampus.backend.repository.EventRepository;
import com.smartcampus.backend.repository.RegistrationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private StudentAuthRepository studentAuthRepository;

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody Student student) {
        if (studentAuthRepository.existsByEmail(student.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        return ResponseEntity.ok(studentAuthRepository.save(student));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> loginStudent(@RequestBody Student loginDetails) {
        Optional<Student> studentOpt = studentAuthRepository.findByEmail(loginDetails.getEmail());
        if (studentOpt.isPresent() && studentOpt.get().getPassword().equals(loginDetails.getPassword())) {
            return ResponseEntity.ok(studentOpt.get());
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    @GetMapping("/events")
    public List<Event> getAllEvents(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String type) {
        
        if (department != null && !department.isEmpty() || type != null && !type.isEmpty()) {
            return eventRepository.findByDepartmentContainingIgnoreCaseOrTypeContainingIgnoreCase(
                    department != null ? department : "", 
                    type != null ? type : "");
        }
        return eventRepository.findAll();
    }

    @GetMapping("/events/search")
    public List<Event> searchEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String department) {
        
        java.time.LocalDate searchDate = null;
        if (date != null && !date.trim().isEmpty()) {
            searchDate = java.time.LocalDate.parse(date);
        }
        
        String searchName = (name != null && !name.trim().isEmpty()) ? name.trim() : null;
        String searchDept = (department != null && !department.trim().isEmpty()) ? department.trim() : null;

        return eventRepository.searchEvents(searchName, searchDate, searchDept);
    }

    @PostMapping("/events/{eventId}/register")
    public ResponseEntity<?> registerForEvent(@PathVariable Long eventId, @Valid @RequestBody Registration registration) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (!eventOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Event not found");
        }
        Event event = eventOpt.get();

        if (registrationRepository.existsByEventIdAndStudentEmail(eventId, registration.getStudentEmail())) {
            return ResponseEntity.badRequest().body("You are already registered for this event.");
        }

        long currentRegistrations = registrationRepository.countByEventId(eventId);
        if (currentRegistrations >= event.getCapacity()) {
            return ResponseEntity.badRequest().body("Event is at full capacity.");
        }

        registration.setEvent(event);
        return ResponseEntity.ok(registrationRepository.save(registration));
    }

    @GetMapping("/my-registrations")
    public List<Registration> getMyRegistrations(@RequestParam String email) {
        return registrationRepository.findByStudentEmail(email);
    }
}
