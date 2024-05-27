package giuliochiarenza.A.I.M.E.E.repositories;

import giuliochiarenza.A.I.M.E.E.entities.ToDo;
import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.enums.State;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
@Transactional
public interface ToDoDAO extends JpaRepository<ToDo, Long> {
    Page<ToDo> findByUser(User user, Pageable pageable);
    Page<ToDo> findByState(State state, Pageable pageable);
    Page<ToDo> findByExpirationDate(LocalDate expirationDate, Pageable pageable);






}
