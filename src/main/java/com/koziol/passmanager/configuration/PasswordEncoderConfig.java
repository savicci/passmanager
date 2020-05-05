package com.koziol.passmanager.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;

@Configuration
@PropertySource("classpath:/application.properties")
public class PasswordEncoderConfig {
    @Value("${password.encryption.secret}")
    private String secret;

    @Value("${password.encryption.iterations}")
    private String iterations;

    @Value("${password.encryption.hashSize}")
    private String hashSize;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Pbkdf2PasswordEncoder(secret, Integer.parseInt(iterations), Integer.parseInt(hashSize));
    }
}