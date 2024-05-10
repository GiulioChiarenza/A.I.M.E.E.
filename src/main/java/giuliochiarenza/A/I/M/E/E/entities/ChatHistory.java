package giuliochiarenza.A.I.M.E.E.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @JoinColumn(name = "user_id")
    private User userId;
    private String text;
    private Date interactionDate;


    public ChatHistory( User userId, String text, Date interactionDate) {
        this.userId = userId;
        this.text = text;
        this.interactionDate = interactionDate;
    }
}
