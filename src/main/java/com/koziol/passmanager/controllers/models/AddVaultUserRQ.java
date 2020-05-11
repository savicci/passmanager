package com.koziol.passmanager.controllers.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class AddVaultUserRQ {
    private long vaultId;
    private String emailToAdd;
    private String encryptedVaultKey;
    private String role;
}
