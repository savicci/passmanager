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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long vaultUserId;
    private byte[] vaultKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VAULT_ID")
    private Vault vault;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "VAULT_ROLE_ID")
    private VaultRole vaultRole;
}

