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
        return new PostDetailResponse(
                post.getId(),
                post.getTitle(),
                post.isBlinded() ? BLINDED_CONTENT : post.getContent(),
                post.getCategory().getName(),
                post.getViewCount(),
                0L,
                0L,
                post.isBlinded(),
                currentUserId != null && post.isOwner(currentUserId),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
