package giuliochiarenza.A.I.M.E.E.dto;

import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.enums.State;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Date;

public record NewChatHistoryDTO( User userId,
                                @NotEmpty(message = "text required") String text,
                                @NotNull(message = "interaction date required") LocalDate interactionDate) {
}
