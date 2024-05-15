package giuliochiarenza.A.I.M.E.E.dto;

import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.enums.State;
import jakarta.validation.constraints.NotEmpty;

import java.util.Date;

public record NewChatHistoryDTO(@NotEmpty(message = "userId required") User userId,
                                @NotEmpty(message = "text required") String text,
                                @NotEmpty(message = "interaction date required") Date interactionDate) {
}
