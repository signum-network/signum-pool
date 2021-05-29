package burst.pool.pool;

public class SubmissionException extends Exception {
    private static final long serialVersionUID = 2974403357208404084L;

    public SubmissionException() {
    }

    public SubmissionException(String message) {
        super(message);
    }
}
