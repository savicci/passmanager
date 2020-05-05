package com.koziol.passmanager.database.models;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;
    private String email;
    private String password;
    private byte[] encryptedPrivateKey;
    private byte[] publicKey;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    List<VaultUser> vaultUserList;

    public User(String email, String password, byte[] encryptedPrivateKey, byte[] publicKey) {
        this.email = email;
        this.password = password;
        this.encryptedPrivateKey = encryptedPrivateKey;
        this.publicKey = publicKey;
    }
}