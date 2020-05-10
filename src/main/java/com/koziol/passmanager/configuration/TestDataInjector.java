package com.koziol.passmanager.configuration;

import com.koziol.passmanager.database.models.User;
import com.koziol.passmanager.database.models.VaultRole;
import com.koziol.passmanager.database.repositories.UserRepository;
import com.koziol.passmanager.database.repositories.VaultRoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class TestDataInjector {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VaultRoleRepository vaultRoleRepository;

    public TestDataInjector(PasswordEncoder passwordEncoder, UserRepository userRepository, VaultRoleRepository vaultRoleRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.vaultRoleRepository = vaultRoleRepository;
    }

    @Bean
    CommandLineRunner injectData() {
        return args -> {
            // user
            User user = new User("user", passwordEncoder.encode("password"), "private".getBytes(), "public".getBytes());
            userRepository.save(user);

            // vault roles
            vaultRoleRepository.save(new VaultRole("CREATOR"));
            vaultRoleRepository.save(new VaultRole("EDITOR"));
            vaultRoleRepository.save(new VaultRole("VIEWER"));
        };
    }
}
