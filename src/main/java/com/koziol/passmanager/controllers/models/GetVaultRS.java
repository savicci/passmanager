package com.koziol.passmanager.controllers.models;

import lombok.*;

import java.io.Serializable;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Setter
@Getter
public class GetVaultRS implements Serializable {
    private static final long serialVersionUID = 7473091620397763714L;
    Map<Long, VaultRS> vaults;
}
