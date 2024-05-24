package giuliochiarenza.A.I.M.E.E.repositories;

import giuliochiarenza.A.I.M.E.E.entities.ChatHistory;
import giuliochiarenza.A.I.M.E.E.entities.ToDo;
import giuliochiarenza.A.I.M.E.E.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;
@Repository

public interface ChatHistoryDAO extends JpaRepository<ChatHistory, Long> {
    Page<ChatHistory> findByInteractionDate(LocalDate interactionDate, Pageable pageable);
    Page<ChatHistory> findByUser(User user, Pageable pageable);

}
