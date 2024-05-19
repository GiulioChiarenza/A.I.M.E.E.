package giuliochiarenza.A.I.M.E.E.controllers;

import giuliochiarenza.A.I.M.E.E.dto.NewChatHistoryDTO;
import giuliochiarenza.A.I.M.E.E.dto.NewChatHistoryRespDTO;
import giuliochiarenza.A.I.M.E.E.entities.ChatHistory;
import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.exceptions.BadRequestException;
import giuliochiarenza.A.I.M.E.E.services.ChatHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;

@RestController
@RequestMapping("/chatHistory")
public class ChatHistoryController {

    @Autowired
    private ChatHistoryService cs;
//    @Autowired
//    private MappingJackson2HttpMessageConverter jsonConverter;

    @GetMapping("/{chatHistoryId}")
//    URL: GET /chatHistory/{chatHistoryId}
    public ChatHistory getChatHistoryById(@PathVariable long chatHistoryId) {
        return cs.findById(chatHistoryId);
    }
    @GetMapping
//    URL: GET /chatHistory?page=1&size=10&sortBy=date
    private Page<ChatHistory> getAllChat(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "10") int size,
                                          @RequestParam(defaultValue = "id") String sortBy) {
        return this.cs.getChatHistoryList(page, size, sortBy);
    }
    @GetMapping("/byDate")
//    URL: GET /chatHistory/byDate?date=2024-05-20&page=0&size=5&sortBy=title
    public Page<ChatHistory> getChatByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate interactionDate,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size,
                                            @RequestParam(defaultValue = "id") String sortBy) {
        return (Page<ChatHistory>) cs.findByDate(interactionDate, page, size, sortBy);
    }
    @PostMapping
//            (consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
//    URL: POST /chatHistory + payload
    public NewChatHistoryRespDTO saveChat(@RequestBody @Validated NewChatHistoryDTO body, BindingResult validation, @AuthenticationPrincipal User currentUser) {
        if (validation.hasErrors()) {
            System.out.println(validation.getAllErrors());
            throw new BadRequestException(validation.getAllErrors());
        }
        long userId = currentUser.getId();
        return new NewChatHistoryRespDTO(this.cs.saveChat(body, userId).getId());
    }
    @DeleteMapping("/{chatHistoryId}")
//    URL: DELETE /chatHistory/{chatHistoryId}
    public void deleteChat(@PathVariable Long chatHistoryId) {
        System.out.println("Chiamata al metodo deleteChat con chatHistoryId: " + chatHistoryId);
        cs.deleteChatById(chatHistoryId);
        System.out.println("Eliminazione completata per chatHistoryId: " + chatHistoryId);
    }


}
