package giuliochiarenza.A.I.M.E.E.repositories;

import giuliochiarenza.A.I.M.E.E.entities.ToDo;
import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.enums.State;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;

public interface ToDoDAO extends JpaRepository<ToDo, Long> {
    Page<ToDo> findByUserId(long userId, Pageable pageable);
    Page<ToDo> findByState(State state, Pageable pageable);
    Page<ToDo> findByExpirationDate(Date expirationDate, Pageable pageable);




}
