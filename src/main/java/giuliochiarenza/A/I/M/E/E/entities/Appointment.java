package giuliochiarenza.A.I.M.E.E.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Entity
@Table(name = "appointment")
@Data
@NoArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User userId;
    private String title;
    private String description;
    private Date date;
    private String place;

    public Appointment( User userId, String title, String description, Date date, String place) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.date = date;
        this.place = place;
    }
}
