const { v4: uuid } = require('uuid');

const DO_OTA_UPDATE = 1;
const DO_UNLOCK = 4;
const DO_BLINK = 5;
const SET_BLINK_SPEED = 2;
const SET_LOOP_DELAY = 3;

// These are the tasks that are recognized
// by the arduino code.  The taskId and task
// are fields are required for acks to work properly.
// Any other fields are custom to the command and
// passed into the task handler on the Arduino side.
// For example, the OTA updates have a custom field
// called `version` that tell the task handler which
// version of the firmware should be loaded.

const doOTAUpdate100 = () => ({
  taskId: uuid(),
  task: DO_OTA_UPDATE,
  version: '1.0.0' // download firmware version 1.0.0
});
const doOTAUpdate101 = () => ({
  taskId: uuid(),
  task: DO_OTA_UPDATE,
  version: '1.0.1' // download firmware version 1.0.1
});
const setLongLoopDelay = () => ({
  taskId: uuid(),
  task: SET_LOOP_DELAY,
  duration: 5000 // Set the main loop delay to 5 seconds
});
const setShortLoopDelay = () => ({
  taskId: uuid(),
  task: SET_LOOP_DELAY,
  duration: 1000 // Set the main loop delay to 1 second
});
const setBlinkSlow = () => ({
  taskId: uuid(),
  task: SET_BLINK_SPEED,
  duration: 300, // Set 300ms blink delay
  iterations: 10 // Blink for 10 iterations
});
const setBlinkFast = () => ({
  taskId: uuid(),
  task: SET_BLINK_SPEED,
  duration: 100, // Set 100ms blink delay
  iterations: 10 // Set to blink for 10 iterations
});
const doBlink = () => ({
  taskId: uuid(),
  task: DO_BLINK // Run the blink routine
});
const doUnlock = () => ({
  taskId: uuid(),
  task: DO_UNLOCK,
  duration: 5000 // Pulls pin 32 HIGH for 5 seconds.
});

module.exports = {
  doUnlock,
  doBlink,
  setBlinkFast,
  setBlinkSlow,
  setShortLoopDelay,
  setLongLoopDelay,
  doOTAUpdate100,
  doOTAUpdate101
};
