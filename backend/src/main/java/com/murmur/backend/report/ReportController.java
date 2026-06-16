package com.murmur.backend.report;

import com.murmur.backend.auth.security.CustomUserDetails;
import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.common.response.ApiResponse;
import com.murmur.backend.report.dto.AdminReportActionResponse;
import com.murmur.backend.report.dto.AdminReportDetailResponse;
import com.murmur.backend.report.dto.AdminReportedPostResponse;
import com.murmur.backend.report.dto.ReportCreateRequest;
import com.murmur.backend.report.dto.ReportCreateResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/api/admin/reports/posts")
    public ApiResponse<Page<AdminReportedPostResponse>> getReportedPosts(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "false") boolean blindedOnly,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return ApiResponse.ok(reportService.getReportedPosts(getUserId(userDetails), blindedOnly, pageable));
    }

    @GetMapping("/api/admin/reports/posts/{postId}")
    public ApiResponse<List<AdminReportDetailResponse>> getReportDetails(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.ok(reportService.getReportDetails(postId, getUserId(userDetails)));
    }

    @PatchMapping("/api/admin/reports/posts/{postId}/blind")
    public ApiResponse<AdminReportActionResponse> blindPost(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.ok(reportService.blindPost(postId, getUserId(userDetails)));
    }

    @PatchMapping("/api/admin/reports/posts/{postId}/unblind")
    public ApiResponse<AdminReportActionResponse> unblindPost(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.ok(reportService.unblindPost(postId, getUserId(userDetails)));
    }

    @DeleteMapping("/api/admin/reports/posts/{postId}")
    public ApiResponse<AdminReportActionResponse> deleteReportedPost(
            @PathVariable Long postId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ApiResponse.ok(reportService.deleteReportedPost(postId, getUserId(userDetails)));
    }

    private Long getUserId(CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new BusinessException(ErrorCode.LOGIN_REQUIRED);
        }

        return userDetails.getUserId();
    }
}
