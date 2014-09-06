import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.Collection;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.concurrent.CopyOnWriteArrayList;

import org.java_websocket.WebSocket;
import org.java_websocket.WebSocketImpl;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import oscP5.*;
import netP5.*;
OscP5 oscP5;
NetAddress myRemoteLocation;

CopyOnWriteArrayList<Wave> waveList = new CopyOnWriteArrayList<Wave>();
HashMap<String, Wave> waveContainer = new HashMap<String, Wave>();
int quotient, time;
float columns, rows, w, h, x, y, modColumns, square, remainder;
boolean empty;
String boxNumberText;

boolean pulse = false;
boolean pulseStarted = false;

// START PIE STUFF
CopyOnWriteArrayList<Slice> slices = new CopyOnWriteArrayList<Slice>();
HashMap<String, Slice> sliceContainer = new HashMap<String, Slice>();
PFont helvetica;

// misc
float chartRadius = 300;
float minRad = MAX_FLOAT;
float maxRad = MIN_FLOAT;
// END PIE STUFF


void setup(){
  new ServerThread().start();
  
//  helvetica = createFont("Helvetica-Bold", 13);
//  textFont(helvetica);
  
  size(1280, 800);
  if (frame != null) {
    frame.setResizable(true);
  }
  colorMode(HSB);
  frameRate(30);  
  
  // osc stuff
  oscP5 = new OscP5(this, 8000);
  myRemoteLocation = new NetAddress("192.168.2.31", 8000);
 
 //generateChart();
}

void sumPieTotals() {
   // add up all values for totals
  float totalVal = 0.0;
  for (int i = 0; i < slices.size(); i++) {
    totalVal += slices.get(i).value;
  }

  // translate values into percent
  for (int i = 0; i < slices.size(); i++) {
    Slice s = slices.get(i);
    s.percentVal = s.value / totalVal;
  } 
  
}

void draw() {
   drawPies();
}

void drawPies() {
  background(255);

  sumPieTotals();
  
  // init start angle
  float startAngle = 0.0;
  
  // iterate through segments
  for (int i = 0; i < slices.size(); i++) {
    Slice slice = slices.get(i);
    
    // map percent to degrees
    float newVal = map(slice.percentVal, 0, 1, 0, 360);
    float newRad = slice.radius;
    
    // set angle
    float endAngle = startAngle + radians(newVal);

    // get mouse position relative to sketch center
    float translateX = map(mouseX, 0, width, -width/2, width/2);
    float translateY = map(mouseY, 0, height, -height/2, height/2);
    
    // first, get radius and angle by converting cartesian mouse coordinates to polar coordinates
    float mouseRad = sqrt(pow(translateY, 2) + pow(translateX, 2));
    float mouseAngle = atan2(translateY, translateX);
    
    // if is necessary to translate negative into positive values to get the full circle
    if (mouseAngle < 0) {
      mouseAngle = PI + (PI + mouseAngle);
    }
    
    // set fill
    noStroke();
    
    color hsvColor = color(slice.sliceColor, 255, 255);
    fill(hsvColor);
    
    // draw arc
    arc(width/2, height/2, newRad*2, newRad*2, startAngle, endAngle);
          
    // set start angle to end angle
    startAngle = endAngle;
  }
}

