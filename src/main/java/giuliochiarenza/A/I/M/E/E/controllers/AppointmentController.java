package giuliochiarenza.A.I.M.E.E.controllers;

import giuliochiarenza.A.I.M.E.E.dto.NewAppointmentDTO;
import giuliochiarenza.A.I.M.E.E.dto.NewAppointmentRespDTO;
import giuliochiarenza.A.I.M.E.E.dto.UpdateAppointmentDTO;
import giuliochiarenza.A.I.M.E.E.dto.UpdateToDoDTO;
import giuliochiarenza.A.I.M.E.E.entities.Appointment;
import giuliochiarenza.A.I.M.E.E.entities.ChatHistory;
import giuliochiarenza.A.I.M.E.E.entities.ToDo;
import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.exceptions.BadRequestException;
import giuliochiarenza.A.I.M.E.E.exceptions.NotFoundException;
import giuliochiarenza.A.I.M.E.E.services.AppointmentService;
import giuliochiarenza.A.I.M.E.E.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService as;

    @Autowired
    private UserService us;

    @GetMapping("/{appointmentId}")
//    URL: GET /appointment/{appointmentId}
    public Appointment getAppointmentById(@PathVariable Long appointmentId) {
        return as.findById(appointmentId);
    }

    @GetMapping("/byUser/{userId}")
    public Page<Appointment> getAppointmentByUser(@PathVariable Long userId,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size,
                                                  @RequestParam(defaultValue = "id") String sortBy) {
        // Recupera l'utente dal repository degli utenti
        User user = us.findById(userId);

        // Ottieni le chat per l'utente specificato
        return as.getChatAppointmentByUser(user, page, size, sortBy);
    }


    @GetMapping
//    URL: GET /appointment?page=1&size=10&sortBy=date
    private Page<Appointment> getAllAppointment(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "10") int size,
                                          @RequestParam(defaultValue = "id") String sortBy) {
        return this.as.getAppointmentList(page, size, sortBy);
    }
    @GetMapping("/byDate")
//    URL: GET /appointment/byDate?date=2024-05-20&page=0&size=5&sortBy=title
    public Page<Appointment> getAppointmentByDate( @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "10") int size,
                                              @RequestParam(defaultValue = "id") String sortBy) {
        System.out.println("Date: " + date);
        return (Page<Appointment>) as.findByDate(date, page, size, sortBy);
    }
    @GetMapping("/byTitle")
//    URL: GET /appointment/byTitle?title=Checkup&page=0&size=10&sortBy=date
    public Page<Appointment> getAppointmentByTitle(@RequestParam String title,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "10") int size,
                                              @RequestParam(defaultValue = "id") String sortBy) {
        return (Page<Appointment>) as.findByTitle(title, page, size, sortBy);
    }
    @GetMapping("/byPlace")
//    URL: GET /appointment/byPlace?place=Hospital&page=2&size=5&sortBy=date
    public Page<Appointment> getAppointmentByPlace(@RequestParam String place,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "10") int size,
                                              @RequestParam(defaultValue = "id") String sortBy) {
        return as.findByPlace(place, page, size, sortBy);
    }
    @PostMapping
//    URL: POST /appointment + payload
    public NewAppointmentRespDTO createAppointment(@RequestBody @Validated NewAppointmentDTO body, BindingResult validation, @AuthenticationPrincipal User currentUser) {
        if (validation.hasErrors()) {
            System.out.println(validation.getAllErrors());
            throw new BadRequestException(validation.getAllErrors());
        }
        long userId = currentUser.getId();
        return new NewAppointmentRespDTO(this.as.saveAppointment(body, userId).getId());
    }

    @PatchMapping("/{appointmentId}")
    // URL: PATCH /appointment/{appointmentId}
    public Appointment updateAppointment(@PathVariable Long appointmentId, @RequestBody UpdateAppointmentDTO updatedAppointmentDTO) {
        Appointment existingAppointment = as.findById(appointmentId);
        if (existingAppointment == null) {
            throw new NotFoundException("Appointment not found");
        }
        if (updatedAppointmentDTO.title() != null) {
            existingAppointment.setTitle(updatedAppointmentDTO.title());
        }
        if (updatedAppointmentDTO.date() != null) {
            existingAppointment.setDate(updatedAppointmentDTO.date());
        }
        if (updatedAppointmentDTO.place() != null) {
            existingAppointment.setPlace(updatedAppointmentDTO.place());
        }
        if (updatedAppointmentDTO.description() != null) {
            existingAppointment.setDescription(updatedAppointmentDTO.description());
        }


        return as.findByIdAndUpdate(appointmentId, existingAppointment);
    }
    @DeleteMapping("/{appointmentId}")
//    URL: DELETE /appointment/{appointmentId}
    public void deleteAppointment(@PathVariable Long appointmentId) {
        as.deleteAppointmentById(appointmentId);
    }

}
