# node-arduino-machine-control

## CREDITS:

Arduino code with nodeJS OTA updater

## The Arduino OTA code was inspired by and should be mostly credited to

@enfieldcat [https://github.com/enfieldcat]

Based on the article (s)he published here:
https://conferre.cf/arduino/ota_updater.php

## Purpose

This is a machine control application that allows control of tasks from a node.js Express application. The basic concept is that the arduino client polls the node.js server for tasks to do, which are returned in a JSON array and processed by the client.

Included in the node client is the ability to dispatch firmware versions to the client to install to allow remote updating of clients.

## nodeJS app:

To start the node app, run the following at the command line

`% npm start`

To dispatch task(s), uncomment lines from the `./src/services/tasks.js` file that
begin with `push()`.

## arduino app:

The arduino app is in:

`./arduino/arduino_client`.

You can modify the Arduino app in VS Code or the Arduino app. To publish versions for OTA updating, Exporting a Compiled Binary from the arduino app. The .bin file will be saved into the same folder. Drag the .bin file into the appropriate version folder under

`./src/services/ota/bin`

The OTA updater will look for a folder with the version number and send the .bin file in that folder to the updater.

This code was built using an ESP32 with built-in wifi. I have no idea what changes, if any, are necessary for other device flavors.

## IDE

The node/arduino code was built using VS Code. To learn more about how to use VS Code with Arduino, I recommend checking out

https://maker.pro/arduino/tutorial/how-to-use-visual-studio-code-for-arduino

# Tasks

The tasks that the arduino code knows how to deal with are in

`./src/services/tasks/taskPayloads.js`

The basic structure of a task object is:

```javascript
{
    taskId: '12345',  // any string or uuid will do
    task: 2           // integer ID or a task.  The arduino looks for integers.
    customValue1: 'something the taks recoginzes',
    customValueN: 123  // custom values are passed into the task on the adruino.
}
```

Heres the Arduino code that can read a custom field called `duration` :

```javascript
{
  taskId: uuid(),
  task: SET_LOOP_DELAY, // SET_LOOP_DELAY = 3
  duration: 1000 // Set the main loop delay to 1 second
}
```

```cpp
void setLoopDelay(JsonObject task){
  if(DEBUG) Serial.println("setLoopDelay called");

  int delay = task["duration"];  // this is a custom field
  const char* taskId = task["taskId"].as<char*>();

  loopDelay = delay;
  ack(taskId);
}
```
