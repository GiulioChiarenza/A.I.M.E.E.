package giuliochiarenza.A.I.M.E.E.controllers;

import giuliochiarenza.A.I.M.E.E.dto.NewUserDTO;
import giuliochiarenza.A.I.M.E.E.dto.UserLoginDTO;
import giuliochiarenza.A.I.M.E.E.dto.UserLoginRespDTO;
import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.exceptions.BadRequestException;
import giuliochiarenza.A.I.M.E.E.services.AuthService;
import giuliochiarenza.A.I.M.E.E.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService us;

    @Autowired
    private AuthService as;
    @CrossOrigin
    @PostMapping("/login")
//    URL: POST /auth/login + token
    public UserLoginRespDTO login(@RequestBody UserLoginDTO body) {
        return new UserLoginRespDTO(this.as.authenticateUsersAndGenerateToken(body));
    }

    @PostMapping("/register")
//    URL: POST /auth/register + payload
    @ResponseStatus(HttpStatus.CREATED)
    public User saveUser(@RequestBody @Validated NewUserDTO body, BindingResult validation) {
        if (validation.hasErrors()) {
            throw new BadRequestException(validation.getAllErrors());
        }
        return us.save(body);
    }
}
