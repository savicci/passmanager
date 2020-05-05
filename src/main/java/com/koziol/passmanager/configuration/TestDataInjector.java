package com.koziol.passmanager.configuration;

import com.koziol.passmanager.database.models.User;
import com.koziol.passmanager.database.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class TestDataInjector {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public TestDataInjector(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Bean
    CommandLineRunner injectData() {
        return args -> {
            User user = new User("user", passwordEncoder.encode("password"), "private".getBytes(), "public".getBytes());
            userRepository.save(user);
        };
    }
}
