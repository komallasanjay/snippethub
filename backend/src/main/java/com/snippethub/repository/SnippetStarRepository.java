package com.snippethub.repository;

import com.snippethub.entity.SnippetStar;
import com.snippethub.entity.SnippetStarId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface SnippetStarRepository extends JpaRepository<SnippetStar, SnippetStarId> {
    boolean existsById(SnippetStarId id);
    Page<SnippetStar> findByUserId(Long userId, Pageable pageable);
}
