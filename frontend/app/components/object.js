/* global p5, Koji, Matter, world, imgObject */

const { Bodies, World } = Matter

/**
 * @class GameObject
 * @description Everything moving in game, i.e. the ground, the platform and the playable object uses this class.
 *              This is the base class for all objects that need to show up, get destroyed or added to the world.
 * 
 * @method show()
 * @method didTouch()
 * @method wentOutOfFrame()
 * @method destruct()
 */
class GameObject {
  constructor (
    cordinates = {x: null, y: null}, // positioning
    sizing = {width: null, height: null, radius: null}, // if the shape is circle, provide radius, else... width and height
    settings = {shape: Koji.config.strings.objectShape, image: imgObject, color: { r: 0, g: 255, b: 255, a: 1 }, rotate: true, movable: false} // shape can either be a circle or a rectangle
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

    // TODO: decide the movability of the object
  }

  /**
   * @description check for collision of this object to any other object
   * @returns true if the otherElement is touching this element.
   * @param {object} otherElement  - {sizing: {x: 100, y: 100}, body: Matter-js-body}
   */
  didTouch(otherElement, shape = 'circle') {
    let circle, rectangle
    let body = otherElement.body

    if (this.settings.shape === 'circle' && shape === 'circle') {

      return circleCircleColliding({ x: this.body.position.x, y: this.body.position.y, r: this.sizing.radius })

    } else if ((this.settings.shape === 'circle' && shape === 'rectangle') || (this.settings.shape === 'rectangle' && shape === 'circle')) {

      circle = { x: this.body.position.x, y: this.body.position.y, r: this.sizing.radius }
      rectangle = { x: body.position.x, y: body.position.y, w: otherElement.sizing.width, h: otherElement.sizing.height }

      return rectCircleColliding(circle, rectangle)
      
    } else if (this.settings.shape === 'rectangle' && shape === 'rectangle') {

      let thisRectangle = { x: this.body.position.x, y: this.body.position.y, w: this.sizing.width, h: this.sizing.height }
      let otherRectangle = { x: body.position.x, y: body.position.y, w: otherElement.sizing.width, h: otherElement.sizing.height }

      return rectRectColliding(thisRectangle, otherRectangle)

    }
  }

  /**
   * @description Used to detect if the object is out of the frame
   *              Sometimes, the objects fall out of the given frames (which is a BUG)
   *              But, if the bug occurs, this function will help us do something about it.
   */
  wentOutOfFrame() {
    return (this.body.position.x > width + 500 || this.body.position.y > height + 500)
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
            image(this.settings.image, 0, 0, this.sizing.width, this.sizing.height)
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

  destruct() {
    World.remove(world, this.body)
  }
}
