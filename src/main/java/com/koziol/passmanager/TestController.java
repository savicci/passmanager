package com.koziol.passmanager;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @RequestMapping("/protected")
    public String getProtectedContent(){
        return "protected-content";
    }

    @RequestMapping("/public")
    public String getPublicContent(){
        return "public-content";
    }
}
