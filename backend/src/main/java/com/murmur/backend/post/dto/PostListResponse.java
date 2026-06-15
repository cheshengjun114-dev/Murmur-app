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
        return from(post, 0L, 0L);
    }

    public static PostListResponse from(Post post, long commentCount, long reactionCount) {
        return new PostListResponse(
                post.getId(),
                post.getTitle(),
                post.getCategory().getName(),
                post.getViewCount(),
                commentCount,
                reactionCount,
                post.getCreatedAt()
        );
    }
}
