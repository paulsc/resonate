ArrayList<Wave> waveContainer;
int numberOfWaves, quotient, currentWave;
float columns, rows, w, h, x, y, modColumns, square, remainder;
boolean empty;
String boxNumberText;

// Using an array to store height values for the wave
float[][] yvalues;

void setup(){
  size(1280, 800);
  if (frame != null) {
    frame.setResizable(true);
  }
  colorMode(HSB);
  frameRate(30);
  
  waveContainer = new ArrayList<Wave>();
  waveContainer.add(new Wave(1));
  numberOfWaves = 1;
  
  yvalues = new float[numberOfWaves][];
  
  currentWave = 0;
}

void draw(){
  background(0);
  
  if(keyPressed) {
    if(keyCode == UP){
      numberOfWaves++;
    } else if(keyCode == DOWN && numberOfWaves > 1){
      numberOfWaves--;
    }
  }
  println(numberOfWaves);
  
  // to create rows, find the square root (and the remainder)
  // ex: n = 10, square = 4 (rounded up), remainder = 1
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
  
  currentWave = 0;
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
       if (currentWave < numberOfWaves) {
         waveContainer.add(new Wave(numberOfWaves));
         
         Wave thisWave = waveContainer.get(currentWave);
         thisWave.setPos(x, y, w, h, colIndex * w, rowIndex * h);
         thisWave.calcWave();         
         thisWave.display();
       }
       
       currentWave++;
    }
  }
}
