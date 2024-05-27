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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

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
//        checkExpiredToDos();
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.td.findAll(pageable);
    }




    @Transactional
    public ToDo saveNewToDo(NewToDoDTO body, long userId) {
        LocalDate expirationDate = body.expirationDate();
        LocalDate today = LocalDate.now();

        if (expirationDate.isBefore(today)) {
            throw new IllegalArgumentException("The expiration date cannot be in the past.");
        }
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

        toDo.setState(State.EXPIRED);

        if (toDo.isExpired()) {Done done = new Done(toDo.getUser(), toDo.getDescription(), toDo.getExpirationDate(), toDo.getState());
            dd.save(done);
            td.delete(toDo);
        } else {td.save(toDo);
            Done done = new Done(toDo.getUser(), toDo.getDescription(), toDo.getExpirationDate(), toDo.getState());
            dd.save(done);}
    }



    private void transitionToDoToDone(ToDo toDo) {
        Done done = new Done(toDo.getUser(), toDo.getDescription(), toDo.getExpirationDate(), toDo.getState());
        dd.save(done);
        td.delete(toDo);
    }



    public ToDo findById(Long toDoId) {
        return this.td.findById(toDoId).orElseThrow(() -> new NotFoundException(toDoId));
    }



    public ToDo findByIdAndUpdate(Long toDoId, ToDo updatedToDo) {
        ToDo found = this.findById(toDoId);
        found.setUser(updatedToDo.getUser());
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




    public Page<ToDo> getToDoByUser(User user, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return td.findByUser(user, pageable);
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


//    @Transactional
//    @Scheduled(cron = "0 0 * * * *")
//    public void checkExpiredToDos() {
//        LocalDate today = LocalDate.now();
//        List<ToDo> expiredToDos = findExpiredToDos(today);
//
//        for (ToDo todo : expiredToDos) {
//            if (!todo.isCompleted() && !todo.isExpired()) {
//                todo.setState(State.EXPIRED);
//                completeToDoAndUpdateDone(todo);
//            } else if (todo.isExpired() && todo.isCompleted()) {
//                deleteTodoById(todo.getId());
//                Done done = new Done(todo.getUserId(), todo.getDescription(), todo.getExpirationDate(), todo.getState());
//                dd.save(done);
//            }
//        }
//    }
//
//    public List<ToDo> findExpiredToDos(LocalDate currentDate) {
//        return td.findByExpirationDateBeforeAndStateNot(currentDate, State.EXPIRED);
//    }

}

