/* global Koji, GameObject */

class Platform extends GameObject {
  constructor (
    cordinates = {x: null, y: null}, // positioning
    sizing = {width: null, height: null, radius: null}, // if the shape is circle, provide radius, else... width and height
    settings = {shape: 'rectangle', image: null, color: { r: 255, g: 255, b: 255, a: 1 }, rotate: true} // shape can either be a circle or a rectangle
  ) {
    super(cordinates, sizing, settings)
  }
}
