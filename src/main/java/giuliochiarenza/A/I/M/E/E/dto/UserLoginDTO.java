package giuliochiarenza.A.I.M.E.E.dto;

import jakarta.validation.constraints.NotEmpty;

public record UserLoginDTO(@NotEmpty(message = "Email is required! ")
                           String email,
                           @NotEmpty(message = "Password is required!")
                           String password) {
}
