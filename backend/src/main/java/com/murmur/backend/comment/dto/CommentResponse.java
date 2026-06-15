package com.murmur.backend.comment.dto;

import com.murmur.backend.comment.Comment;
import java.time.LocalDateTime;
import java.util.List;

public record CommentResponse(
        Long id,
        String content,
        String authorAnonymousName,
        boolean mine,
        boolean blinded,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<CommentResponse> replies
) {

    private static final String BLINDED_CONTENT = "신고로 인해 숨겨진 댓글입니다.";

    public static CommentResponse from(
            Comment comment,
            String authorAnonymousName,
            boolean mine,
            List<CommentResponse> replies
    ) {
        return new CommentResponse(
                comment.getId(),
                comment.isBlinded() ? BLINDED_CONTENT : comment.getContent(),
                authorAnonymousName,
                mine,
                comment.isBlinded(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                replies
        );
    }
}
