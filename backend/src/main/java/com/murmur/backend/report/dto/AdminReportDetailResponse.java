package com.murmur.backend.report.dto;

import java.time.LocalDateTime;

public record AdminReportDetailResponse(
        Long reportId,
        Long reporterId,
        String reporterEmail,
        String reporterNickname,
        String reason,
        LocalDateTime reportedAt
) {
}
