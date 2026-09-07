package com.Nexquira.SR;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final ResearchNoteRepository noteRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ResearchNote>> getMyNotes(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        List<ResearchNote> notes = noteRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(notes);
    }
}
