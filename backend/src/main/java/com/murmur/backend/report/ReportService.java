package com.murmur.backend.report;

import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.post.Post;
import com.murmur.backend.post.PostRepository;
import com.murmur.backend.report.dto.ReportCreateRequest;
import com.murmur.backend.report.dto.ReportCreateResponse;
import com.murmur.backend.user.User;
import com.murmur.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
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

        if (reportCount >= POST_BLIND_REPORT_THRESHOLD) {
            post.blind();
        }

        return new ReportCreateResponse(post.getId(), reportCount, post.isBlinded());
    }

    private Post getPost(Long postId) {
        return postRepository.findActiveById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }
}
