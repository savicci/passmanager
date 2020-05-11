package com.koziol.passmanager.controllers.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class PermissionChangeRQ {
    private long vaultId;
    private String email;
    private String newRole;
}
