package giuliochiarenza.A.I.M.E.E.controllers;

import giuliochiarenza.A.I.M.E.E.dto.NewUserDTO;
import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.exceptions.BadRequestException;
import giuliochiarenza.A.I.M.E.E.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService us;


    @GetMapping("/me")
//    URL: GET /users/me
    public User getProfile(@AuthenticationPrincipal User currentUser) {
        return currentUser;
    }

    @PutMapping("/me")
//    URL: PUT /users/me + payload
    public User updateProfile(@AuthenticationPrincipal User currentUser, @RequestBody @Validated NewUserDTO updatedUser, BindingResult validation) {
        if (validation.hasErrors()) {
            throw new BadRequestException(validation.getAllErrors());
        }
        return this.us.findByIDAndUpdate(currentUser.getId(), updatedUser);
    }

    @DeleteMapping("/me")
//    URL: DELETE /users/me
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProfile(@AuthenticationPrincipal User currentUser) {
        this.us.findByIdAndDelete(currentUser.getId());
    }
    @PostMapping("/me/upload")
//    URL: POST /users/me/upload
    public User uploadAvatar(@RequestParam("avatar") MultipartFile image, @AuthenticationPrincipal User currentUser) throws IOException {
        return us.uploadImage(image, currentUser.getId());
    }
}
