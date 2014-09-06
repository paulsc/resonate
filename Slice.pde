class Slice {
  
  Slice(float value, float radius) {
    this.value = value;
    this.radius = radius;
    this.sliceColor = (int) random(255);
  }
  
  float value;
  float radius;
  float percentVal;
  int sliceColor;
}

