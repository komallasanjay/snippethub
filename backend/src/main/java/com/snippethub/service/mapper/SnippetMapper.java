package com.snippethub.service.mapper;

import com.snippethub.dto.response.SnippetResponse;
import com.snippethub.dto.response.SnippetSummaryResponse;
import com.snippethub.dto.response.UserResponse;
import com.snippethub.entity.Snippet;
import com.snippethub.entity.Tag;
import com.snippethub.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface SnippetMapper {

    @Mapping(target = "id", source = "publicId")
    @Mapping(target = "tags", source = "tags", qualifiedByName = "mapTagsToStrings")
    SnippetResponse toSnippetResponse(Snippet snippet);

    @Mapping(target = "id", source = "publicId")
    @Mapping(target = "tags", source = "tags", qualifiedByName = "mapTagsToStrings")
    SnippetSummaryResponse toSnippetSummaryResponse(Snippet snippet);

    UserResponse toUserResponse(User user);

    @Named("mapTagsToStrings")
    default Set<String> mapTagsToStrings(Set<Tag> tags) {
        if (tags == null) return null;
        return tags.stream().map(Tag::getName).collect(Collectors.toSet());
    }
}
