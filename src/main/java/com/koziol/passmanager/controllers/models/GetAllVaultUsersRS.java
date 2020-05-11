package com.koziol.passmanager.controllers.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GetAllVaultUsersRS {
    Map<String, VaultUserRS> vaultUsers;
}
