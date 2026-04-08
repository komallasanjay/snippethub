package com.snippethub.service;

import com.snippethub.entity.Tag;
import com.snippethub.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    public Set<Tag> findOrCreateTags(Set<String> tagNames) {
        Set<Tag> tags = new HashSet<>();
        if (tagNames == null || tagNames.isEmpty()) {
            return tags;
        }
        
        for (String name : tagNames) {
            String lowerName = name.toLowerCase().trim();
            Tag tag = tagRepository.findByName(lowerName)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(lowerName).build()));
            tags.add(tag);
        }
        return tags;
    }
}
