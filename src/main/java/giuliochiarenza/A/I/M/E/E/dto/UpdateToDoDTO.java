package giuliochiarenza.A.I.M.E.E.dto;

import giuliochiarenza.A.I.M.E.E.enums.State;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpdateToDoDTO(@NotEmpty(message = "description required") String description,
                            @NotNull(message = "expiration date required") LocalDate expirationDate) {
}
