/**
 * @see https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
 * @returns true if the rectangle and circle are colliding
 * @requires - circle and rectangle to have their pivot points from the centre!
 * 
 * @param {object} circle - {x:100, y:290, r:10}
 * @param {object} rectangle - {x:100, y:100, w:40, h:100}
 */
function rectCircleColliding(circle, rectangle) {
  let distX = Math.abs(circle.x - rectangle.x)
  let distY = Math.abs(circle.y - rectangle.y)

  if (distX > (rectangle.w/2 + circle.r)) { return false }
  if (distY > (rectangle.h/2 + circle.r)) { return false }

  if (distX <= (rectangle.w/2)) { return true } 
  if (distY <= (rectangle.h/2)) { return true }

  let dx=distX-rectangle.w/2
  let dy=distY-rectangle.h/2

  return (dx*dx+dy*dy<=(circle.r*circle.r))
}

/**
 * @returns true if the two circles are colliding
 * 
 * @param {object} circle1 - {x:100, y:290, r:10}
 * @param {object} circle2 - {x:100, y:290, r:10}
 */
function circleCircleColliding(circle1, circle2) {
  return dist(circle1.x, circle1.y, circle2.x, circle2.y) <= (circle1.r + circle2.r)
}