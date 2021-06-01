# Signum Pool: choose your share (language) freely

A Signum mining pool software where miners can choose their *Share Model* freely.
Each miner can have a different share model, ranging from 0 % (solo mining) up to 100 %.
Further, miners can change their share model at any moment.

As an example, let's consider a miner with 10 TiB of capacity, and that this miner has chosen a share model of 80 %.
So, this miner actually has 20 % of his capacity *solo mining* (2 TiB) and 80 % going to the pool (8 TiB).
Let's also assume the pool has a total shared capacity (the sum of all shared capacities of all miners) of 160 TiB.
Since our miner is sharing 8 TiB he also has 5 % of the pool share (8/160).
Now, when this miner forges a block, the block reward (assumed to be 100 Signa here) would be distributed as follows:
![Pool Sankey Diagram](/doc/Sankey.png)

As can be seen, when our miner forges a block, the reward is split between the shared fraction (80% in this case) and the forger fraction (20%) in this case.
After that, the shared fraction is further split among all miners in the pool accordingly to their pool shares.
In this case, the forger has 5 % of the shared capacity, so he also gets additional 4 Signa (5% of 80).

Just to simplify the share computations, in the above analysis the pool fees were assumed to be zero.
Actually the pool fees are subtracted from the block reward before anything else.
Additionally, each miner can configure a donation fraction, subtracted from their individual payments.

As already discussed, the amount each miner contribute to the pool share is a function of their *share model*.
In the following image, the schematics for a case where four different miners with 100 TiB capacity each have different share models:
![Pool Sankey Miners Diagram](/doc/Sankey-Miners.png)

Miners can configure not only the share model but also the percent they want to donate and the minimum payout.
Configuration changes are accomplished by sending text messages to the pool.

Additionally, multiple pool IDs can be managed in a *single* pool.
There is the *primary* ID, which makes the payments and receives the miner's *commands* and there can be
multiple *secondary* IDs.
Whenever a *secondary* ID forges a block, its balance is transfered automatically to the primary ID so it can manage
the payments.

Check a [testnet live demo](http://nivbox.co.uk:9000).

Originally by [Harry1453](https://github.com/harry1453),
updated by [jjos](https://github.com/jjos2372).

Donations are very welcome at [S-JJQS-MMA4-GHB4-4ZNZU](https://explorer.burstcoin.network/?action=account&account=3278233074628313816).

## Features

- Miners can set individually their *share model*
- Miners can set individually their donation fraction
- Miners can set individually their minimum payout
- Payouts by multi-out transactions with the current *standard* fee (variable)
- Support for multiple pool IDs (a primary and many secondaries)

## Requirements

- Java 64 Bits version 8 or 11
- MariaDB (optional, for advanced users)

## Installation

- [Download The Latest Release](https://github.com/jjos2372/burstpool/releases/latest)
- Extract the zip file
- Configure `pool.properties` to suit your needs
- Run the jar file:

```
$ java -jar signum-pool.jar
```

You will need to wait some blocks before miners start to show their capacity

## Configuration

You need to modify the `pool.properties` file to suit your needs. Properties are explained in that file.

### MariaDB backend (optional, advanced users)
 In addition to the above steps:
 
- Create a new MariaDB Database and create a user to access it
- Configure `pool.properties` to use your database (server address, user, password, etc.)

### Create a Systemd Service (optional, Linux advanced users)

Create a file named `/etc/systemd/system/signum-pool.service` with the following contents (**edit the user and paths**):

```
[Unit]
Description=Signum Pool
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=user
WorkingDirectory=/home/user/signum-pool-v1.7.0
ExecStart=/usr/bin/java -jar /home/user/signum-pool-v1.7.0/signum-pool.jar

[Install]
WantedBy=multi-user.target
```

Now you should be able to start the service with:

```
sudo service signum-pool start
```

Similarly you can also stop the service with:

```
sudo service signum-pool stop
```

Additionally, it will automatically restart if your machine reboots.

Logs will be available by running:

```
journalctl -u signum-pool.service
```

## Customizing the Web UI

There are many options to customize the web UI in the properties file (explorer, faucet, discord server, ...).
Further modifications can be made by changing the contents of the `html` folder.
Per the license terms, you must not remove the copyright notice at the bottom of the page, but you may make any other modifications you wish.

## Building from source

### Pre-requisites

- Gradle
- JDK 8 or superior

### Building a release

Download or clone this repository and then run the following command on the project root directory:

```$ ./gradlew build```


This will download all the dependencies and build a release JAR and place it under `build/libs/`.
The release ZIP file will be found under `build/distributions`.

