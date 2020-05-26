package com.koziol.passmanager.controllers;

import com.koziol.passmanager.controllers.models.*;
import com.koziol.passmanager.database.models.User;
import com.koziol.passmanager.database.models.VaultRole;
import com.koziol.passmanager.database.models.VaultUser;
import com.koziol.passmanager.database.repositories.UserRepository;
import com.koziol.passmanager.database.repositories.VaultRoleRepository;
import com.koziol.passmanager.database.repositories.VaultUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/vaultuser")
public class VaultUserController {
    private final UserRepository userRepository;
    private final VaultRoleRepository vaultRoleRepository;
    private final VaultUserRepository vaultUserRepository;

    @Autowired
    public VaultUserController(UserRepository userRepository, VaultRoleRepository vaultRoleRepository, VaultUserRepository vaultUserRepository) {
        this.userRepository = userRepository;
        this.vaultRoleRepository = vaultRoleRepository;
        this.vaultUserRepository = vaultUserRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addUserToExistingVault(@RequestBody AddVaultUserRQ request, Authentication authentication) {
        User user = getUser(authentication);
        Optional<VaultRole> roleOptional = vaultRoleRepository.findByRoleName(request.getRole());

        if (roleOptional.isEmpty()) {
            return new ResponseEntity<>("Role not found by given name", HttpStatus.NOT_FOUND);
        }

        Optional<VaultUser> vaultUserOptional = getVaultUserFromRequest(user, request.getVaultId());

        if (vaultUserOptional.isEmpty()) {
            return new ResponseEntity<>("vault not found", HttpStatus.NOT_FOUND);
        }

        Optional<User> userToAddOptional = userRepository.findByEmail(request.getEmailToAdd());

        if (userToAddOptional.isEmpty()) {
            return new ResponseEntity<>("user with provided email does not exist", HttpStatus.NOT_FOUND);
        }

        VaultUser vaultUserToAdd = new VaultUser();
        vaultUserToAdd.setUser(userToAddOptional.get());
        vaultUserToAdd.setVault(vaultUserOptional.get().getVault());
        vaultUserToAdd.setVaultRole(roleOptional.get());
        vaultUserToAdd.setVaultKey(request.getEncryptedVaultKey().getBytes());
        vaultUserToAdd.setCreatedBy(user);
        vaultUserToAdd.setCreatedDate(LocalDateTime.now());
        vaultUserRepository.save(vaultUserToAdd);

        return ResponseEntity.ok("user added succesfully");
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteUserFromVault(@RequestBody DeleteVaultUserRQ request, Authentication authentication) {
        User user = getUser(authentication);
        Optional<VaultUser> vaultUserOptional = getVaultUserFromRequest(user, request.getVaultId());

        if (vaultUserOptional.isEmpty()) {
            return new ResponseEntity<>("vault not found", HttpStatus.NOT_FOUND);
        }

        if (!(vaultUserOptional.get().getVaultRole().getRoleName().equals("ADMIN") || vaultUserOptional.get().getVaultRole().getRoleName().equals("CREATOR"))) {
            return new ResponseEntity<>("you have no permission to delete user from vault", HttpStatus.FORBIDDEN);
        }

        Optional<VaultUser> vaultUserToDelete = vaultUserOptional.get().getVault()
                .getVaultUsers()
                .stream()
                .filter(vaultUser -> vaultUser.getUser().getEmail().equals(request.getEmail()))
                .findFirst();

        if (vaultUserToDelete.isEmpty()) {
            return new ResponseEntity<>("Provided email does not have access to vault", HttpStatus.NOT_FOUND);
        }

        vaultUserRepository.delete(vaultUserToDelete.get());
        return ResponseEntity.ok("User deleted from vault");
    }

    @PostMapping("/changepermission")
    public ResponseEntity<?> changePermissionsForUser(@RequestBody PermissionChangeRQ request, Authentication authentication) {
        User user = getUser(authentication);
        Optional<VaultUser> vaultUserOptional = getVaultUserFromRequest(user, request.getVaultId());

        if (authentication.getPrincipal().toString().equals(request.getEmail())) {
            return new ResponseEntity<>("you cannot modify your permissions", HttpStatus.FORBIDDEN);
        }

        if (vaultUserOptional.isEmpty()) {
            return new ResponseEntity<>("vault not found", HttpStatus.NOT_FOUND);
        }

        if (!(vaultUserOptional.get().getVaultRole().getRoleName().equals("ADMIN") || vaultUserOptional.get().getVaultRole().getRoleName().equals("CREATOR"))) {
            return new ResponseEntity<>("you have no permission to modify user permission for this vault", HttpStatus.FORBIDDEN);
        }

        Optional<VaultUser> userToChangeOptional = vaultUserOptional.get().getVault()
                .getVaultUsers().stream()
                .filter(vaultUser -> vaultUser.getUser().getEmail().equals(request.getEmail()))
                .findFirst();

        if (userToChangeOptional.isEmpty()) {
            return new ResponseEntity<>("provided email has no acces to this vault", HttpStatus.NOT_FOUND);
        }

        Optional<VaultRole> vaultRoleOptional = vaultRoleRepository.findByRoleName(request.getNewRole());
        if (vaultRoleOptional.isEmpty()) {
            return new ResponseEntity<>("role not found", HttpStatus.NOT_FOUND);
        }

        VaultUser userToChange = userToChangeOptional.get();
        userToChange.setVaultRole(vaultRoleOptional.get());
        userToChange.setModifiedBy(user);
        userToChange.setModifiedDate(LocalDateTime.now());
        vaultUserRepository.save(userToChangeOptional.get());
        return ResponseEntity.ok("Modified permissions for user with email" + request.getEmail());
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllVaultUsers(@RequestBody GetAllVaultUsersRQ request, Authentication authentication) {
        User user = getUser(authentication);
        Optional<VaultUser> vaultUserOptional = getVaultUserFromRequest(user, request.getVaultId());

        if (vaultUserOptional.isEmpty()) {
            return new ResponseEntity<>("vault not found", HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(createGetAllVaultUsersRS(vaultUserOptional.get().getVault().getVaultUsers()));
    }

    @GetMapping("/get")
    public ResponseEntity<?> getVaultUserByEmail(@RequestParam(name = "vaultId") long vaultId, @RequestParam(name = "email") String email, Authentication authentication) {
        User user = getUser(authentication);
        Optional<VaultUser> vaultUserOptional = getVaultUserFromRequest(user, vaultId);
        if (vaultUserOptional.isEmpty()) {
            return new ResponseEntity<>("vault not found", HttpStatus.NOT_FOUND);
        }

        Optional<VaultUser> requestedVaultUserOptional = vaultUserOptional.get().getVault().getVaultUsers()
                .stream()
                .filter(vaultUser -> vaultUser.getUser().getEmail().equals(email))
                .findFirst();

        if (requestedVaultUserOptional.isEmpty()) {
            return new ResponseEntity<>("requested user does not have acces to this vault", HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok(createVaultUserRS(requestedVaultUserOptional.get()));
    }

    @GetMapping("/key")
    public ResponseEntity<?> getUserPublicKey(@RequestParam(name = "email") String email){
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()){
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(new String(userOptional.get().getPublicKey()));
    }

    private GetAllVaultUsersRS createGetAllVaultUsersRS(List<VaultUser> vaultUsers) {
        return new GetAllVaultUsersRS(vaultUsers.stream()
                .collect(Collectors.toMap(vaultUser -> vaultUser.getUser().getEmail(), this::createVaultUserRS)));
    }

    private VaultUserRS createVaultUserRS(VaultUser vaultUser) {
        VaultUserRS vaultUserRS = new VaultUserRS();
        vaultUserRS.setEmail(vaultUser.getUser().getEmail());
        vaultUserRS.setRole(vaultUser.getVaultRole().getRoleName());
        vaultUserRS.setCreatedBy(vaultUser.getCreatedBy().getEmail());
        vaultUserRS.setCreatedDate(vaultUser.getCreatedDate());
        vaultUserRS.setModifiedBy(vaultUser.getModifiedBy() == null ? "" : vaultUser.getModifiedBy().getEmail());
        vaultUserRS.setModifiedDate(vaultUser.getModifiedDate());
        return vaultUserRS;
    }

    private Optional<VaultUser> getVaultUserFromRequest(User user, long vaultId) {
        return user.getVaultUserList().stream()
                .filter(vaultUser -> vaultUser.getVault().getVaultId() == vaultId)
                .findFirst();
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getPrincipal().toString()).orElseThrow(IllegalAccessError::new);
    }
}
