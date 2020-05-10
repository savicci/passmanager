package com.koziol.passmanager.database.repositories;

import com.koziol.passmanager.database.models.VaultUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VaultUserRepository extends JpaRepository<VaultUser, Long> {
    List<VaultUser> findAllByVaultUserId(long userId);
}
