package com.koziol.passmanager.configuration;

import com.koziol.passmanager.database.models.VaultRole;
import com.koziol.passmanager.database.repositories.UserRepository;
import com.koziol.passmanager.database.repositories.VaultRepository;
import com.koziol.passmanager.database.repositories.VaultRoleRepository;
import com.koziol.passmanager.database.repositories.VaultUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class TestDataInjector {
    private final VaultRoleRepository vaultRoleRepository;

    public TestDataInjector(VaultRoleRepository vaultRoleRepository) {
        this.vaultRoleRepository = vaultRoleRepository;
    }

    @Bean
    @Profile("dev")
    CommandLineRunner injectData() {
        return args -> {
            vaultRoleRepository.save(new VaultRole("CREATOR"));
            vaultRoleRepository.save(new VaultRole("ADMIN"));
            vaultRoleRepository.save(new VaultRole("EDITOR"));
            vaultRoleRepository.save(new VaultRole("VIEWER"));
        };
    }
}
