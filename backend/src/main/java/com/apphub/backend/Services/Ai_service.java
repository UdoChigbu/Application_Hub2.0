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
                    "content", "You are an expert ATS resume writer and career coach."
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
        return "RULES:\n" +
        "- Keep the candidate's name, email, phone number, links, and location exactly the same at the top.\n" +
        "- Do not invent employers, job titles, dates, degrees, certifications, tools, metrics, or achievements.\n" +
        "- You may strengthen wording, reorganize content, infer transferable skills from the existing resume, and make responsibilities sound more results-oriented.\n" +
        "- If a bullet lacks numbers, do not create fake numbers. Instead, emphasize scope, tools, process, ownership, collaboration, or business value.\n" +
        "- Prioritize keywords and responsibilities relevant to the target role.\n" +
        "- Remove weak, generic, repeated, or outdated content.\n" +
        "- Keep the resume realistic, professional, and ready for a human recruiter.\n" +
        "- Keep it one page, but make the page feel complete and substantial.\n\n" +

        "FORMAT:\n" +
        "Use only these sections in this order:\n" +
        "SUMMARY\n" +
        "SKILLS\n" +
        "EXPERIENCE\n" +
        "EDUCATION\n\n" +

        "SUMMARY:\n" +
        "- Write 1-2 paragraphs, not fluff.\n" +
        "- Focus on role fit, strongest skills, and relevant experience.\n\n" +

        "SKILLS:\n" +
        "- Group skills by category if useful.\n" +
        "- Put the most job-relevant skills first.\n" +
        "- Only include skills supported by the original resume.\n\n" +

        "EXPERIENCE:\n" +
        "- Keep each original role that is relevant.\n" +
        "- For each role, include 3-5 bullet points.\n" +
        "- Start bullets with strong action verbs.\n" +
        "- Make each bullet specific, outcome-oriented, and relevant to the target role.\n" +
        "- Avoid repeating the same action verb or idea.\n\n" +

        "EDUCATION:\n" +
        "- Include only education details already present in the resume.\n\n" +

        "OUTPUT:\n" +
        "- Return only the final resume text.\n" +
        "- Do not include explanations, notes, markdown fences, or comments.\n\n" +

        "ORIGINAL RESUME:\n" + resumeText;
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
