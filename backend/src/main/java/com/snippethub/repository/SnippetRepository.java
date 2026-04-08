package com.snippethub.repository;

import com.snippethub.entity.Snippet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SnippetRepository extends JpaRepository<Snippet, Long>, JpaSpecificationExecutor<Snippet> {
    Page<Snippet> findByOwnerId(Long ownerId, Pageable pageable);
    Optional<Snippet> findByPublicId(String publicId);
    Page<Snippet> findByVisibility(String visibility, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT s.language FROM Snippet s WHERE s.language IS NOT NULL ORDER BY s.language ASC")
    java.util.List<String> findDistinctLanguages();
}
