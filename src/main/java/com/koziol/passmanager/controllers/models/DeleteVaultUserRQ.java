package com.koziol.passmanager.controllers.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class DeleteVaultUserRQ {
    long vaultId;
    String email;
}
