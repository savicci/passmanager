package com.koziol.passmanager.controllers.models;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
public class VaultRS {
    private String vaultName;
    private String encryptedVaultKey;
    private String vaultData;
    private String createdBy;
    private String modifiedBy;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private String role;
}
