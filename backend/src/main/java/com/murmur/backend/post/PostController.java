package com.murmur.backend.post;

import com.murmur.backend.auth.security.CustomUserDetails;
import com.murmur.backend.common.response.ApiResponse;
import com.murmur.backend.post.dto.PostCreateRequest;
import com.murmur.backend.post.dto.PostCreateResponse;
import com.murmur.backend.post.dto.PostDetailResponse;
import com.murmur.backend.post.dto.PostListResponse;
import com.murmur.backend.post.dto.PostUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PostCreateResponse> createPost(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PostCreateRequest request
    ) {
        return ApiResponse.ok(postService.createPost(userDetails.getUserId(), request));
    }

    @GetMapping
    public ApiResponse<Page<PostListResponse>> getPosts(
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.ok(postService.getPosts(categoryId, pageable));
    }

    @GetMapping("/popular")
    public ApiResponse<Page<PostListResponse>> getPopularPosts(
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 5) Pageable pageable
    ) {
        return ApiResponse.ok(postService.getPopularPosts(categoryId, pageable));
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostDetailResponse> getPost(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long currentUserId = userDetails == null ? null : userDetails.getUserId();
        return ApiResponse.ok(postService.getPost(postId, currentUserId));
    }

    @PatchMapping("/{postId}")
    public ApiResponse<Void> updatePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody PostUpdateRequest request
    ) {
        postService.updatePost(postId, userDetails.getUserId(), request);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        postService.deletePost(postId, userDetails.getUserId());
        return ApiResponse.ok(null);
    }
}
