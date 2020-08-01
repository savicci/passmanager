package com.koziol.passmanager.configuration;

import com.koziol.passmanager.database.models.VaultRole;
import com.koziol.passmanager.database.repositories.VaultRoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class DataInjector {
    private final VaultRoleRepository vaultRoleRepository;

    public DataInjector(VaultRoleRepository vaultRoleRepository) {
        this.vaultRoleRepository = vaultRoleRepository;
    }

    @Bean
    CommandLineRunner injectData() {
        return args -> {
            if (vaultRoleRepository.findByRoleName("CREATOR").isEmpty()) {
                vaultRoleRepository.save(new VaultRole("CREATOR"));
                vaultRoleRepository.save(new VaultRole("ADMIN"));
                vaultRoleRepository.save(new VaultRole("EDITOR"));
                vaultRoleRepository.save(new VaultRole("VIEWER"));
            }
        };
    }
}