void drawWaves() {
  fill(0, 0, 0, 80);
  rect(0, 0, width, height);


//  fill(255);
//  textSize(32);
//  text("wifi: plug and play - password: ZKx6Vk77 - url: http://paulsc.net", 110, 30);  
  pulse();
  
  // to create rows, find the square root (and the remainder)
  // ex: n = 10, square = 4 (rounded up), remainder = 1
  int numberOfWaves = waveList.size();
  square = ceil(sqrt(numberOfWaves));
  remainder = numberOfWaves % square;
  quotient = ceil(numberOfWaves / square); 
  rows = square;
  columns = square;
  
  if(numberOfWaves == 2){
    rows = 1;
  }
  
  // divide the box width by the number of columns
  // and the box height by the number of rows,
  // then set this to the box width/height for this iteration
  h = height / rows;
  w = width / columns;
  
  Iterator it = waveList.iterator();

  // for each row in the imaginary matrix...
  for (int rowIndex = 0; rowIndex < square; rowIndex++) {

    // set y position based on the current row number * boxHeight
    y = h * rowIndex;
    
    // go through each column in the row...
    for (int colIndex = 0; colIndex < columns; colIndex++) {   
       
       // set x position based on current column number * boxWidth
       x = w * colIndex;
       
       // if the current box # is less than the total number of displayed boxes,
       // create a new box
       if (it.hasNext()) {
         Wave thisWave = (Wave) it.next();
         
         thisWave.setPos(x, y, w, h);
         thisWave.calcWave();         
         thisWave.display();
       }
    }
  } 
}

void pulse() {
  if (!pulseStarted) return;
  if (time < 100) time = time + 1; // keep growing up to a max 
  if (pulse) time = 10; // reset
} 
    
void oscEvent(OscMessage theOscMessage) {
  pulseStarted = true;
  int oscIn = theOscMessage.get(0).intValue();
  pulse = boolean(oscIn);
  print("|" + pulse);
}


public class ServerThread extends Thread{
  @Override
  public void run(){
    try{
        //WebSocketImpl.DEBUG = true;
        int port = 8887; // 843 flash policy port
        try {
          port = Integer.parseInt( args[ 0 ] );
        } catch ( Exception ex ) {
        }
        ChatServer s = new ChatServer( port );
        s.start();
        System.out.println( "ChatServer started on port: " + s.getPort() );

      }catch(IOException e){
        e.printStackTrace();
      }  
  }
}
public class ChatServer extends WebSocketServer {

  public ChatServer( int port ) throws UnknownHostException {
    super( new InetSocketAddress( port ) );
  }

  public ChatServer( InetSocketAddress address ) {
    super( address );
  }

  @Override
  public void onOpen( WebSocket conn, ClientHandshake handshake ) {
    System.out.println( conn.getRemoteSocketAddress().getAddress().getHostAddress() + " entered the room!" );
    
    Wave w = new Wave(waveList.size());
    waveContainer.put(conn.getRemoteSocketAddress().toString(), w);
    waveList.add(w);
    
    Slice slice = new Slice((int)random(100), 100);    
    slices.add(slice);
    sliceContainer.put(conn.getRemoteSocketAddress().toString(), slice);
  }

  @Override
  public void onClose( WebSocket conn, int code, String reason, boolean remote ) {
    System.out.println( conn + " has left the room!" );
    Wave w = waveContainer.get(conn.getRemoteSocketAddress().toString());
    waveList.remove(w);
    
    Slice s = sliceContainer.get(conn.getRemoteSocketAddress().toString());
    slices.remove(s);
  }

  @Override
  public void onMessage( WebSocket conn, String message ) {
    if (message == null || message.length() == 0) return;
    
    Wave w = waveContainer.get(conn.getRemoteSocketAddress().toString());
    String[] values = split(message, "|");
    int waveColor = Integer.parseInt(values[0]);
    int value1 = Integer.parseInt(values[1]); // -90 (phone pointing down) to 90 (phone pointing up) 
    //int value2 = Integer.parseInt(values[2]); // -180 to 180
    
    w.waveColor = waveColor;
    w.amplitude = 90 + (value1 * 4); // good range for amplitude is 0-400
    w.period = 500;
    
    Slice slice = sliceContainer.get(conn.getRemoteSocketAddress().toString());
    value1 = value1 * 12;
    if (value1 < 100) value1 = 100;
    slice.radius = value1;
    slice.sliceColor = waveColor;
  }

  @Override
  public void onError( WebSocket conn, Exception ex ) {
    ex.printStackTrace();
    if( conn != null ) {
      // some errors like port binding failed may not be assignable to a specific websocket
    }
  }

}
