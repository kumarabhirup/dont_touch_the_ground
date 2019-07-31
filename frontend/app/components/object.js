/* global p5, Koji, Matter, world */

const { Bodies, World } = Matter

class Object {
  constructor (
    cordinates = {x: null, y: null}, // positioning
    sizing = {width: null, height: null, radius: null}, // if the shape is circle, provide radius, else... width and height
    settings = {shape: Koji.config.settings.objectShape, image: Koji.config.images.objectImage || null} // shape can either be a circle or a rectangle
  ) {
    this.cordinates = cordinates
    this.sizing = sizing
    this.settings = settings

    switch (this.settings.shape) {
      case 'circle':
        this.body = Bodies.circle(this.cordinates.x, this.cordinates.y, this.sizing.radius)
        break

      case 'rectangle':
        this.body = Bodies.rectangle(this.cordinates.x, this.cordinates.y, this.sizing.width, this.sizing.height)
        break
    
      default:
        break
    }

    World.add(world, this.body)
  }

  show() {
    // Do something here
  }
}
