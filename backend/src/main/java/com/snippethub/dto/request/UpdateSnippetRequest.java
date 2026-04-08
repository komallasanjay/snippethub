package com.snippethub.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class UpdateSnippetRequest {
    private String title;
    private String description;
    private String code;
    private String language;
    private String visibility;
    private Set<String> tags;
}
