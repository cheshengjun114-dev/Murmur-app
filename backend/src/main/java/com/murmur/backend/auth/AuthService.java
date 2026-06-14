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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
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

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_LOGIN));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_LOGIN);
        }

        return issueTokens(user);
    }

    @Transactional(readOnly = true)
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
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getRole());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getRole());

        refreshTokenService.save(user.getId(), refreshToken, jwtTokenProvider.getRefreshTokenExpirationMs());

        return TokenResponse.bearer(accessToken, refreshToken, jwtTokenProvider.getAccessTokenExpirationMs());
    }
}
