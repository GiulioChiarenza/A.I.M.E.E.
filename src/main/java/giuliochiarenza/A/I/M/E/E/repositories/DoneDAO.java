package giuliochiarenza.A.I.M.E.E.repositories;

import giuliochiarenza.A.I.M.E.E.entities.Done;
import giuliochiarenza.A.I.M.E.E.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoneDAO extends JpaRepository<Done, Long> {
}
