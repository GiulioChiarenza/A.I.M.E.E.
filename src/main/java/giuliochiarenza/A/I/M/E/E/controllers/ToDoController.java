package giuliochiarenza.A.I.M.E.E.controllers;

import giuliochiarenza.A.I.M.E.E.dto.NewToDoDTO;
import giuliochiarenza.A.I.M.E.E.dto.NewToDoRespDTO;
import giuliochiarenza.A.I.M.E.E.dto.UpdateToDoDTO;
import giuliochiarenza.A.I.M.E.E.entities.ToDo;
import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.enums.State;
import giuliochiarenza.A.I.M.E.E.exceptions.BadRequestException;
import giuliochiarenza.A.I.M.E.E.exceptions.NotFoundException;
import giuliochiarenza.A.I.M.E.E.services.ToDoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;

@RestController
@RequestMapping("/toDo")
public class ToDoController {

    @Autowired
    private ToDoService ts;

    @GetMapping("/{toDoId}")
//    URL: GET /toDo/{toDoId}
    public ToDo getToDoById(@PathVariable long toDoId){return ts.findById(toDoId);}
    @GetMapping
//    URL: GET /toDo?page=1&size=10&sortBy=expirationDate
    public Page<ToDo> getAllToDo(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size,
                                  @RequestParam(defaultValue = "id") String sortBy)
    {return this.ts.getToDoList(page, size, sortBy);}
    @GetMapping("/byUser")
//    URL: GET /toDo/byUser?userId=456&page=0&size=5&sortBy=state
    public Page<ToDo> getToDoByUser(@RequestParam Long userId,
                                @RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "10") int size,
                                @RequestParam(defaultValue = "id") String sortBy)
    {return (Page<ToDo>) ts.findByUserId(userId, page, size, sortBy);}
    @GetMapping("/byDate")
//    URL: GET /toDo/byDate?date=2024-05-20&page=0&size=5&sortBy=description
    public Page<ToDo> getToDoByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size,
                                    @RequestParam(defaultValue = "id") String sortBy)
    {return (Page<ToDo>) ts.findByExpirationDate(date, page, size, sortBy);}
    @GetMapping("/byState")
//    URL: GET /toDo/byState?state=IN_PROGRESS&page=1&size=10&sortBy=expirationDate
    public Page<ToDo> getToDoByState(@RequestParam State state,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "10") int size,
                                    @RequestParam(defaultValue = "id") String sortBy)
    {return (Page<ToDo>) ts.findByState(state, page, size, sortBy);}
    @PostMapping
//    URL: POST /toDo + payload
    public NewToDoRespDTO createToDo(@RequestBody @Validated NewToDoDTO body, BindingResult validation, @AuthenticationPrincipal User currentUser){
        if (validation.hasErrors()){
            System.out.println(validation.getAllErrors());
            throw new BadRequestException(validation.getAllErrors());
        }
        long userId = currentUser.getId();
        return new NewToDoRespDTO(this.ts.saveNewToDo(body, userId).getId());
    }
    @PatchMapping("/{toDoId}")
    // URL: PATCH /toDo/{toDoId}
    public ToDo updateToDo(@PathVariable Long toDoId, @RequestBody UpdateToDoDTO updatedToDoDTO) {
        ToDo existingToDo = ts.findById(toDoId);
        if (existingToDo == null) {
            throw new NotFoundException("ToDo not found");
        }

        if (updatedToDoDTO.description() != null) {
            existingToDo.setDescription(updatedToDoDTO.description());
        }
        if (updatedToDoDTO.expirationDate() != null) {
            existingToDo.setExpirationDate(updatedToDoDTO.expirationDate());
        }

        return ts.findByIdAndUpdate(toDoId, existingToDo);
    }
    @DeleteMapping("/{toDoId}")
//    URL: DELETE /toDo/{toDoId}
    public void deleteToDo(@PathVariable Long toDoId) {
        ts.deleteTodoById(toDoId);
    }
    @PatchMapping("/{toDoId}/state")
//    URL: PATCH /toDo/{toDoId}/state?newState={newState}
    public ToDo updateToDoState(@PathVariable Long toDoId, @RequestParam State newState) {
        ToDo toDo = ts.findById(toDoId);
        if (newState == State.COMPLETED || toDo.isExpired()) {
            toDo.setState(State.COMPLETED);
            ts.completeToDoAndUpdateDone(toDo);
            ts.deleteTodoById(toDoId);
        } else {
            toDo.setState(newState);
            ts.save(toDo);
        }
        return toDo;
    }


}
