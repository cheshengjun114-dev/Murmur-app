package com.murmur.backend.report;

import com.murmur.backend.report.dto.AdminReportDetailResponse;
import com.murmur.backend.report.dto.AdminReportedPostResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<Report, Long> {

    boolean existsByPostIdAndReporterId(Long postId, Long reporterId);

    long countByPostId(Long postId);

    @Query(
            value = """
                    select new com.murmur.backend.report.dto.AdminReportedPostResponse(
                        p.id,
                        p.title,
                        p.content,
                        c.name,
                        count(r),
                        p.blinded,
                        author.id,
                        author.email,
                        author.nickname,
                        p.createdAt,
                        max(r.createdAt)
                    )
                    from Report r
                    join r.post p
                    join p.category c
                    join p.user author
                    where p.deletedAt is null
                      and (:blindedOnly = false or p.blinded = true)
                    group by p.id, p.title, p.content, c.name, p.blinded,
                             author.id, author.email, author.nickname, p.createdAt
                    order by max(r.createdAt) desc
                    """,
            countQuery = """
                    select count(distinct p.id)
                    from Report r
                    join r.post p
                    where p.deletedAt is null
                      and (:blindedOnly = false or p.blinded = true)
                    """
    )
    Page<AdminReportedPostResponse> findReportedPosts(
            @Param("blindedOnly") boolean blindedOnly,
            Pageable pageable
    );

    @Query("""
            select new com.murmur.backend.report.dto.AdminReportDetailResponse(
                r.id,
                reporter.id,
                reporter.email,
                reporter.nickname,
                r.reason,
                r.createdAt
            )
            from Report r
            join r.reporter reporter
            where r.post.id = :postId
            order by r.createdAt desc
            """)
    List<AdminReportDetailResponse> findReportDetailsByPostId(@Param("postId") Long postId);
}
