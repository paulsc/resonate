import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.util.Collection;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Iterator;

import org.java_websocket.WebSocket;
import org.java_websocket.WebSocketImpl;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

ArrayList<Wave> waveList = new ArrayList<Wave>();
HashMap<String, Wave> waveContainer = new HashMap<String, Wave>();
int quotient;
float columns, rows, w, h, x, y, modColumns, square, remainder;
boolean empty;
String boxNumberText;

void setup(){
  new ServerThread().start();
  
  size(1280, 800);
  if (frame != null) {
    frame.setResizable(true);
  }
  colorMode(HSB);
  frameRate(30);  
}

void draw() {
   background(0);
  
  // to create rows, find the square root (and the remainder)
  // ex: n = 10, square = 4 (rounded up), remainder = 1
  int numberOfWaves = waveList.size();
  square = ceil(sqrt(numberOfWaves));
  remainder = numberOfWaves % square;
  quotient = ceil(numberOfWaves / square); 
  rows = square;
  columns = square;
  
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
         if (thisWave.deleted) it.remove();
         
         thisWave.setPos(x, y, w, h);
         thisWave.calcWave();         
         thisWave.display();
       }
    }
  } 
}

//create a separate thread for the server not to freeze/interfere with Processing's default animation thread
public class ServerThread extends Thread{
  @Override
  public void run(){
    try{
          WebSocketImpl.DEBUG = true;
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
  }

  @Override
  public void onClose( WebSocket conn, int code, String reason, boolean remote ) {
    System.out.println( conn + " has left the room!" );
    Wave w = waveContainer.get(conn.getRemoteSocketAddress().toString());
    w.deleted = true;
  }

  @Override
  public void onMessage( WebSocket conn, String message ) {
  }

  @Override
  public void onError( WebSocket conn, Exception ex ) {
    ex.printStackTrace();
    if( conn != null ) {
      // some errors like port binding failed may not be assignable to a specific websocket
    }
  }

}
