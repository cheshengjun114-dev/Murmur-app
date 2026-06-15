package com.murmur.backend.reaction.dto;

import com.murmur.backend.reaction.ReactionType;

public record ReactionCountResponse(
        ReactionType reactionType,
        String label,
        long count,
        boolean reactedByMe
) {
}
