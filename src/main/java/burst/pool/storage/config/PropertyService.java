package burst.pool.storage.config;

import signumj.entity.SignumAddress;

public interface PropertyService {
    void reloadIfModified();
    boolean getBoolean(Prop<Boolean> prop);
    int getInt(Prop<Integer> prop);
    long getLong(Prop<Long> prop);
    float getFloat(Prop<Float> prop);
    String getString(Prop<String> prop);
    String[] getStringList(Prop<String> prop);
    SignumAddress getSignumAddress(Prop<SignumAddress> prop);
}
