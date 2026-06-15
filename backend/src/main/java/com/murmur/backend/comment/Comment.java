package com.murmur.backend.comment;

import com.murmur.backend.common.entity.BaseTimeEntity;
import com.murmur.backend.post.Post;
import com.murmur.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

@Getter
@Entity
@DynamicUpdate
@Table(name = "comments")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(nullable = false)
    private boolean blinded;

    private LocalDateTime deletedAt;

    private Comment(Post post, User user, Comment parentComment, String content) {
        this.post = post;
        this.user = user;
        this.parentComment = parentComment;
        this.content = content;
        this.blinded = false;
    }

    public static Comment create(Post post, User user, Comment parentComment, String content) {
        return new Comment(post, user, parentComment, content);
    }

    public void update(String content) {
        this.content = content;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public boolean isDeleted() {
        return deletedAt != null;
    }

    public boolean isReply() {
        return parentComment != null;
    }

    public boolean isOwner(Long userId) {
        return user.getId().equals(userId);
    }
}
