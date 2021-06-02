/* eslint-disable no-unused-vars */
const fs = require('fs');

const {
  doUnlock,
  doBlink,
  setBlinkFast,
  setBlinkSlow,
  setShortLoopDelay,
  setLongLoopDelay,
  doOTAUpdate100,
  doOTAUpdate101
} = require('./taskPayloads');

// Get tasks simulates events that might
// be sourced from a back-end database.

// The tasks come from ./taskPayloads.js

// Uncomment a task or tasks and save to make the
// arduino client perform a task on the next
// polling iteration.

const getTasks = async () => {
  const tasks = [];

  // During blink phase, sets how fast to blink
  // The set routines do not cause a blink, they
  // just change the setting on the device.
  // push the doBlink() task to cause a blink.

  // tasks.push(setBlinkFast());
  // tasks.push(setBlinkSlow());
  tasks.push(doBlink());

  // Set delay at the end of the main loop phase

  // tasks.push(setShortLoopDelay());
  // tasks.push(setLongLoopDelay());

  // Sets arduino version to download

  // tasks.push(doOTAUpdate100());
  // tasks.push(doOTAUpdate101());

  // Sets "Lock" pin 26 high for 5 seconds

  // tasks.push(doUnlock());
  return tasks;
};

// Processes an acknowledgement that the task was done.
// In a "real" app this might update a database
// that the task was completed.  Here we just console log
// that the task was done.

const ackTask = async payload => {
  console.log(`ACK-> ${payload.taskId}`);
  return true;
};
module.exports = { ackTask, getTasks };
