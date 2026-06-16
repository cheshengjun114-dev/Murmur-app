package com.murmur.backend.report.dto;

public record ReportCreateResponse(
        Long postId,
        long reportCount,
        boolean blinded
) {
}
