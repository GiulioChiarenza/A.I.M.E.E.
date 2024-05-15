package giuliochiarenza.A.I.M.E.E.services;

import giuliochiarenza.A.I.M.E.E.entities.Done;
import giuliochiarenza.A.I.M.E.E.enums.State;
import giuliochiarenza.A.I.M.E.E.exceptions.NotFoundException;
import giuliochiarenza.A.I.M.E.E.repositories.DoneDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class DoneService {

    @Autowired
    private DoneDAO dd;


    public Page<Done> getDoneList(int page, int size, String sortBy) {
        if (size > 50) size = 50;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return this.dd.findAll(pageable);
    }
    public Done findById(Long doneId) {
        return this.dd.findById(doneId).orElseThrow(() -> new NotFoundException(doneId));
    }
    public void findByIdAndDelete(Long doneId) {
        Done found = this.findById(doneId);
        this.dd.delete(found);
    }
    public Page<Done> findByState(State state, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return dd.findByState(state, pageable);
    }
    public Page<Done> findByCompletionDate(Date completionDate, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return dd.findByCompletionDate(completionDate, pageable);
    }








}
