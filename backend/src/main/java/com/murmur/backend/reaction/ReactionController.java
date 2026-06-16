package com.murmur.backend.reaction;

import com.murmur.backend.auth.security.CustomUserDetails;
import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.common.response.ApiResponse;
import com.murmur.backend.reaction.dto.ReactionSummaryResponse;
import com.murmur.backend.reaction.dto.ReactionToggleRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts/{postId}/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    @PostMapping
    public ApiResponse<ReactionSummaryResponse> toggleReaction(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ReactionToggleRequest request
    ) {
        return ApiResponse.ok(reactionService.toggleReaction(postId, getUserId(userDetails), request.reactionType()));
    }

    @GetMapping
    public ApiResponse<ReactionSummaryResponse> getReactionSummary(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long currentUserId = userDetails == null ? null : userDetails.getUserId();
        return ApiResponse.ok(reactionService.getReactionSummary(postId, currentUserId));
    }

    private Long getUserId(CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new BusinessException(ErrorCode.LOGIN_REQUIRED);
        }

        return userDetails.getUserId();
    }
}
