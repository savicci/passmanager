package com.koziol.passmanager.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class VaultRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long vaultRoleId;
    private String roleName;

    public VaultRole(String roleName) {
        this.roleName = roleName;
    }
}
