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
        long popularScore,
        LocalDateTime createdAt
) {

    private static final int COMMENT_SCORE_WEIGHT = 3;
    private static final int REACTION_SCORE_WEIGHT = 2;

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
                calculatePopularScore(post, commentCount, reactionCount),
                post.getCreatedAt()
        );
    }

    private static long calculatePopularScore(Post post, long commentCount, long reactionCount) {
        return post.getViewCount()
                + (commentCount * COMMENT_SCORE_WEIGHT)
                + (reactionCount * REACTION_SCORE_WEIGHT);
    }
}
