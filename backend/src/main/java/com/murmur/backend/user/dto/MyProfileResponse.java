package com.murmur.backend.user.dto;

import com.murmur.backend.user.User;
import com.murmur.backend.user.UserRole;
import java.time.LocalDateTime;

public record MyProfileResponse(
        Long userId,
        String email,
        String nickname,
        UserRole role,
        long postCount,
        long commentCount,
        long bookmarkCount,
        LocalDateTime createdAt
) {

    public static MyProfileResponse from(
            User user,
            long postCount,
            long commentCount,
            long bookmarkCount
    ) {
        return new MyProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getRole(),
                postCount,
                commentCount,
                bookmarkCount,
                user.getCreatedAt()
        );
    }
}
