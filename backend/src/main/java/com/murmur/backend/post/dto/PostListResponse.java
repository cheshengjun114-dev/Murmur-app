package com.murmur.backend.post.dto;

import com.murmur.backend.post.Post;
import java.time.LocalDateTime;

public record PostListResponse(
        Long id,
        String title,
        String categoryName,
        long viewCount,
        long commentCount,
        long reactionCount,
        LocalDateTime createdAt
) {

    public static PostListResponse from(Post post) {
        return new PostListResponse(
                post.getId(),
                post.getTitle(),
                post.getCategory().getName(),
                post.getViewCount(),
                0L,
                0L,
                post.getCreatedAt()
        );
    }
}
