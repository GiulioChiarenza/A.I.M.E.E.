package giuliochiarenza.A.I.M.E.E.controllers;

import giuliochiarenza.A.I.M.E.E.entities.Done;
import giuliochiarenza.A.I.M.E.E.enums.State;
import giuliochiarenza.A.I.M.E.E.services.DoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;

@RestController
@RequestMapping("/done")
public class DoneController {

   @Autowired
   private DoneService ds;

    @GetMapping("/{doneId}")
//    URL: GET /done/{doneId}
    public Done getDoneById(@PathVariable Long doneId) {
        return ds.findById(doneId);
    }

    @GetMapping
//    URL: GET /done?page=1&size=10&sortBy=state
    private Page<Done> getAllDone(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "10") int size,
                                          @RequestParam(defaultValue = "id") String sortBy) {
        return this.ds.getDoneList(page, size, sortBy);
    }
    @GetMapping("/byState")
//    URL: GET /done/byState?state=COMPLETED&page=0&size=5&sortBy=completionDate
    public Page<Done> getDoneByState(@RequestParam State state,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size,
                                             @RequestParam(defaultValue = "id") String sortBy) {
        return (Page<Done>) ds.findByState(state, page, size, sortBy);
    }
    @GetMapping("/byDate")
//    URL: GET /done/byDate?date=2024-05-20&page=0&size=5&sortBy=id
    public Page<Done> getDoneByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size,
                                            @RequestParam(defaultValue = "id") String sortBy) {
        return (Page<Done>) ds.findByCompletionDate(date, page, size, sortBy);
    }
    @DeleteMapping("/{doneId}")
//    URL: DELETE /done/{doneId}
    public void deleteDone(@PathVariable Long doneId) {
        ds.deleteDoneById(doneId);
    }



//    @PutMapping("/{doneId}")
//    public Done updateDone(@PathVariable Long id, @RequestBody Done updatedDone) {
//        return ds.findByIdAndUpdate(id, updatedDone);
//    }












}
