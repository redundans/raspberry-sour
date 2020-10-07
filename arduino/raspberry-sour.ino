#include <OneWire.h>
#include <DallasTemperature.h>

/** 
 *  This Arduino script does controlles a cooling system by retriving a 
 *  temperature through the serial bus and tries to regulate the temperature
 *  read from the OneWire bus by switching a cooling element on and off.
 *  
 *  Url: 
 */

// Data wire is plugged into pin 2 on the Arduino
#define ONE_WIRE_BUS 2
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);
// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);
// Temperature variable.
float TEMP = 0;

void setup() {
  // Set serial port to 9600 baud.
  Serial.begin(9600);

  // Start Temperature sensor.
  sensors.begin();
}

void loop() {
  // Get current temperature.
  sensors.requestTemperatures();
  TEMP = sensors.getTempCByIndex(0);

  // Return current temperature to serial.
  Serial.println(TEMP);
  
  // Pause loop for 1 sec.
  delay(1000);
}
