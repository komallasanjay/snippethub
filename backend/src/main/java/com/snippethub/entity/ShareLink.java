package com.snippethub.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "share_links")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShareLink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 36)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "snippet_id", nullable = false)
    private Snippet snippet;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "max_views")
    private Integer maxViews;

    @Column(name = "view_count", columnDefinition = "INT DEFAULT 0")
    private Integer viewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    public void prePersist() {
        if (token == null) {
            token = UUID.randomUUID().toString();
        }
    }
}
