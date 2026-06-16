package com.murmur.backend.report;

import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.post.Post;
import com.murmur.backend.post.PostRepository;
import com.murmur.backend.report.dto.AdminReportActionResponse;
import com.murmur.backend.report.dto.AdminReportDetailResponse;
import com.murmur.backend.report.dto.AdminReportedPostResponse;
import com.murmur.backend.report.dto.ReportCreateRequest;
import com.murmur.backend.report.dto.ReportCreateResponse;
import com.murmur.backend.user.User;
import com.murmur.backend.user.UserRepository;
import com.murmur.backend.user.UserRole;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private static final int POST_BLIND_REPORT_THRESHOLD = 5;

    private final ReportRepository reportRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReportCreateResponse reportPost(Long postId, Long reporterId, ReportCreateRequest request) {
        Post post = getPost(postId);
        User reporter = getUser(reporterId);

        if (post.isOwner(reporterId)) {
            throw new BusinessException(ErrorCode.SELF_REPORT_NOT_ALLOWED);
        }

        if (reportRepository.existsByPostIdAndReporterId(postId, reporterId)) {
            throw new BusinessException(ErrorCode.DUPLICATE_REPORT);
        }

        reportRepository.save(Report.create(post, reporter, request.reason()));

        long reportCount = reportRepository.countByPostId(postId);

        if (post.shouldAutoBlind(reportCount, POST_BLIND_REPORT_THRESHOLD)) {
            post.blind();
        }

        return new ReportCreateResponse(post.getId(), reportCount, post.isBlinded());
    }

    @Transactional(readOnly = true)
    public Page<AdminReportedPostResponse> getReportedPosts(Long adminUserId, boolean blindedOnly, Pageable pageable) {
        requireAdmin(adminUserId);
        return reportRepository.findReportedPosts(blindedOnly, pageable);
    }

    @Transactional(readOnly = true)
    public List<AdminReportDetailResponse> getReportDetails(Long postId, Long adminUserId) {
        requireAdmin(adminUserId);
        getPost(postId);
        return reportRepository.findReportDetailsByPostId(postId);
    }

    @Transactional
    public AdminReportActionResponse blindPost(Long postId, Long adminUserId) {
        requireAdmin(adminUserId);
        Post post = getPost(postId);

        post.blind();

        return new AdminReportActionResponse(post.getId(), post.isBlinded(), false, "게시글을 숨김 처리했습니다.");
    }

    @Transactional
    public AdminReportActionResponse unblindPost(Long postId, Long adminUserId) {
        requireAdmin(adminUserId);
        Post post = getPost(postId);
        long reportCount = reportRepository.countByPostId(postId);

        post.unblindAfterReview(reportCount);

        return new AdminReportActionResponse(post.getId(), post.isBlinded(), false, "게시글 숨김 처리를 해제했습니다.");
    }

    @Transactional
    public AdminReportActionResponse deleteReportedPost(Long postId, Long adminUserId) {
        requireAdmin(adminUserId);
        Post post = getPost(postId);

        post.softDelete();

        return new AdminReportActionResponse(post.getId(), post.isBlinded(), true, "게시글을 삭제 처리했습니다.");
    }

    private Post getPost(Long postId) {
        return postRepository.findActiveById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    private void requireAdmin(Long userId) {
        User user = getUser(userId);

        if (user.getRole() != UserRole.ADMIN) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
    }
}
