# Burstcoin Pool with Multi-Share Support

A Burstcoin Pool where miners can choose their *Share Model* where their capacity can be shared from 0 % (solo mining) up to 100 %.

Miners can configure not only the share model but also the percent they want to donate and the minimum payout.
Configuration changes are accomplished by sending text messages to the pool.

Check the [testnet version demo](http://nivbox.co.uk:9000).

Originally by [Harry1453](https://github.com/harry1453) (Donation address [BURST-W5YR-ZZQC-KUBJ-G78KB](https://explorer.burstcoin.network/?action=account&account=16484518239061020631)), updated by [jjos](https://github.com/jjos2372).

## Requirements

- MariaDB
- Java **8** (**Will not work on newer versions!!!**)

## Installation

- [Download The Latest Release](https://github.com/burst-apps-team/burstpool/releases/latest)
- Create a new MariaDB Database and create a user to access it.
- Extract the zip file. Configure `pool.properties` to suit your needs.
- You will need to wait some blocks before miners start to show their capacity.

## Configuration

You need to modify `pool.properties` to suit your needs. Properties are explained in that file.

## Customizing the Web UI

There are options to customize the site in the properties. Further modifications can be made by changing the contents of the JAR. Per the license terms, you must not remove the copyright notice at the bottom of the page, but you may make any other modifications you wish.

## Building

### Pre-requisites:

- Gradle
- JDK 8

### Building a release JAR

- `gradlew shadowJar` Will build a release JAR and place it under `build/libs/`
