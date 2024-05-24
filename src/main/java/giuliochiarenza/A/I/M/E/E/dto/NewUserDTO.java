package giuliochiarenza.A.I.M.E.E.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record NewUserDTO(@NotEmpty(message = "Username is required!")
                         @Size(min = 3, max = 20, message = " your username must be  between 3 and 20 characters!")
                         String username,
                         @NotEmpty(message = "email is required!")
                         @Email(message = "please check your email format!")
                         String email,
                         @NotEmpty(message = "password is required!")
                         String password,
                         @NotEmpty(message = "Username is required!")
                         @Size(min = 2, max = 10, message = " your name must be  between 2 and 10 characters!")
                         String name,
                         @NotEmpty(message = "Username is required!")
                         @Size(min = 2, max = 15, message = " your surname must be  between 2 and 15 characters!")
                         String surname) {
}
