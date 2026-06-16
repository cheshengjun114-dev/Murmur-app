package com.murmur.backend.bookmark.dto;

public record BookmarkToggleResponse(
        Long postId,
        boolean bookmarked,
        long bookmarkCount
) {
}
