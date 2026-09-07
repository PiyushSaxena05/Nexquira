package com.Nexquira.SR;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Table(name = "research_notes")
@Data
public class ResearchNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String sourceContent;

    @Column(columnDefinition = "TEXT")
    private String aiSummary;

    private String sourceUrl;

    private String operation; 

    private Instant createdAt = Instant.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
