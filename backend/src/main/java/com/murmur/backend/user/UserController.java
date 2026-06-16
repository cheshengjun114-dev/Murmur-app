package com.murmur.backend.user;

import com.murmur.backend.auth.security.CustomUserDetails;
import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.common.response.ApiResponse;
import com.murmur.backend.post.dto.PostListResponse;
import com.murmur.backend.user.dto.MyProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/api/me")
    public ApiResponse<MyProfileResponse> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.ok(userService.getMyProfile(getUserId(userDetails)));
    }

    @GetMapping("/api/me/posts")
    public ApiResponse<Page<PostListResponse>> getMyPosts(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ApiResponse.ok(userService.getMyPosts(getUserId(userDetails), pageable));
    }

    private Long getUserId(CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new BusinessException(ErrorCode.LOGIN_REQUIRED);
        }

        return userDetails.getUserId();
    }
}
