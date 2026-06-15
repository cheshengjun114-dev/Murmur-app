package com.murmur.backend.category.dto;

import com.murmur.backend.category.Category;

public record CategoryResponse(
        Long id,
        String name
) {

    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }
}
