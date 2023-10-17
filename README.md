# ts-bacnet (typescript edition)

[![ts-bacnetLogo64](images/bacnet-icon-quad64.png)](https://www.npmjs.com/package/ts-bacnet)

The BACnet® protocol library written in pure Javascript/Typescript.

BACnet® is a protocol to interact with building automation devices defined by ASHRAE.

## Usage

Add ts-bacnet to your project by using:

``` sh
npm install --save ts-bacnet
```

The API documentation is available under **[GitHub Page of Docs](https://verticgreens.github.io/bacnet/)**.

### Features

The BACnet® standard defines a wide variety of services as part of the
specification. While ts-bacnet tries to be as complete as possible,
following services are already supported at this point in time:

| Service                        | Execute                                                                                | Handle                                                                        |
|--------------------------------|:--------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------:|
| Who Is                         | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.whoIs)                      | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.event:whoIs)       |
| I Am                           | yes¹                                                                                   | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.event:iAm)         |
| Who Has                        | yes¹                                                                                   | yes¹                                                                          |
| I Have                         | yes¹                                                                                   | yes¹                                                                          |
| Time Sync                      | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.timeSync)                   | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.event:timeSync)    |
| UTC Time Sync                  | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.timeSyncUTC)                | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.event:timeSyncUTC) |
| Read Property                  | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.readProperty)               | yes¹                                                                          |
| Read Property Multiple         | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.readPropertyMultiple)       | yes¹                                                                          |
| Read Range                     | yes¹                                                                                   | yes¹                                                                          |
| Write Property                 | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.writeProperty)              | yes¹                                                                          |
| Write Property Multiple        | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.writePropertyMultiple)      | yes¹                                                                          |
| Add List Element               | yes¹                                                                                   | yes¹                                                                          |
| Remove List Element            | yes¹                                                                                   | yes¹                                                                          |
| Create Object                  | yes¹                                                                                   | yes¹                                                                          |
| Delete Object                  | yes¹                                                                                   | yes¹                                                                          |
| Subscribe COV                  | yes¹                                                                                   | yes¹                                                                          |
| Confirmed COV Notification     | yes¹                                                                                   | yes¹                                                                          |
| Subscribe Property             | yes¹                                                                                   | yes¹                                                                          |
| Atomic Read File               | yes¹                                                                                   | yes¹                                                                          |
| Atomic Write File              | yes¹                                                                                   | yes¹                                                                          |
| Reinitialize Device            | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.reinitializeDevice)         | yes¹                                                                          |
| Device Communication Control   | [yes](https://biancoroyal.github.io/node-bacstack/bacstack.html#.deviceCommunicationControl) | yes¹                                                                          |
| Get Alarm Summary              | yes¹                                                                                   | yes¹                                                                          |
| Get Event Information          | yes¹                                                                                   | yes¹                                                                          |
| Get Enrollment Summary         | yes¹                                                                                   | yes¹                                                                          |
| Acknowledge Alarm              | yes¹                                                                                   | yes¹                                                                          |
| Confirmed Event Notification   | yes¹                                                                                   | yes¹                                                                          |
| Unconfirmed Event Notification | yes¹                                                                                   | yes¹                                                                          |
| Unconfirmed Private Transfer   | yes¹                                                                                   | yes¹                                                                          |
| Confirmed Private Transfer     | yes¹                                                                                   | yes¹                                                                          |
| Register Foreign Device        | no                                                                                     | yes¹                                                                          |
| Distribute Broadcast to Network| no                                                                                     | yes¹                                                                          |

¹ Support implemented as Beta (untested, undocumented, breaking interface)

## Contributing

This package is based on the work of Fabio Huser and is now community driven.
The group is searching for active collaborators to finish that library to become a good piece of Open Source.
Implementing and maintaining a protocol stack is a lot of work, therefore any
help is appreciated, from creating issues, to contributing documentation, fixing
issues, sending pull requests and adding new features.


## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2018-2023 Community Driven

Copyright (c) 2017-2019 Fabio Huser

**Note:** This is not an official product of the BACnet Advocacy Group.
BACnet® is a registered trademark of American Society of Heating, Refrigerating and
Air-Conditioning Engineers (ASHRAE).
