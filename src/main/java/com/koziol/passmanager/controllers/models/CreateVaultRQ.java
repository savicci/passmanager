package com.koziol.passmanager.controllers.models;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class CreateVaultRQ {
    private String vaultName;
    private String vaultData;
    private String encryptedVaultKey;
}
