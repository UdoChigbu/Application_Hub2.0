package com.apphub.backend.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;



@Configuration
public class WebClientConfig {
    @Value("${ai.base-url}")
    private String aiBaseUrl;

    @Value("${groq.api-key}")
    private String groqApiKey;

    @Bean
    public WebClient webClient() {
       return WebClient.builder()
                .baseUrl(aiBaseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + groqApiKey)
                .build();
    }
}
