package com.apphub.backend.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;



@Service
public class Ai_service {
    private final WebClient client;

    @Value("${groq.model}")
    private String groqModel;

    public Ai_service(WebClient client) {
        this.client = client;
    }


    @Async
     public CompletableFuture<byte[]> improve_resume_with_ai(MultipartFile file, String jobPosition, Long userId, String originalFileName, Long fileId){
        String resume_text = extract_text(file);
        String prompt = build_resume_improvement_prompt(resume_text, jobPosition);

        return client.post()
        .uri("/chat/completions")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(Map.of(
            "model", groqModel,
            "messages", List.of(
                Map.of(
                    "role", "system",
                    "content", "You are an expert resume writer. Follow the requested section structure exactly."
                ),
                Map.of(
                    "role", "user",
                    "content", prompt
                )
            ),
            "temperature", 0.3,
            "max_completion_tokens", 2500
        ))
        .retrieve()
        .bodyToMono(Map.class)
        .map(res -> {
            List choices = (List) res.get("choices");
            Map firstChoice = (Map) choices.get(0);
            Map message = (Map) firstChoice.get("message");
            return message.get("content").toString();
        })
        .map(this::save_as_docx)
        .toFuture();

    }

    private String build_resume_improvement_prompt(String resumeText, String jobPosition) {
        return "Improve this resume for the job: " + jobPosition + ".\n" +
            "Keep contact info exactly the same at the top.\n" +
            "Do not invent any information.\n" +
            "Use only these sections in this order: SUMMARY, SKILLS, EXPERIENCE, EDUCATION.\n" +
            "No fluff. No repeated ideas.\n" +
            "KEEP IT ONE PAGE.\n"+
            "SUMMARY: Few sentences tailored to the job.\n" +
            "SKILLS: most relevant skills first.\n" +
            "EXPERIENCE: highlight relevant impact and responsibilities for each role.\n" +
            "EDUCATION: include only school details already in the resume.\n" +
            "Return only the final resume text.\n\n" +
            "RESUME:\n" + resumeText;
    }

    public String extract_text(MultipartFile file){
        try (InputStream inputStream = file.getInputStream();
            XWPFDocument document = new XWPFDocument(inputStream);
            XWPFWordExtractor extractor = new XWPFWordExtractor(document)){
            return extractor.getText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract text :",e);
        }
    }

      //turns resume from text to file format
    public byte[] save_as_docx(String response){
        try (XWPFDocument document = new XWPFDocument();
            ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            String[] lines = response.split("\n");
            for(String line: lines){
                XWPFParagraph paragraph = document.createParagraph();
                XWPFRun run = paragraph.createRun();
                run.setText(line);
            }
            document.write(out);
            return out.toByteArray();


        }
        catch (Exception e) {
            throw new RuntimeException("Failed to extract text :",e);
        }
        
    }
}
