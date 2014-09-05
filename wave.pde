class Wave{
  int x, y, w, h, id, xSpacing, colSpacing, rowSpacing, waveColor, amplitude;
  boolean empty;
  float[] yValues;
  // float[] amplitude = new float[numUsers];
  float theta, period, dx, particleX;
        
  Wave(int id) {
    waveColor = int(random(255));
    amplitude = int(random(10, 100));
    this.id = id;
    x = 0;
    y = 0;
    w = width + 8;
    h = height;
    xSpacing = 5;
    theta = random(0.0, 1.0);
    period = random(200.0, 500.0);
    dx = (TWO_PI / period) * xSpacing;
    yValues = new float[w/xSpacing];
    colSpacing = 0;
  }
  
  void calcWave() {
    yValues = new float[w/xSpacing];
    
    // Increment theta (try different values for 'angular velocity' here
    theta += 0.05;
  
    // For every x value, calculate a y value with sine function
    particleX = theta;
    
    // For each yvalue
    for (int i = 0; i < yValues.length; i++) {
      yValues[i] = sin(particleX) * amplitude;// amplitude;
      particleX+=dx;
    }
  }
  
  void display() {
    noStroke();
    fill(waveColor, 255, 255);
    
    // draw particles
    for (int i = 0; i < yValues.length; i++) {
      ellipse((i * xSpacing) + colSpacing, (h/2) + yValues[i] + rowSpacing, 8, 8);
    }
  }
  
  void setPos(float x, float y, float w, float h, float colSpacing, float rowSpacing) {
    this.x = floor(x);
    this.y = floor(y);
    this.w = floor(w);
    this.h = floor(h);
    this.colSpacing = floor(colSpacing);
    this.rowSpacing = floor(rowSpacing);
  }
}
