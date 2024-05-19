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
@Table(name = "chat_history")
@Data
@NoArgsConstructor
public class ChatHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private long id;
    @ManyToOne
//    @JsonManagedReference
    @JoinColumn(name = "user_id")
    private User userId;
    @Column(columnDefinition = "TEXT")
    private String text;
    private LocalDate interactionDate;


    public ChatHistory( User userId, String text, LocalDate interactionDate) {
        this.userId = userId;
        this.text = text;
        this.interactionDate = interactionDate;
    }
}
