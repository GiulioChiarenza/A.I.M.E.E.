package giuliochiarenza.A.I.M.E.E.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpdateAppointmentDTO(@NotEmpty(message = "title required") String title,
                                   @NotNull(message = " date required") LocalDate date,
                                   @NotEmpty(message = "place required") String place,
                                   @NotEmpty(message = "description required") String description) {
}
