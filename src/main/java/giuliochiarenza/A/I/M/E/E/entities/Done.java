package giuliochiarenza.A.I.M.E.E.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "done")
@Data
@NoArgsConstructor
public class Done {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User userId;
    private String description;
    private Date completitionDate;


    public Done( User userId, String description, Date completitionDate) {
        this.userId = userId;
        this.description = description;
        this.completitionDate = completitionDate;
    }
}
