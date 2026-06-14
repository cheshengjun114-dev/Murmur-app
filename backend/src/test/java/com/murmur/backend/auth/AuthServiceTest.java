package com.murmur.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.murmur.backend.auth.dto.LoginRequest;
import com.murmur.backend.auth.dto.SignupRequest;
import com.murmur.backend.auth.dto.TokenResponse;
import com.murmur.backend.common.exception.BusinessException;
import com.murmur.backend.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private RefreshTokenService refreshTokenService;

    @Test
    void signupCreatesUser() {
        SignupRequest request = new SignupRequest("signup@test.com", "password123", "테스터");

        authService.signup(request);

        assertThat(userRepository.existsByEmail("signup@test.com")).isTrue();
    }

    @Test
    void signupRejectsDuplicateEmail() {
        SignupRequest request = new SignupRequest("duplicate@test.com", "password123", "테스터");
        authService.signup(request);

        assertThatThrownBy(() -> authService.signup(request))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void loginIssuesTokens() {
        authService.signup(new SignupRequest("login@test.com", "password123", "테스터"));

        TokenResponse response = authService.login(new LoginRequest("login@test.com", "password123"));

        assertThat(response.accessToken()).isNotBlank();
        assertThat(response.refreshToken()).isNotBlank();
        assertThat(response.tokenType()).isEqualTo("Bearer");
    }
}
