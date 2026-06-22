package com.murmur.backend.post;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostRepository extends JpaRepository<Post, Long> {

    @EntityGraph(attributePaths = {"user", "category"})
    @Query("""
            select p
            from Post p
            where p.deletedAt is null
              and (:categoryId is null or p.category.id = :categoryId)
            """)
    Page<Post> findPosts(@Param("categoryId") Long categoryId, Pageable pageable);

    @EntityGraph(attributePaths = {"category"})
    @Query("""
            select p
            from Post p
            where p.user.id = :userId
              and p.deletedAt is null
            order by p.createdAt desc
            """)
    Page<Post> findActivePostsByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("""
            select count(p)
            from Post p
            where p.user.id = :userId
              and p.deletedAt is null
            """)
    long countActivePostsByUserId(@Param("userId") Long userId);

    @Query(
            value = """
                    select p.*
                    from posts p
                    where p.deleted_at is null
                      and p.blinded = false
                      and (:categoryId is null or p.category_id = :categoryId)
                    order by (
                        p.view_count
                        + (
                            select count(*)
                            from comments c
                            where c.post_id = p.id
                              and c.deleted_at is null
                        ) * 3
                        + (
                            select count(*)
                            from reactions r
                            where r.post_id = p.id
                        ) * 2
                    ) desc,
                    p.created_at desc
                    """,
            countQuery = """
                    select count(*)
                    from posts p
                    where p.deleted_at is null
                      and p.blinded = false
                      and (:categoryId is null or p.category_id = :categoryId)
                    """,
            nativeQuery = true
    )
    Page<Post> findPopularPosts(@Param("categoryId") Long categoryId, Pageable pageable);

    @EntityGraph(attributePaths = {"user", "category"})
    @Query("""
            select p
            from Post p
            where p.id = :postId
              and p.deletedAt is null
            """)
    Optional<Post> findActiveById(@Param("postId") Long postId);
}
