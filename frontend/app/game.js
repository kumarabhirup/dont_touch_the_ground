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

  // Lose life if touched the ground
  if (playableObject.didTouch(ground, 'rectangle')) {
      loseLife()
  }

  cleanup()
}
