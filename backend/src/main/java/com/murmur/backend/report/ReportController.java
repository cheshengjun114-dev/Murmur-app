package com.murmur.backend.report;

import com.murmur.backend.auth.security.CustomUserDetails;
import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.common.response.ApiResponse;
import com.murmur.backend.report.dto.ReportCreateRequest;
import com.murmur.backend.report.dto.ReportCreateResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/api/posts/{postId}/report")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ReportCreateResponse> reportPost(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ReportCreateRequest request
    ) {
        return ApiResponse.ok(reportService.reportPost(postId, getUserId(userDetails), request));
    }

    private Long getUserId(CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new BusinessException(ErrorCode.LOGIN_REQUIRED);
        }

        return userDetails.getUserId();
    }
}
