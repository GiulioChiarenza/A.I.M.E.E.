package giuliochiarenza.A.I.M.E.E.dto;

import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.enums.State;
import jakarta.validation.constraints.NotEmpty;

import java.util.Date;

public record NewToDoDTO(@NotEmpty(message = "userId required") User userId,
                         @NotEmpty(message = "description required") String description,
                         @NotEmpty(message = "expiration date required")Date expirationDate,
                         @NotEmpty(message = "state required")State state) {
}
