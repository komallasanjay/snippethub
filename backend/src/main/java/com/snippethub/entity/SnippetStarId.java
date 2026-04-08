package com.snippethub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SnippetStarId implements Serializable {
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "snippet_id")
    private Long snippetId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SnippetStarId that = (SnippetStarId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(snippetId, that.snippetId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, snippetId);
    }
}
