# Burstcoin Pool with Multi-Share Support

A Burstcoin Pool where miners can choose their *Share Model*.
Each miner can have a different share model, ranging from 0 % (solo mining) up to 100 %.
Further, miners can change their share model at any moment.

Please find below a Sankey flow schematic for the block rewards sharing among miners when a miner with 80% sharing forges a block (and has 4% of the shared mining power on the pool):
![Pool Sankey Diagram](/Sankey.png)

The amount each miner contribute to the pool share is also a function of the shared model. In the following image, the schematics for a case where four different miners with 100 TiB capacity each have different share models:
![Pool Sankey Miners Diagram](/Sankey-Miners.png)

Miners can configure not only the share model but also the percent they want to donate and the minimum payout.
Configuration changes are accomplished by sending text messages to the pool.

Check the [testnet version](http://nivbox.co.uk:9000) for a live demo.

Originally by [Harry1453](https://github.com/harry1453) (Donation address [BURST-W5YR-ZZQC-KUBJ-G78KB](https://explorer.burstcoin.network/?action=account&account=16484518239061020631)), updated by [jjos](https://github.com/jjos2372).

## Requirements

- MariaDB
- Java 8 or superior (**version 8 is recommended**)

## Installation

- [Download The Latest Release](https://github.com/jjos2372/burstpool/releases/latest)
- Create a new MariaDB Database and create a user to access it.
- Extract the zip file. Configure `pool.properties` to suit your needs (MariaDB user and password, etc.).
- You will need to wait some blocks before miners start to show their capacity.

## Configuration

You need to modify `pool.properties` to suit your needs. Properties are explained in that file.

## Customizing the Web UI

There are many options to customize the web UI in the properties file (explorer, faucet, discord server, ...).
Further modifications can be made by changing the contents of the JAR.
Per the license terms, you must not remove the copyright notice at the bottom of the page, but you may make any other modifications you wish.

## Building

### Pre-requisites

- Gradle
- JDK 8 or superior

### Building a release

Run the following command on the project root directory:

```$ ./gradlew buildZip```


This will download all the dependencies and build a release JAR and place it under `build/libs/`.
The release ZIP file will be found under `build/distributions`.

