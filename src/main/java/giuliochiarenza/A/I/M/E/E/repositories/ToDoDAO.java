package giuliochiarenza.A.I.M.E.E.repositories;

import giuliochiarenza.A.I.M.E.E.entities.ToDo;
import giuliochiarenza.A.I.M.E.E.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToDoDAO extends JpaRepository<ToDo, Long> {
}
