package com.murmur.backend.bookmark;

import com.murmur.backend.auth.security.CustomUserDetails;
import com.murmur.backend.bookmark.dto.BookmarkToggleResponse;
import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.common.response.ApiResponse;
import com.murmur.backend.post.dto.PostListResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping("/api/posts/{postId}/bookmark")
    public ApiResponse<BookmarkToggleResponse> toggleBookmark(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.ok(bookmarkService.toggleBookmark(postId, getUserId(userDetails)));
    }

    @GetMapping("/api/me/bookmarks")
    public ApiResponse<Page<PostListResponse>> getMyBookmarks(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ApiResponse.ok(bookmarkService.getMyBookmarks(getUserId(userDetails), pageable));
    }

    private Long getUserId(CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new BusinessException(ErrorCode.LOGIN_REQUIRED);
        }

        return userDetails.getUserId();
    }
}
