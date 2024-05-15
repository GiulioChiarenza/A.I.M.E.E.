package giuliochiarenza.A.I.M.E.E.repositories;

import giuliochiarenza.A.I.M.E.E.entities.Done;
import giuliochiarenza.A.I.M.E.E.entities.ToDo;
import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.enums.State;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;

public interface DoneDAO extends JpaRepository<Done, Long> {

    Page<Done> findByState(State state, Pageable pageable);
    Page<Done> findByCompletionDate(Date completionDate, Pageable pageable);
}
