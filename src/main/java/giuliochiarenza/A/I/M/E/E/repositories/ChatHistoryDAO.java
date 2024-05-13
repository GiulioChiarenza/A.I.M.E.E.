package giuliochiarenza.A.I.M.E.E.repositories;

import giuliochiarenza.A.I.M.E.E.entities.ChatHistory;
import giuliochiarenza.A.I.M.E.E.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatHistoryDAO extends JpaRepository<ChatHistory, Long> {
}
