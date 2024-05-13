package giuliochiarenza.A.I.M.E.E.exceptions;



import giuliochiarenza.A.I.M.E.E.dto.ErrorsDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ExceptionsHandler {

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)                 // 400
    public ErrorsDTO handleBadRequest(BadRequestException ex) {
        if (ex.getErrorList() != null) {
            String message = ex.getErrorList().stream()
                    .map(objectError -> objectError.getDefaultMessage())
                    .collect(Collectors.joining(". "));
            return new ErrorsDTO(message, LocalDateTime.now());
        } else {
            return new ErrorsDTO(ex.getMessage(), LocalDateTime.now());
        }
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)                 // 404
    public ErrorsDTO handleNoFoundException(NotFoundException ex) {
        return new ErrorsDTO(ex.getMessage(), LocalDateTime.now());
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)            // 401
    public ErrorsDTO handleUnauthorizedException(Exception ex) {
        return new ErrorsDTO(ex.getMessage(), LocalDateTime.now());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)   // 500
    public ErrorsDTO handleBadRequest(Exception ex) {
        ex.printStackTrace();
        return new ErrorsDTO("Internal error! Please wait until it's fixed!", LocalDateTime.now());
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)               // 403
    public ErrorsDTO handleForbidden(AccessDeniedException ex) {
        return new ErrorsDTO("You do not have access to this feature!", LocalDateTime.now());
    }
}