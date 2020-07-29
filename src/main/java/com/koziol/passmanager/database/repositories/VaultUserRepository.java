package com.koziol.passmanager.database.repositories;

import com.koziol.passmanager.database.models.VaultUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VaultUserRepository extends JpaRepository<VaultUser, Long> {
    List<VaultUser> findAllByVaultUserId(long userId);

    Optional<VaultUser> findByUserUserIdAndVaultVaultId(String userId, long vaultId);
}
