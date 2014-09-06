import toxi.physics2d.constraints.*;
import toxi.physics2d.behaviors.*;
import toxi.physics2d.*;
import toxi.geom.*;
import java.util.Iterator;
 
static class StringPhysics {
  // number of particles for string
  static int STRING_RES=25;
   
  static VerletPhysics2D physics;
  static VerletParticle2D selectedParticle;
  
  static int pullHeight = 400;
      
  static void draw(PApplet app) {
    // 1st update
    physics.update();
    // then drawing
    //background(0);
    app.noStroke();
    app.fill(0,0,0,100);
    app.rect(0, 0, app.width, app.height);
    // draw all springs
    app.stroke(255,0,255);
    app.strokeWeight(5);
    for(VerletSpring2D s : physics.springs) {
      app.line(s.a.x,s.a.y, s.b.x, s.b.y);
    }
  
    selectedParticle=physics.particles.get(STRING_RES/2);
    selectedParticle.set(app.width/2, pullHeight);
  }
  
  static void initPhysics(PApplet app) {
    physics=new VerletPhysics2D();
    // set screen bounds as bounds for physics sim
    physics.setWorldBounds(new Rect(0,0,app.width,app.height));
    // add gravity along positive Y axis
    physics.addBehavior(new GravityBehavior(new Vec2D(0,0.1)));
    // compute spacing for string particles
    float delta=(float)app.width/(STRING_RES-1);
    println(delta);
    for(int i=0; i<STRING_RES; i++) {
      // create particles along X axis
      VerletParticle2D p=new VerletParticle2D(i*delta,app.height/2);
      physics.addParticle(p);
      // define a repulsion field around each particle
      // this is used to push the ball away
      physics.addBehavior(new AttractionBehavior(p,delta*1.5,-20));
      // connect each particle to its previous neighbour
      if (i>0) {
        VerletParticle2D q=physics.particles.get(i-1);
        VerletSpring2D s=new VerletSpring2D(p,q,delta*0.5,0.1);
        physics.addSpring(s);
      }
    }
    // lock 1st & last particles
    physics.particles.get(0).lock();
    physics.particles.get(physics.particles.size()-1).lock();
  }
  
}
