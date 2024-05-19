package giuliochiarenza.A.I.M.E.E.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import giuliochiarenza.A.I.M.E.E.enums.State;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "to_do")
@Data
@NoArgsConstructor
public class ToDo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private long id;
    @ManyToOne
//    @JsonManagedReference
    @JoinColumn(name = "user_id")
    private User userId;
    private String description;
    private LocalDate expirationDate;
    @Enumerated(EnumType.ORDINAL)
    private State state;


    public ToDo( User userId, String description, LocalDate expirationDate, State state) {
        this.userId = userId;
        this.description = description;
        this.expirationDate = expirationDate;
        this.state = state;
    }
    public Boolean isCompleted(){
        return state == State.COMPLETED;
    }
    public Boolean isPending(){
        return state == State.PENDING;
    }
    public Boolean isInProgress(){
        return state == State.INPROGRESS;
    }
    public Boolean isExpired(){
        return state == State.EXPIRED;
    }
    public Done toDone() {
        Done done = new Done();
        done.setDescription(this.getDescription());
        done.setCompletionDate(LocalDate.now());
        done.setState(this.getState());
        return done;
    }
}
