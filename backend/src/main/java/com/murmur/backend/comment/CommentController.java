package com.murmur.backend.comment;

import com.murmur.backend.auth.security.CustomUserDetails;
import com.murmur.backend.comment.dto.CommentCreateRequest;
import com.murmur.backend.comment.dto.CommentCreateResponse;
import com.murmur.backend.comment.dto.CommentResponse;
import com.murmur.backend.comment.dto.CommentUpdateRequest;
import com.murmur.backend.common.response.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/api/posts/{postId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CommentCreateResponse> createComment(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CommentCreateRequest request
    ) {
        return ApiResponse.ok(commentService.createComment(postId, userDetails.getUserId(), request));
    }

    @GetMapping("/api/posts/{postId}/comments")
    public ApiResponse<List<CommentResponse>> getComments(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long currentUserId = userDetails == null ? null : userDetails.getUserId();
        return ApiResponse.ok(commentService.getComments(postId, currentUserId));
    }

    @PatchMapping("/api/comments/{commentId}")
    public ApiResponse<Void> updateComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CommentUpdateRequest request
    ) {
        commentService.updateComment(commentId, userDetails.getUserId(), request);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/api/comments/{commentId}")
    public ApiResponse<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        commentService.deleteComment(commentId, userDetails.getUserId());
        return ApiResponse.ok(null);
    }
}
