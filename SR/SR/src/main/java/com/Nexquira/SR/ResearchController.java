package com.Nexquira.SR;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/research")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ResearchController {

    private final ResearchService researchService;
    private final ResearchNoteRepository noteRepository;
    private final UserRepository userRepository;

    @PostMapping("/process")
    public ResponseEntity<String> processContent(@RequestBody ResearchRequest request,
                                                 Authentication authentication) {
        String result = researchService.processContent(request);

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        ResearchNote note = new ResearchNote();
        note.setSourceContent(request.getContent());
        note.setAiSummary(result);
        note.setOperation(request.getOperation());
        note.setUser(user);

        noteRepository.save(note);

        return ResponseEntity.ok(result);
    }
}
