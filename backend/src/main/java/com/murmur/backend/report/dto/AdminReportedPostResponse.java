package com.murmur.backend.report.dto;

import java.time.LocalDateTime;

public record AdminReportedPostResponse(
        Long postId,
        String title,
        String content,
        String categoryName,
        Long reportCount,
        boolean blinded,
        Long authorId,
        String authorEmail,
        String authorNickname,
        LocalDateTime postCreatedAt,
        LocalDateTime lastReportedAt
) {
}
