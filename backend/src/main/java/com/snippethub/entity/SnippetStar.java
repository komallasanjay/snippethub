package com.snippethub.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "snippet_stars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SnippetStar {

    @EmbeddedId
    private SnippetStarId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("snippetId")
    @JoinColumn(name = "snippet_id")
    private Snippet snippet;

    @CreationTimestamp
    @Column(name = "starred_at", updatable = false)
    private LocalDateTime starredAt;
}
