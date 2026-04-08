package com.snippethub.repository;

import com.snippethub.entity.ShareLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ShareLinkRepository extends JpaRepository<ShareLink, Long> {
    Optional<ShareLink> findByToken(String token);
    List<ShareLink> findBySnippetId(Long snippetId);
}
