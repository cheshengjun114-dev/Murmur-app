package com.murmur.backend.reaction.dto;

import com.murmur.backend.reaction.ReactionType;
import jakarta.validation.constraints.NotNull;

public record ReactionToggleRequest(
        @NotNull(message = "반응 타입은 필수입니다.")
        ReactionType reactionType
) {
}
