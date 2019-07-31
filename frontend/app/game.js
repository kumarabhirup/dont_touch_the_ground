/* global p5, Koji */

function gamePlay() {
  // Update all floating text objects
  for (let i = 0; i < floatingTexts.length; i++) {
      floatingTexts[i].update()
      floatingTexts[i].render()
  }

  // InGame UI
  textSize(objSize * 1)
  fill(Koji.config.colors.scoreColor)
  textAlign(CENTER, CENTER)
  text("Game happens here!", width / 2, height / 2)


  // Score draw
  let scoreX = width - objSize / 2
  let scoreY = objSize / 3
  textSize(objSize * 2)
  fill(Koji.config.colors.scoreColor)
  textAlign(RIGHT, TOP)
  text(score, scoreX, scoreY)

  // Lives draw
  let lifeSize = objSize;
  for (let i = 0; i < lives; i++) {
      image(imgLife, lifeSize / 2 + lifeSize * i, lifeSize / 2, lifeSize, lifeSize)
  }

  cleanup()
}
