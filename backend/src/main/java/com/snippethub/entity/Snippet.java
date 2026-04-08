package com.snippethub.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "snippets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Snippet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true, length = 36)
    private String publicId;

    @PrePersist
    public void prePersist() {
        if (this.publicId == null) {
            this.publicId = java.util.UUID.randomUUID().toString();
        }
    }

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;

    @Column(nullable = false, length = 50)
    private String language;

    @Column(length = 20)
    private String visibility; // PUBLIC, PRIVATE, UNLISTED

    @Column(name = "view_count", columnDefinition = "BIGINT DEFAULT 0")
    private Long viewCount = 0L;

    @Column(name = "copy_count", columnDefinition = "BIGINT DEFAULT 0")
    private Long copyCount = 0L;

    @Column(name = "star_count", columnDefinition = "BIGINT DEFAULT 0")
    private Long starCount = 0L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToMany
    @JoinTable(
        name = "snippet_tags",
        joinColumns = @JoinColumn(name = "snippet_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
