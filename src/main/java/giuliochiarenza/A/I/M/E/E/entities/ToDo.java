package giuliochiarenza.A.I.M.E.E.entities;

import giuliochiarenza.A.I.M.E.E.enums.State;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @JoinColumn(name = "user_id")
    private User userId;
    private String description;
    private Date expirationDate;
    private State state;


    public ToDo( User userId, String description, Date expirationDate, State state) {
        this.userId = userId;
        this.description = description;
        this.expirationDate = expirationDate;
        this.state = state;
    }
}
