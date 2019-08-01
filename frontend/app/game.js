/* global p5, Koji, Object, Platform */

function gamePlay() {
  // Update all floating text objects
  for (let i = 0; i < floatingTexts.length; i++) {
      floatingTexts[i].update()
      floatingTexts[i].render()
  }

  // InGame UI
  ground.show(); groundLeft.show(); groundRight.show(); groundTop.show();
  platform.show()
  playableObject.show()

  // Score draw
  let scoreX = width - objSize / 2
  let scoreY = objSize / 3
  textSize(objSize * 2)
  fill(Koji.config.colors.scoreColor)
  textAlign(RIGHT, TOP)
  text(score, scoreX, scoreY)

  // Lives draw
  let lifeSize = objSize
  for (let i = 0; i < lives; i++) {
      image(imgLife, lifeSize / 2 + lifeSize * i, lifeSize / 2, lifeSize, lifeSize)
  }

  // Lose life if ball touched the ground
  if (playableObject.didTouch(ground, 'rectangle')) {
    // reconstruct the playableObject
    playableObject.destruct()
    playableObject = new GameObject (
        { x: width / 2, y: 170 }, 
        { radius: objSize * 2, width: objSize * 2, height: objSize * 2 }, // radius works for circle shape, width and height work for rectangular shape
        { shape: Koji.config.strings.objectShape, image: imgObject, color: { r: 0, g: 255, b: 255, a: 1 }, rotate: true } // either `rectangle` or `circle` shape allowed. Else see some error.
    )
    playableObject.show()

    // reconstruct the platform
    platform.destruct()
    platform = new Platform({ x: width / 2 , y: 200 }, { width: objSize * 8, height: objSize * 0.8 }, { shape: 'rectangle', color: { r: 0, g: 0, b: 0, a: 1 }, rotate: true })
    platform.show()

    loseLife()
  }

  // decrease the score when ball is touching the platform
  if (playableObject.didTouch(platform, 'rectangle')) {
    if (score > 0) score -= parseInt(Koji.config.strings.scoreDecreaseSpeed)
  } else {
  // increase the score when ball is in the air
    score += parseInt(Koji.config.strings.scoreIncreaseSpeed)
  }

  cleanup()
}
