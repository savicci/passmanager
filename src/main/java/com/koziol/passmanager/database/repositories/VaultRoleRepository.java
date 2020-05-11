package com.koziol.passmanager.database.repositories;

import com.koziol.passmanager.database.models.VaultRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VaultRoleRepository extends JpaRepository<VaultRole, Long> {
    public Optional<VaultRole> findByRoleName(String roleName);
}
