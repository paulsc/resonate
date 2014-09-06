class Ripple{
  int radius, counter;
  
  Ripple(int r){
    this.radius = r;
    this.counter = 1;
  }
  
 void update(){
   stroke(255);
   strokeWeight(4);
   noFill();
   
   radius += 30 * counter;
   ellipse(width/2, height/2, radius, radius);
   
   counter++;
 } 
}
