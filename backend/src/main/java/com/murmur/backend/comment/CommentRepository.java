package com.murmur.backend.comment;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @EntityGraph(attributePaths = {"user", "post", "parentComment"})
    @Query("""
            select c
            from Comment c
            where c.post.id = :postId
              and c.deletedAt is null
            order by c.createdAt asc
            """)
    List<Comment> findActiveCommentsByPostId(@Param("postId") Long postId);

    @EntityGraph(attributePaths = {"user", "post", "parentComment"})
    @Query("""
            select c
            from Comment c
            where c.id = :commentId
              and c.deletedAt is null
            """)
    Optional<Comment> findActiveById(@Param("commentId") Long commentId);

    long countByPostIdAndDeletedAtIsNull(Long postId);
}
