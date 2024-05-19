package giuliochiarenza.A.I.M.E.E.dto;

import giuliochiarenza.A.I.M.E.E.entities.User;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Date;

public record NewAppointmentDTO(User userId,
                                @NotEmpty(message = "title required") String title,
                                @NotEmpty(message = "description required") String description,
                                @NotNull(message = "date required") LocalDate date,
                                @NotEmpty(message = "place required") String place) {
}
