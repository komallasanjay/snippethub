package com.snippethub.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCollectionRequest {
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    @com.fasterxml.jackson.annotation.JsonProperty("isPublic")
    private boolean isPublic = false;
}
