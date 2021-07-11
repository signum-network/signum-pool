package burst.pool.entity;

import signumj.entity.SignumID;
import signumj.entity.SignumValue;

public class Payout {
    private final SignumID transactionId;
    private final byte[] senderPublicKey;
    private final SignumValue fee;
    private final int deadline;
    private final byte[] attachment;

    public Payout(SignumID transactionId, byte[] senderPublicKey, SignumValue fee, int deadline, byte[] attachment) {
        this.transactionId = transactionId;
        this.senderPublicKey = senderPublicKey;
        this.fee = fee;
        this.deadline = deadline;
        this.attachment = attachment;
    }

    public SignumID getTransactionId() {
        return transactionId;
    }

    public byte[] getSenderPublicKey() {
        return senderPublicKey;
    }

    public SignumValue getFee() {
        return fee;
    }

    public int getDeadline() {
        return deadline;
    }

    public byte[] getAttachment() {
        return attachment;
    }
}
