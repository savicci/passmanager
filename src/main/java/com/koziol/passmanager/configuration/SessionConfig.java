package com.koziol.passmanager.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;

@Configuration
@PropertySource(value = "classpath:/application.properties")
public class SessionConfig {

    @Value(value = "${redis.hostname}")
    private String redisHostname;

    @Value("${redis.port}")
    private String redisPort;

    @Bean
    public JedisConnectionFactory jedisConnectionFactory() {
        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration();
        redisConfig.setHostName(redisHostname);
        redisConfig.setPort(Integer.parseInt(redisPort));

        return new JedisConnectionFactory(redisConfig);
    }
}
