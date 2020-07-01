ALTER TABLE miners ADD shared_capacity DOUBLE DEFAULT(0.0);

ALTER TABLE miners ADD donation_percent INT DEFAULT(1);
