package giuliochiarenza.A.I.M.E.E.dto;

import jakarta.validation.constraints.NotEmpty;

public record UserLoginRespDTO(@NotEmpty(message = "Token is required!")
                               String accessToken) {
}
