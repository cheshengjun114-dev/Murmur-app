package com.murmur.backend.auth;

import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final String REFRESH_TOKEN_PREFIX = "refreshToken:";

    private final StringRedisTemplate redisTemplate;

    public void save(Long userId, String refreshToken, long expirationMs) {
        redisTemplate.opsForValue().set(buildKey(userId), refreshToken, Duration.ofMillis(expirationMs));
    }

    public boolean matches(Long userId, String refreshToken) {
        String savedToken = redisTemplate.opsForValue().get(buildKey(userId));
        return refreshToken.equals(savedToken);
    }

    public void delete(Long userId) {
        redisTemplate.delete(buildKey(userId));
    }

    private String buildKey(Long userId) {
        return REFRESH_TOKEN_PREFIX + userId;
    }
}
