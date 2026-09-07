package com.Nexquira.SR;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResearchNoteRepository extends JpaRepository<ResearchNote, Long> {
    List<ResearchNote> findByUserOrderByCreatedAtDesc(User user);
}
