package giuliochiarenza.A.I.M.E.E.services;

import giuliochiarenza.A.I.M.E.E.dto.NewAppointmentDTO;
import giuliochiarenza.A.I.M.E.E.entities.Appointment;
import giuliochiarenza.A.I.M.E.E.entities.ChatHistory;
import giuliochiarenza.A.I.M.E.E.exceptions.NotFoundException;
import giuliochiarenza.A.I.M.E.E.repositories.AppointmentDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentDAO ad;
    @Autowired
    private UserService us;


    public Page<Appointment> getAppointmentList(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.ad.findAll(pageable);
    }

    public Appointment saveAppointment(NewAppointmentDTO body) {
        Appointment newAppointment = new Appointment(us.findById(body.userId().getId()), body.title(), body.description(), body.date(), body.place());
        return ad.save(newAppointment);
    }

    public Appointment findById(Long appointmentId) {
        return this.ad.findById(appointmentId).orElseThrow(() -> new NotFoundException(appointmentId));
    }
    public Page<Appointment> findByDate(Date date, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ad.findByDate(date, pageable);
    }
    public Page<Appointment> findByTitle(String title, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ad.findByTitle(title, pageable);
    }
    public Page<Appointment> findByPlace(String place, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ad.findByPlace(place, pageable);
    }





}
