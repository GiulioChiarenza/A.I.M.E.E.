package giuliochiarenza.A.I.M.E.E.services;

import giuliochiarenza.A.I.M.E.E.dto.NewChatHistoryDTO;
import giuliochiarenza.A.I.M.E.E.entities.ChatHistory;
import giuliochiarenza.A.I.M.E.E.exceptions.NotFoundException;
import giuliochiarenza.A.I.M.E.E.repositories.ChatHistoryDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ChatHistoryService {

    @Autowired
    private ChatHistoryDAO cd;
    @Autowired
    private UserService us;


    public Page<ChatHistory> getChatHistoryList(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.cd.findAll(pageable);
    }
    public ChatHistory saveChat(NewChatHistoryDTO body) {
        ChatHistory newChat = new ChatHistory(us.findById(body.userId().getId()), body.text(), body.interactionDate());
        return cd.save(newChat);
    }
    public ChatHistory findById(Long chatHistoryId) {
        return this.cd.findById(chatHistoryId).orElseThrow(() -> new NotFoundException(chatHistoryId));
    }
    public void findByIdAndDelete(Long chatHistoryId) {
        ChatHistory found = this.findById(chatHistoryId);
        this.cd.delete(found);
    }
    public Page<ChatHistory> findByDate(Date date, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return cd.findByInteractionDate(date, pageable);
    }



}
