package giuliochiarenza.A.I.M.E.E.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
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
//    @JsonManagedReference
    @JoinColumn(name = "user_id")
    private User user;
    private String title;
    private String description;
    private LocalDate date;
    private String place;

    public Appointment( User user, String title, String description, LocalDate date, String place) {
        this.user = user;
        this.title = title;
        this.description = description;
        this.date = date;
        this.place = place;
    }
}
