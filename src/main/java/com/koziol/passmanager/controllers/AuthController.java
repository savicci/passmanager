package com.koziol.passmanager.controllers;

import com.koziol.passmanager.configuration.security.CustomUserDetails;
import com.koziol.passmanager.configuration.security.CustomUserDetailsService;
import com.koziol.passmanager.controllers.models.RegisterRequest;
import com.koziol.passmanager.database.models.User;
import com.koziol.passmanager.database.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private CustomUserDetailsService userDetailsService;

    @Autowired
    public AuthController(PasswordEncoder passwordEncoder, UserRepository userRepository, CustomUserDetailsService userDetailsService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping(value = "/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());
        if (user.isPresent()) {
            return new ResponseEntity<>("user with provided email already exists", HttpStatus.FORBIDDEN);
        }

        userRepository.save(new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getEncryptedPrivateKey().getBytes(),
                request.getPublicKey().getBytes()
        ));
        return ResponseEntity.ok("Registration succesfull");
    }

    @RequestMapping("/user")
    public CustomUserDetails getUserInfo(Authentication authentication) {
        CustomUserDetails persistedUserDetails = userDetailsService.loadUserByUsername(authentication.getName());
        persistedUserDetails.setPassword(null);
        return persistedUserDetails;
    }
}
