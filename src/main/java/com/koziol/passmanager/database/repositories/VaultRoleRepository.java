package com.koziol.passmanager.database.repositories;

import com.koziol.passmanager.database.models.VaultRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaultRoleRepository extends JpaRepository<VaultRole, Long> {
    public VaultRole findByRoleName(String roleName);
}
