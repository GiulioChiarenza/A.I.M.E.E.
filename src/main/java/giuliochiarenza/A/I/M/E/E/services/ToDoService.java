package giuliochiarenza.A.I.M.E.E.services;

import giuliochiarenza.A.I.M.E.E.dto.NewToDoDTO;
import giuliochiarenza.A.I.M.E.E.entities.Done;
import giuliochiarenza.A.I.M.E.E.entities.ToDo;
import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.enums.State;
import giuliochiarenza.A.I.M.E.E.exceptions.NotFoundException;
import giuliochiarenza.A.I.M.E.E.repositories.DoneDAO;
import giuliochiarenza.A.I.M.E.E.repositories.ToDoDAO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;

@Service
public class ToDoService {

    @Autowired
    private ToDoDAO td;
    @Autowired UserService us;
    @Autowired
    private DoneDAO dd;
    @Autowired
    private EntityManager entityManager;


    public Page<ToDo> getToDoList(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.td.findAll(pageable);
    }
    @Transactional
    public ToDo saveNewToDo(NewToDoDTO body, long userId) {
        User currentUser = us.findById(userId);
        ToDo newToDo = new ToDo(currentUser, body.description(), body.expirationDate(),body.state());
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

        toDo.setState(State.COMPLETED);

        if (toDo.isExpired()) {Done done = new Done(toDo.getUserId(), toDo.getDescription(), toDo.getExpirationDate(), toDo.getState());
            dd.save(done);
            td.delete(toDo);
        } else {td.save(toDo);
            Done done = new Done(toDo.getUserId(), toDo.getDescription(), toDo.getExpirationDate(), toDo.getState());
            dd.save(done);}
    }
    private void transitionToDoToDone(ToDo toDo) {
        Done done = new Done(toDo.getUserId(), toDo.getDescription(), toDo.getExpirationDate(), toDo.getState());
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
//    public void findByIdAndDelete(Long toDoId) {
//        ToDo found = this.findById(toDoId);
//        this.td.delete(found);
//    }
    @Transactional
    public void deleteTodoById(Long todoId) {
        Query query = entityManager.createQuery("DELETE FROM ToDo t WHERE t.id = :todoId");
        query.setParameter("todoId", todoId);
        int deletedCount = query.executeUpdate();
        System.out.println("Numero di righe eliminate per Todo: " + deletedCount);
    }
    public Page<ToDo> findByUserId(Long userId, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return td.findByUserId(userId, pageable);
    }
    public Page<ToDo> findByExpirationDate(LocalDate expirationDate, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return td.findByExpirationDate(expirationDate, pageable);
    }
    public Page<ToDo> findByState(State state, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return td.findByState(state, pageable);
    }
    @Transactional
    public void completeToDoAndUpdateDone(ToDo toDo) {
        toDo.setState(State.COMPLETED);
        transitionToDoToDone(toDo);
    }
    @Transactional
    public ToDo save(ToDo toDo) {
        return this.td.save(toDo);
    }



}

