package com.koziol.passmanager.controllers;

import com.koziol.passmanager.configuration.security.CustomUserDetails;
import com.koziol.passmanager.configuration.security.CustomUserDetailsService;
import com.koziol.passmanager.controllers.models.RegisterRQ;
import com.koziol.passmanager.database.models.User;
import com.koziol.passmanager.database.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private CustomUserDetailsService userDetailsService;

    private SessionRegistry sessionRegistry = new SessionRegistryImpl();

    @Autowired
    public AuthController(PasswordEncoder passwordEncoder, UserRepository userRepository, CustomUserDetailsService userDetailsService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping(value = "/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRQ request) {
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

    @GetMapping("/user")
    public CustomUserDetails getUserInfo(Authentication authentication) {
        CustomUserDetails persistedUserDetails = userDetailsService.loadUserByUsername(authentication.getName());
        persistedUserDetails.setPassword(null);
        return persistedUserDetails;
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response, Authentication authentication){
        SecurityContextHolder.clearContext();
        sessionRegistry.removeSessionInformation(request.getSession().getId());
        //TODO take care of deleting cookie on redis side(only deletes one of 4)
        return ResponseEntity.ok("all good man");
    }
}
