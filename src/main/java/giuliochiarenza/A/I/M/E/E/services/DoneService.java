package giuliochiarenza.A.I.M.E.E.services;

import giuliochiarenza.A.I.M.E.E.entities.ChatHistory;
import giuliochiarenza.A.I.M.E.E.entities.Done;
import giuliochiarenza.A.I.M.E.E.entities.User;
import giuliochiarenza.A.I.M.E.E.enums.State;
import giuliochiarenza.A.I.M.E.E.exceptions.NotFoundException;
import giuliochiarenza.A.I.M.E.E.repositories.DoneDAO;
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
public class DoneService {

    @Autowired
    private DoneDAO dd;
    @Autowired
    private EntityManager entityManager;


    public Page<Done> getDoneList(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.dd.findAll(pageable);
    }

    public Page<Done> getDoneByUser(User user, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return dd.findByUser(user, pageable);
    }



    public Done findById(Long doneId) {
        return this.dd.findById(doneId).orElseThrow(() -> new NotFoundException(doneId));
    }
//    public void findByIdAndDelete(Long doneId) {
//        Done found = this.findById(doneId);
//        this.dd.delete(found);
//    }
@Transactional
public void deleteDoneById(Long doneId) {
    Query query = entityManager.createQuery("DELETE FROM Done d WHERE d.id = :doneId");
    query.setParameter("doneId", doneId);
    int deletedCount = query.executeUpdate();
    System.out.println("Numero di righe eliminate per Done: " + deletedCount);
}
    public Page<Done> findByState(State state, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return dd.findByState(state, pageable);
    }
    public Page<Done> findByCompletionDate(LocalDate completionDate, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return dd.findByCompletionDate(completionDate, pageable);
    }








}
