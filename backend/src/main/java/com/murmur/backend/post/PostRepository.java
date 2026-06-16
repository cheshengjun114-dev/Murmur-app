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
    @Query(
            value = """
                    select p
                    from Post p
                    left join Comment c on c.post = p and c.deletedAt is null
                    left join Reaction r on r.post = p
                    where p.deletedAt is null
                      and p.blinded = false
                      and (:categoryId is null or p.category.id = :categoryId)
                    group by p
                    order by (p.viewCount + count(distinct c.id) * 3 + count(distinct r.id) * 2) desc,
                             p.createdAt desc
                    """,
            countQuery = """
                    select count(p)
                    from Post p
                    where p.deletedAt is null
                      and p.blinded = false
                      and (:categoryId is null or p.category.id = :categoryId)
                    """
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
