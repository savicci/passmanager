package com.koziol.passmanager.controllers.models;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class RegisterRequest {
    private String email;
    private String password;
    private String encryptedPrivateKey;
    private String publicKey;
}
