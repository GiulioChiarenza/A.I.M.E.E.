package giuliochiarenza.A.I.M.E.E.services;

import giuliochiarenza.A.I.M.E.E.dto.NewChatHistoryDTO;
import giuliochiarenza.A.I.M.E.E.entities.ChatHistory;
import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.exceptions.NotFoundException;
import giuliochiarenza.A.I.M.E.E.repositories.ChatHistoryDAO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;

@Service
public class ChatHistoryService {

    @Autowired
    private ChatHistoryDAO cd;
    @Autowired
    private UserService us;

    @Autowired
    private EntityManager entityManager;


    public Page<ChatHistory> getChatHistoryList(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.cd.findAll(pageable);
    }
    public ChatHistory saveChat(NewChatHistoryDTO body, long userId) {
        User currentUser = us.findById(userId);
        ChatHistory newChat = new ChatHistory(currentUser, body.text(), body.interactionDate());
        return cd.save(newChat);
    }
    public ChatHistory findById(Long chatHistoryId) {
        return this.cd.findById(chatHistoryId).orElseThrow(() -> new NotFoundException(chatHistoryId));
    }

    public Page<ChatHistory> getChatHistoryByUser(User user, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return cd.findByUser(user, pageable);
    }
//    public Page<ChatHistory> getChatHistoryListByUserId(User user, int page, int size, String sortBy) {
//        // Implementa il recupero delle chat per un utente specifico usando il parametro userId
//        return cd.findByUser_Id(user, PageRequest.of(page, size, Sort.by(sortBy)));
//    }
//    @Transactional
//    public void findByIdAndDelete(Long chatHistoryId) {
//        System.out.println("Tentativo di eliminazione del chatHistoryId: " + chatHistoryId);
//        ChatHistory found = this.findById(chatHistoryId);
//        this.cd.delete(found);
//    }
@Transactional
public void deleteChatById(Long chatHistoryId) {
    Query query = entityManager.createQuery("DELETE FROM ChatHistory ch WHERE ch.id = :chatId");
    query.setParameter("chatId", chatHistoryId);
    int deletedCount = query.executeUpdate();
    System.out.println("Numero di righe eliminate: " + deletedCount);
}
    public Page<ChatHistory> findByDate(LocalDate interactionDate, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return cd.findByInteractionDate(interactionDate, pageable);
    }



}
