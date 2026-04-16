package com.snippethub.repository;

import com.snippethub.entity.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {
    Page<Collection> findByOwnerId(Long ownerId, Pageable pageable);
    Page<Collection> findByIsPublicTrue(Pageable pageable);
}
