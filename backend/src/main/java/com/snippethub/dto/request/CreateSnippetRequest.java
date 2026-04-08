package com.snippethub.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class CreateSnippetRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    @NotBlank(message = "Code is required")
    private String code;
    @NotBlank(message = "Language is required")
    private String language;
    private String visibility = "PRIVATE";
    private Set<String> tags;
}
