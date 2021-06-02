/*
 * arduino_client for the node.js machine controller
 * For demo code, assumes LEDs are on the #defined ports
 * Optionally, a device on port 26 will receive HIGH (3v) signal
 * when unlock task is run.  If no device on port 26, unlock 
 * code will turn off RED led and turn on GREEN led while
 * lock is unlocked.
 */

#include <WiFi.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include "ota_control.h"

#define LED_BUILTIN 2
#define LED_GREEN 25
#define LED_RED 33
#define LOCK 26
#define DEBUG true

// Constants for machine control tasks
const int DO_OTA_UPDATE = 1;
const int SET_BLINK_SPEED = 2;
const int SET_LOOP_DELAY = 3;
const int DO_UNLOCK = 4;
const int DO_BLINK = 5;
const char* host = "http://192.168.1.1:5001";  // Node.js server's IP address
const char* wifiSSID = "YOURWIFINETWORKNAME";  // Your WIFI SSID
const char* wifiPW = "YOURWIFINETWORKPW"       // Your WIFI PW
const char* fwVersion = "1.0.1";               // Change this for whaever version your OTA is.

HTTPClient http;

int blinkDelay = 100;
int blinkIterations = 10;
int loopDelay = 5000;

void setup() {
  // put your setup code here, to run once:
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LOCK, OUTPUT);
  if(DEBUG){
    Serial.begin (115200);  // start a console
    Serial.print("Firmware version: ");
    Serial.println(fwVersion);
  }
  // Connect to WiFi network
  connectWiFi();
  
  // We need to set the clock if using HTTPS to verify certificate
  setClock();  

  // Set lights to default configuration
  digitalWrite(LED_RED, HIGH);
  digitalWrite(LED_GREEN, LOW);
}

void loop() {
  processTasks();
  delay(loopDelay);
}

/*
 * Connect to wifi
 */
void connectWiFi(){ 
  int attempt = 0;
  Serial.print(F("Wait for WiFi"));
  WiFi.begin(wifiSSID, wifiPW);
  while (WiFi.status() != WL_CONNECTED) {
    if(attempt > 20){
      // sometimes wifi gets hung up connecting
      // so restart if it has tried 20 times.
      esp_restart();
    }

    Serial.print (".");
    delay (1000);
    attempt++;
  }
  Serial.println(F("."));
}

/*
 * Set clock to UTC
 */
void setClock() {
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");

  Serial.print(F("Waiting for NTP time sync: "));
  time_t nowSecs = time(nullptr);
  while (nowSecs < 8 * 3600 * 2) {
    delay(500);
    Serial.print(F("."));
    yield();
    nowSecs = time(nullptr);
  }
  Serial.println();
  struct tm timeinfo;
  gmtime_r(&nowSecs, &timeinfo);
  Serial.print(F("Current time: "));
  Serial.println(asctime(&timeinfo));
}

/*
 * Calls server and gets a list of tasks to do
 */
void processTasks() {
  char url[132];
  int taskNumber;

  char postBody[200];
  DynamicJsonDocument statusDoc(200);
  statusDoc["mac"] = WiFi.macAddress(); 
  statusDoc["fw"] = fwVersion;
  serializeJson(statusDoc, postBody);

  strcpy(url, host);
  strcat(url, "/tasks");
  HTTPClient http;
  http.useHTTP10(true);  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Content-Length", "200");
  int responseCode = http.POST(postBody);
  
  if (responseCode > 0){
    DynamicJsonDocument tasks(2048);
    deserializeJson(tasks, http.getStream());
    http.end();

    int tasksToRun = tasks.size();

    for (taskNumber=0; taskNumber < tasksToRun; taskNumber++){
      // Switch case to control the task to run
      int currentTask = tasks[taskNumber]["task"];

      switch(currentTask) {
        case DO_BLINK:
          doBlink(tasks[taskNumber]);
          break;
        case SET_BLINK_SPEED:
          setBlinkSpeed(tasks[taskNumber]);
          break;
        case SET_LOOP_DELAY:
          setLoopDelay(tasks[taskNumber]);
          break;
        case DO_OTA_UPDATE:
          doOTAUpdate(tasks[taskNumber]);
          break;
        case DO_UNLOCK:
          doUnlock(tasks[taskNumber]);
          break;
      }
    }
    // let us see that it is polling if no tasks were run.
    if (DEBUG)  Serial.print('.');
  } else {
    if (DEBUG){
    Serial.print("HTTP response error: ");
    Serial.println(responseCode);
    }
  }
}

/*
 * Send ACK for taskID
 */
void ack(const char* taskId){
  char postBody[200];
  DynamicJsonDocument statusDoc(200);
  statusDoc["mac"] = WiFi.macAddress(); 
  statusDoc["fw"] = fwVersion;
  statusDoc["taskId"] = taskId;
  serializeJson(statusDoc, postBody);

  char url[132];
  strcpy(url, host);
  strcat(url, "/tasks/ack");
  HTTPClient http;
  http.useHTTP10(true);  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.POST(postBody);
  http.end();
}

/*
 * doBlink task
 */
void doBlink(JsonObject task){
  const char* taskId = task["taskId"].as<char*>();

  int blinkCount;
  for(blinkCount=0; blinkCount <  blinkIterations; blinkCount++){
    digitalWrite(LED_RED, LOW);   
    digitalWrite(LED_GREEN, HIGH);
    delay(blinkDelay);            
    digitalWrite(LED_RED, HIGH);  
    digitalWrite(LED_GREEN, LOW); 
    delay(blinkDelay);            
  }
  ack(taskId);
}

/*
 * setBlinkSpeed task
 */
void setBlinkSpeed(JsonObject task){
  if(DEBUG) Serial.println("setLoopDelay called");
  const char* taskId = task["taskId"].as<char*>();
  blinkDelay = task["duration"];
  blinkIterations = task["iterations"];

  ack(taskId);
}

/*
 * setLoopDelay task
 */
void setLoopDelay(JsonObject task){
  if(DEBUG) Serial.println("setLoopDelay called");

  int delay = task["duration"];
  const char* taskId = task["taskId"].as<char*>();

  loopDelay = delay;
  ack(taskId);
}

/*
 * Do an OTA firmware update
 */
void doOTAUpdate(JsonObject task){
  if(DEBUG) Serial.println("doOTAUpdate called");

  const char* version = task["version"];
  const char* taskId = task["taskId"].as<char*>();

  digitalWrite(LED_GREEN, HIGH);   
  bool doReboot = loadFirmware(host, version);
  digitalWrite(LED_GREEN, LOW);   
  ack(taskId);
  if(doReboot) {
    Serial.println(F("Rebooting..."));
    esp_restart();
  }
}

/*
 * doUnlock task
 */
void doUnlock(JsonObject task){
  if(DEBUG) Serial.println("doUnlock called");

  int duration = task["duration"];
  const char* taskId = task["taskId"].as<char*>();

  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_RED, LOW);
  digitalWrite(LOCK, HIGH);
  delay(duration);
  digitalWrite(LOCK, LOW);
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_RED, HIGH);
  ack(taskId);
}
