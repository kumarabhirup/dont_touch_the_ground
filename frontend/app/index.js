/* global Koji, createCanvas, background, textSize, text */

let myFont // The font we'll use throughout the app

let gameOver = false // If it's true the game will render the main menu
let gameBeginning = true // Should be true only before the user starts the game for the first time

// Game objects
// Declare game objects here like player, enemies etc

// Buttons
let playButton
let soundButton

// Score data
let score = 0
let highScore = 0
let highscoreGained = false
let scoreGain

// Data taken from Game Settings
let startingLives
let lives

// Images
let imgLife
let imgBackground

// Audio
let sndMusic
let soundEnabled = true
let canMute = true

let soundImage
let muteImage

// Size stuff
let objSize //base size modifier of all objects, calculated based on screen size

// game size in tiles, using bigger numbers will decrease individual object sizes but allow more objects to fit the screen
// Keep in mind that if you change this, you might need to change text sizes as well
let gameSize = 18

let isMobile = false
let touching = false // Whether the user is currently touching/clicking

// Load assets
function preload() {
    // Load font from google fonts link provided in game settings
    var link = document.createElement('link')
    link.href = Koji.config.strings.fontFamily
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    myFont = getFontFamily(Koji.config.strings.fontFamily)
    let newStr = myFont.replace("+", " ")
    myFont = newStr

    // Load background if there's any
    if (Koji.config.images.background !== "") {
        imgBackground = loadImage(Koji.config.images.background)
    }

    imgLife = loadImage(Koji.config.images.lifeIcon)

    soundImage = loadImage(Koji.config.images.soundImage)
    muteImage = loadImage(Koji.config.images.muteImage)

    // Load Sounds
    sndMusic = loadSound(Koji.config.sounds.backgroundMusic)

    // Load settings from Game Settings
    startingLives = parseInt(Koji.config.strings.lives)
    lives = startingLives
}

// Setup your props
function setup() {
    width = window.innerWidth
    height = window.innerHeight

    // How much of the screen should the game take, this should usually be left as it is
    let sizeModifier = 0.75
    if (height > width) {
        sizeModifier = 1
    }

    createCanvas(width, height)

    // Magically determine basic object size depending on size of the screen
    objSize = floor(min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier)

    isMobile = detectMobile()

    // Get high score data from local storage
    if (localStorage.getItem("highscore")) {
        highScore = localStorage.getItem("highscore")
    }

    textFont(myFont) // set our font

    playButton = new PlayButton()
    soundButton = new SoundButton()

    gameBeginning = true

    playMusic()
}

// An infinite loop that never ends in p5
function draw() {
    // Draw background or a solid color
    if (imgBackground) {
        background(imgBackground)
    } else {
        background(Koji.config.colors.backgroundColor)
    }

    // Draw UI
    if (gameOver || gameBeginning) {
        // Draw title
        let titleText = Koji.config.strings.title
        let titleSize = floor(objSize * 2)
        textSize(titleSize)

        // Resize title until it fits the screen
        while (textWidth(titleText) > width * 0.9) {
            titleSize *= 0.9
            textSize(titleSize)
        }

        fill(Koji.config.colors.titleColor)
        textAlign(CENTER, TOP)
        text(Koji.config.strings.title, width / 2, objSize * 3)

        // Draw instructions
        let instructionsText = []
        instructionsText[0] = Koji.config.strings.instructions1
        instructionsText[1] = Koji.config.strings.instructions2
        instructionsText[2] = Koji.config.strings.instructions3

        let instructionsSize = []

        for (let i = 0; i < instructionsText.length; i++) {
            instructionsSize[i] = floor(objSize * 0.75)
            textSize(instructionsSize[i])

            // Resize text until it fits the screen
            while (textWidth(instructionsText[i]) > width * 0.9) {
                instructionsSize[i] *= 0.9;
                textSize(instructionsSize[i])
            }
        }

        textSize(instructionsSize[0])
        fill(Koji.config.colors.instructionsColor)
        textAlign(CENTER, TOP)
        text(instructionsText[0], width / 2, objSize * 6)

        textSize(instructionsSize[1])
        fill(Koji.config.colors.instructionsColor)
        textAlign(CENTER, TOP)
        text(instructionsText[1], width / 2, objSize * 8)

        textSize(instructionsSize[2])
        fill(Koji.config.colors.instructionsColor)
        textAlign(CENTER, TOP)
        text(instructionsText[2], width / 2, objSize * 10)

        playButton.update()
        playButton.btn.draw()

        // Draw score text after the game
        if (!gameBeginning) {
            textSize(objSize * 0.9)
            fill(Koji.config.colors.scoreColor)
            textAlign(CENTER, TOP)
            text(Koji.config.strings.scoreText + " " + score, width / 2, playButton.pos.y + objSize * 4)
        }

        // Notify the player if they got a new high score, otherwise show the previous high score
        if (highscoreGained) {
            textSize(objSize * 1)
            fill(Koji.config.colors.highscoreColor)
            textAlign(CENTER, BOTTOM)
            text(Koji.config.strings.highscoreGainedText, width / 2, height - objSize)
        } else {
            textSize(objSize * 1)
            fill(Koji.config.colors.highscoreColor)
            textAlign(CENTER, BOTTOM)
            text(Koji.config.strings.highscoreText + "\n" + highScore, width / 2, height - objSize)
        }
    } else {
        // Update all floating text objects
        for (let i = 0; i < floatingTexts.length; i++) {
            floatingTexts[i].update();
            floatingTexts[i].render();
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

    soundButton.render()
}

// Go through objects and see which ones need to be removed
// A good practive would be for objects to have a boolean like removable, and here you would go through all objects and remove them if they have removable = true;
function cleanup() {
    for (let i = 0; i < floatingTexts.length; i++) {
        if (floatingTexts[i].timer <= 0) {
            floatingTexts.splice(i, 1)
        }
    }
}


// Handle input
function touchStarted() {
    if (gameOver || gameBeginning) {

    }

    if (soundButton.checkClick()) {
        toggleSound()
        return
    }

    if (!gameOver && !gameBeginning) {
        // InGame
        touching = true

    }
}

function touchEnded() {
    // This is required to fix a problem where the music sometimes doesn't start on mobile
    if (soundEnabled) {
        if (getAudioContext().state !== 'running') {
            getAudioContext().resume()
        }
    }

    touching = false
}

function keyPressed() {
    if (!gameOver && !gameBeginning) {

    }
}

function keyReleased() {
    if (!gameOver && !gameBeginning) {

    }
}

// Call this every time you want to start or reset the game
//This is a good place to clear all arrays like enemies, bullets etc before starting a new game
function init() {
    gameOver = false

    highscoreGained = false
    score = 0

    floatingTexts = []
}

// Call this when a lose life event should trigger
function loseLife() {
    lives--
    if (lives <= 0) {
        gameOver = true
        checkHighscore()
    }
}


// The way to use Floating Text:
// floatingTexts.push(new FloatingText(...));
// Everything else like drawing, removing it after it's done etc, will be done automatically
function FloatingText(x, y, txt, color, size) {
    this.pos = createVector(x, y)
    this.size = 1
    this.maxSize = size
    this.timer = 1
    this.txt = txt
    this.color = color

    this.update = function () {
        if (this.size < this.maxSize) {
            this.size = Smooth(this.size, this.maxSize, 2)
        }

        this.timer -= 1 / frameRate()
    }

    this.render = function () {
        textSize(this.size)
        fill(this.color)
        textAlign(CENTER, BOTTOM)
        text(this.txt, this.pos.x, this.pos.y)
    }
}
