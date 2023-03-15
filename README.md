# Signum Pool: open-source, fair, auditable

An open-source, fair, and auditable Signum mining pool software where miners can choose their _Share Model_ freely.

## Features

-   Accounts can join your pool using the [Signum XT Wallet](https://github.com/signum-network/signum-xt-wallet).
-   PoC+ boost calculated by the pool using recent deadlines (no boost drops)
-   Pool can be audited by API (all information is available to the public)
-   Miners can set individually their _share model_
-   Miners can set individually their donation fraction
-   Miners can set individually their minimum payout
-   Payouts by multi-out transactions with the current _standard_ fee (variable)
-   Support for multiple pool IDs (a primary and many secondaries)

![image](https://user-images.githubusercontent.com/35440957/166112978-39c80bee-af6c-4f4d-b41c-881d2b263d23.png)

## Pool shares

Using this pool software, each miner can have a different share model, ranging from 0 % (solo mining) up to 100 %.
Further, miners can change their share model at any moment.
As an example, let's consider a miner with 10 TiB of capacity, and that this miner has chosen a share model of 80 %.
So, this miner actually has 20 % of his capacity _solo mining_ (2 TiB) and 80 % going to the pool (8 TiB).
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

As already discussed, the amount each miner contribute to the pool share is a function of their _share model_.
In the following image, the schematics for a case where four different miners with 100 TiB capacity each have different share models:
![Pool Sankey Miners Diagram](/doc/Sankey-Miners.png)

Miners can configure not only the share model but also the percent they want to donate and the minimum payout.
Configuration changes are accomplished by sending text messages to the pool.

Additionally, multiple pool IDs can be managed in a _single_ pool.
There is the _primary_ ID, which makes the payments and receives the miner's _commands_ and there can be
multiple _secondary_ IDs.
Whenever a _secondary_ ID forges a block, its balance is transfered automatically to the primary ID so it can manage
the payments.

## Authors

* Originally by [Harry1453](https://github.com/harry1453)
* Updated by [jjos](https://github.com/jjos2372)
* Web application by [ipr0310](https://github.com/ipr0310)

## Donations are very welcome

* Harry1453-[S-HARR-YJSD-6JL2-9RE46](https://explorer.signum.network/address/8217266070159336183)
* jjos-[S-JJQS-MMA4-GHB4-4ZNZU](https://explorer.signum.network/address/3278233074628313816)
* ipr0310-[S-36WQ-GYQN-D856-9DUJH](https://explorer.signum.network/address/8629824288351884182)

## Pools using the software

-   https://signapool.notallmine.net
-   https://pool.signumcoin.ro
-   http://pool.btfg.space/
-   http://signa.voiplanparty.com:8124
-   http://signumpool.de:8080/
-   https://opensignumpool.ddns.net:8129

## Powered by
-   [Signum](https://github.com/signum-network/signum-node)
-   [SignumJS](https://github.com/signum-network/signumjs)
-   [React](https://reactjs.org/)
-   [MUI](https://mui.com/)

## Requirements

-   [Synced Signum node](https://github.com/signum-network/signum-node)
-   Java 64 Bits version 8 or 11
-   MariaDB (Optional, but recommended for advanced users)

## XT Wallet integration

 In order to be able to use the XT wallet module. For security reasons the pool website must be on **HTTPS** or localhost
 
<img src="https://user-images.githubusercontent.com/35440957/168082091-3480557d-8bdd-455b-88f5-f0ed8d1ff87e.png" width="100" height="50">

## Installation

-   [Download The Latest Release](https://github.com/signum-network/signum-pool/releases/latest)
-   Extract the zip file
-   Configure `pool.properties` to suit your needs
-   Run the jar file:

```
$ java -jar signum-pool.jar
```

You will need to wait some blocks before miners start to show their capacity

## Configuration

You need to modify the `pool.properties` file to suit your needs. Properties are explained in that file.

### Mine on Testnet

In order to make the pool mine on testnet network, you just need to add the following line `testnet = true`

### MariaDB backend (optional, advanced users)

In addition to the above steps:

-   Create a new MariaDB Database and create a user to access it
-   Configure `pool.properties` to use your database (server address, user, password, etc.)

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

Check the [react-pool folder](react-pool).

Before making customizations, be sure to visit that folder and read it's readme.md, discover tips that could give you a better development experience.

## API

The software provides a public API that can be used to audit the pool. The same API is used by the website user interface.

The API will be available at your pool address:port, similar to `https://opensignumpooltestnet.ddns.net:8139/api/`, with the following endpoints:

-   https://opensignumpooltestnet.ddns.net:8139/api/getConfig (returns the pool configuration details, fees, etc.)
-   https://opensignumpooltestnet.ddns.net:8139/api/getCurrentRound (returns the details of the current round/block)
-   https://opensignumpooltestnet.ddns.net:8139/api/getWonBlocks (returns the list of recently blocks won by the pool)
-   https://opensignumpooltestnet.ddns.net:8139/api/getMiners (returns the list of miners with recent valid deadlines)
-   https://opensignumpooltestnet.ddns.net:8139/api/getTop10Miners (returns the list with the top 10 miners)
-   https://opensignumpooltestnet.ddns.net:8139/api/getMiner/::MINER-ADDRESS (returns the details of a specific miner address)

All the capacities returned are in TiB.

## Building from source

### Pre-requisites

-   Gradle
-   JDK 8 or superior

### Building a release

Download or clone this repository and then run the following command on the project root directory:

`$ ./gradlew build`

This will download all the dependencies and build a release JAR and place it under `build/libs/`.
The release ZIP file will be found under `build/distributions`.
