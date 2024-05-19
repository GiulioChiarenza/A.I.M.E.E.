package giuliochiarenza.A.I.M.E.E.dto;

import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.enums.State;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Date;

public record NewToDoDTO( User userId,
                         @NotEmpty(message = "description required") String description,
                         @NotNull(message = "expiration date required") LocalDate expirationDate,
                         @NotNull(message = "state required")State state) {
    public NewToDoDTO {
        if (state == null) {
            state = State.INPROGRESS;
        }
    }
}
