package com.koziol.passmanager.database.repositories;

import com.koziol.passmanager.database.models.Vault;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaultRepository extends JpaRepository<Vault, Long> {
}
