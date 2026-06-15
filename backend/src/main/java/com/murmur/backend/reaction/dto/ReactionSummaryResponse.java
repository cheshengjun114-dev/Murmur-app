package com.murmur.backend.reaction.dto;

import java.util.List;

public record ReactionSummaryResponse(
        long totalCount,
        List<ReactionCountResponse> reactions
) {
}
