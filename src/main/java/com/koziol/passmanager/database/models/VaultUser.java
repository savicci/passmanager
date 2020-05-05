package com.koziol.passmanager.database.models;

import lombok.*;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class VaultUser {
    @Id
    private long vaultUserId;
    private String vaultName;
    private String vaultId;
    private byte[] vaultKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "VAULT_ROLE_ID")
    private VaultRole vaultRole;
}

