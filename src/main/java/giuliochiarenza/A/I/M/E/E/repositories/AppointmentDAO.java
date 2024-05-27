package giuliochiarenza.A.I.M.E.E.repositories;

import giuliochiarenza.A.I.M.E.E.entities.Appointment;
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
@Transactional
public interface AppointmentDAO extends JpaRepository<Appointment, Long> {

    Page<Appointment> findByDate(LocalDate date, Pageable pageable);
    Page<Appointment> findByTitle(String title, Pageable pageable);
    Page<Appointment> findByPlace(String place, Pageable pageable);
    Page<Appointment> findByUser(User user, Pageable pageable);
}
