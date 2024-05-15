package giuliochiarenza.A.I.M.E.E.dto;

import giuliochiarenza.A.I.M.E.E.entities.User;
import jakarta.validation.constraints.NotEmpty;

import java.util.Date;

public record NewAppointmentDTO(@NotEmpty(message = "userId required") User userId,
                                @NotEmpty(message = "title required") String title,
                                @NotEmpty(message = "description required") String description,
                                @NotEmpty(message = "date required") Date date,
                                @NotEmpty(message = "place required") String place) {
}
