package giuliochiarenza.A.I.M.E.E.services;

import giuliochiarenza.A.I.M.E.E.dto.NewToDoDTO;
import giuliochiarenza.A.I.M.E.E.entities.Done;
import giuliochiarenza.A.I.M.E.E.entities.ToDo;
import giuliochiarenza.A.I.M.E.E.enums.State;
import giuliochiarenza.A.I.M.E.E.exceptions.NotFoundException;
import giuliochiarenza.A.I.M.E.E.repositories.DoneDAO;
import giuliochiarenza.A.I.M.E.E.repositories.ToDoDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class ToDoService {

    @Autowired
    private ToDoDAO td;
    @Autowired UserService us;
    @Autowired
    private DoneDAO dd;


    public Page<ToDo> getToDoList(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.td.findAll(pageable);
    }
    @Transactional
    public ToDo saveNewToDo(NewToDoDTO body) {
        ToDo newToDo = new ToDo(us.findById(body.userId().getId()), body.description(), body.expirationDate(),body.state());
         td.save(newToDo);
        if (newToDo.isCompleted() || newToDo.isExpired()){
            transitionToDoToDone(newToDo);
        }
        return newToDo;
    }
    @Transactional
    public void completeToDo(long toDoId) {
        ToDo toDo = td.findById(toDoId)
                .orElseThrow(() -> new NotFoundException("ToDo non trovato con ID: " + toDoId));

        toDo.isCompleted();

        if (toDo.isExpired()) {
            transitionToDoToDone(toDo);
        }
    }
    private void transitionToDoToDone(ToDo toDo) {
        toDo.isCompleted();
        Done done = toDo.toDone();
        dd.save(done);
        td.delete(toDo);
    }
    public ToDo findById(Long toDoId) {
        return this.td.findById(toDoId).orElseThrow(() -> new NotFoundException(toDoId));
    }
    public ToDo findByIdAndUpdate(Long toDoId, ToDo updatedToDo) {
        ToDo found = this.findById(toDoId);
        found.setUserId(updatedToDo.getUserId());
        found.setDescription(updatedToDo.getDescription());
        found.setExpirationDate(updatedToDo.getExpirationDate());
        found.setState(updatedToDo.getState());
        return this.td.save(found);
    }
    public void findByIdAndDelete(Long toDoId) {
        ToDo found = this.findById(toDoId);
        this.td.delete(found);
    }
    public Page<ToDo> findByUserId(Long userId, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return td.findByUserId(userId, pageable);
    }
    public Page<ToDo> findByExpirationDate(Date expirationDate, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return td.findByExpirationDate(expirationDate, pageable);
    }
    public Page<ToDo> findByState(State state, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return td.findByState(state, pageable);
    }







}
