#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>  

#define RED_PIN 23
#define GREEN_PIN 22
#define BLUE_PIN 21

const char* ssid = "ESP32_WAP";  
const char* password = "12345678";  

AsyncWebServer server(80); 

void setup() {
  Serial.begin(115200);

  WiFi.softAP(ssid, password);
  Serial.println("ESP32 Network started");


  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);


  server.on("/led", HTTP_POST, [](AsyncWebServerRequest *request){
    request->send(200, "application/json", "{\"status\":\"Received POST request\"}");
  });
  server.onRequestBody([](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total){
    String body = String((char*)data);

    // Create a JSON document
    StaticJsonDocument<200> doc;

    // Parse the JSON payload
    DeserializationError error = deserializeJson(doc, body);
    
    if (error) {
      Serial.println("Failed to parse JSON");
      return;
    }

    String color = doc["color"];

  // Set color
    if (color == "blue") {
      digitalWrite(RED_PIN, LOW);
      digitalWrite(GREEN_PIN, LOW);
      digitalWrite(BLUE_PIN, HIGH);  
      request->send(200, "application/json", "{\"status\":\"Blue LED turned on\"}");
    } else if (color == "red") {
      digitalWrite(RED_PIN, HIGH);
      digitalWrite(GREEN_PIN, LOW);
      digitalWrite(BLUE_PIN, LOW); 
      request->send(200, "application/json", "{\"status\":\"Red LED turned on\"}");
    } else if (color == "green") {
      digitalWrite(RED_PIN, LOW);
      digitalWrite(GREEN_PIN, HIGH);
      digitalWrite(BLUE_PIN, LOW); 
      request->send(200, "application/json", "{\"status\":\"Green LED turned on\"}");
    } else if (color == "off"){
      digitalWrite(RED_PIN, LOW);
      digitalWrite(GREEN_PIN, LOW);
      digitalWrite(BLUE_PIN, LOW);  
      request->send(200, "application/json", "{\"status\":\"LEDs turned off\"}");
    }
  });

  server.begin();
}

void loop() {
}
