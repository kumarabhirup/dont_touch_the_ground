/* global p5, Koji, Matter, world, imgObject */

const { Bodies, World } = Matter

class GameObject {
  constructor (
    cordinates = {x: null, y: null}, // positioning
    sizing = {width: null, height: null, radius: null}, // if the shape is circle, provide radius, else... width and height
    settings = {shape: Koji.config.strings.objectShape, image: imgObject, color: { r: 0, g: 255, b: 255, a: 1 }, rotate: true} // shape can either be a circle or a rectangle
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

  /**
   * @description check for collision of this object to any other object
   * @returns true if the otherElement is touching this element.
   * @param {object} otherElement  - {sizing: {x: 100, y: 100}, body: Matter-js-body}
   */
  didTouch(otherElement) {
    let body = otherElement.body

    let circle = { x: this.cordinates.x, y: this.cordinates.y, radius: this.sizing.radius }
    let rectangle = { x: body.position.x, y: body.position.y, w: otherElement.sizing.width, h: otherElement.sizing.height }

    return rectCircleColliding(circle, rectangle)
  }

  show() {
    const { position, angle } = this.body
    const diameter = this.sizing.radius * 2
 
    push()
    translate(position.x, position.y)
    this.settings.rotate ? rotate(angle) : null

    switch (this.settings.shape) {
      case 'circle':
        this.settings.image 
          ?
          (() => {
            imageMode(CENTER)
            image(this.settings.image, 0, 0, diameter, diameter)
          })()
          :
          (() => {
            fill(this.settings.color.r, this.settings.color.g, this.settings.color.b)
            ellipse(0, 0, diameter, diameter)
          })()
        break

      case 'rectangle':
        this.settings.image 
          ?
          (() => {
            imageMode(CENTER)
            image(this.settings.image, 0, 0, diameter, diameter)
          })()
          :
          (() => {
            rectMode(CENTER)
            fill(this.settings.color.r, this.settings.color.g, this.settings.color.b)
            rect(0, 0, this.sizing.width, this.sizing.height)
          })()
        break
    
      default:
        break
    }

    pop()
  }
}
