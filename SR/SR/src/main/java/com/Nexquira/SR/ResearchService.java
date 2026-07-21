package com.Nexquira.SR;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.Objects;

@Service
public class ResearchService {
    @Value("${gemini.api.url}")
    private String geminiapiurl;
    @Value("${gemini.api.key}")
    private String geminiapikey;

    private final WebClient webclient;
    private final ObjectMapper objectMapper;

    public ResearchService(WebClient.Builder webclientBuilder, ObjectMapper objectMapper) {
        this.webclient = webclientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public String processContent(ResearchRequest request) {
        String prompt = buildPrompt(request);

        Map<String, Object> requestBody =
                Map.of("contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                });

        String response = webclient.post().uri(geminiapiurl + geminiapikey)
                .bodyValue(requestBody).retrieve().bodyToMono(String.class).block();

        return extractTextFromResponse(response);
    }

    private String extractTextFromResponse(String response) {
        try {
            GeminiResponse geminiResponse = objectMapper.readValue(response,GeminiResponse.class);

            if(geminiResponse.getCandidates()!= null&& !geminiResponse.getCandidates().isEmpty()) {
                GeminiResponse.Candidate firstcandidate = geminiResponse.getCandidates().get(0);

                if (firstcandidate.getContent() != null && firstcandidate.getContent().getParts() != null
                        && !firstcandidate.getContent().getParts().isEmpty()) {
                    return firstcandidate.getContent().getParts().get(0).getText();

                }
            }

return " no content";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    private String buildPrompt(ResearchRequest request){
        StringBuilder prompt = new StringBuilder();
        switch(request.getOperation()){
            case "summarize":
                prompt.append("Summarize the key ideas presented in the following text:\n\n");
                break;
            case "suggest":
                prompt.append("Ensure the output is well-structured with clear section headers and concise lists");
                break;
            default:
                throw new IllegalArgumentException("Unknown Operation: "+ request.getOperation());
        }
        prompt.append(request.getContent());
        return  prompt.toString();
    }
}
