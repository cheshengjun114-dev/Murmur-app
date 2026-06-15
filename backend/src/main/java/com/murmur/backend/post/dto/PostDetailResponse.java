package com.murmur.backend.post.dto;

import com.murmur.backend.post.Post;
import java.time.LocalDateTime;

public record PostDetailResponse(
        Long id,
        String title,
        String content,
        String categoryName,
        long viewCount,
        long commentCount,
        long reactionCount,
        boolean blinded,
        boolean authorAnonymous,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    private static final String BLINDED_CONTENT = "신고로 인해 숨겨진 글입니다.";

    public static PostDetailResponse from(Post post, Long currentUserId) {
        return from(post, currentUserId, 0L, 0L);
    }

    public static PostDetailResponse from(Post post, Long currentUserId, long commentCount, long reactionCount) {
        return new PostDetailResponse(
                post.getId(),
                post.getTitle(),
                post.isBlinded() ? BLINDED_CONTENT : post.getContent(),
                post.getCategory().getName(),
                post.getViewCount(),
                commentCount,
                reactionCount,
                post.isBlinded(),
                currentUserId != null && post.isOwner(currentUserId),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
