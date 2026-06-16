package com.murmur.backend.auth;

import com.murmur.backend.auth.dto.LoginRequest;
import com.murmur.backend.auth.dto.SignupRequest;
import com.murmur.backend.auth.dto.TokenResponse;
import com.murmur.backend.auth.security.JwtTokenProvider;
import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.common.exception.ErrorCode;
import com.murmur.backend.user.User;
import com.murmur.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }

        User user = User.createUser(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.nickname()
        );

        userRepository.save(user);
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_LOGIN));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_LOGIN);
        }

        return issueTokens(user);
    }

    @Transactional
    public TokenResponse refresh(String refreshToken) {
        jwtTokenProvider.validateToken(refreshToken);
        Long userId = jwtTokenProvider.getUserId(refreshToken);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!refreshTokenService.matches(userId, refreshToken)) {
            throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        return issueTokens(user);
    }

    public void logout(String refreshToken) {
        jwtTokenProvider.validateToken(refreshToken);
        Long userId = jwtTokenProvider.getUserId(refreshToken);
        refreshTokenService.delete(userId);
    }

    private TokenResponse issueTokens(User user) {
        String accessToken;
        String refreshToken;

        try {
            accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getRole());
            refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getRole());
        } catch (RuntimeException exception) {
            log.error("JWT 토큰 발급에 실패했습니다. userId={}", user.getId(), exception);
            throw new BusinessException(ErrorCode.TOKEN_ISSUE_FAILED);
        }

        try {
            refreshTokenService.save(user.getId(), refreshToken, jwtTokenProvider.getRefreshTokenExpirationMs());
        } catch (DataAccessException exception) {
            log.error("Refresh Token Redis 저장에 실패했습니다. userId={}", user.getId(), exception);
            throw new BusinessException(ErrorCode.REDIS_UNAVAILABLE);
        }

        return TokenResponse.bearer(accessToken, refreshToken, jwtTokenProvider.getAccessTokenExpirationMs());
    }
}
