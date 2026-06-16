package com.murmur.backend.report.dto;

public record AdminReportActionResponse(
        Long postId,
        boolean blinded,
        boolean deleted,
        String message
) {
}
