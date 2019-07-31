/* global p5, Koji, Matter */

// imports
const { 
  Engine,
  World,
  MouseConstraint,
  Mouse,
  Constraint
} = Matter

let myFont // The font we'll use throughout the app

let gameOver = false // If it's true the game will render the main menu
let gameBeginning = true // Should be true only before the user starts the game for the first time

let world, engine
let mConstraint

// Game objects
let playableObject
let platform
let ground

// Buttons and HomePage
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
let imgObject

// Audio
let sndMusic
let soundEnabled = true
let canMute = true

let soundImage
let muteImage

// Size stuff
let objSize // base size modifier of all objects, calculated based on screen size

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

    imgObject = Koji.config.images.objectImage ? loadImage(Koji.config.images.objectImage) : null
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

    const canvas = createCanvas(width, height)

    // Magically determine basic object size depending on size of the screen
    objSize = floor(min(floor(width / gameSize), floor(height / gameSize)) * sizeModifier)

    isMobile = detectMobile()

    // Get high score data from local storage
    if (localStorage.getItem("highscore")) {
        highScore = localStorage.getItem("highscore")
    }

    textFont(myFont) // set our font

    // Engine and World setup
    engine = Engine.create()
    world = engine.world

    playButton = new PlayButton()
    soundButton = new SoundButton()
    ground = new Ground({ x: width/2, y: height }, { width, height: 100 }, { shape: 'rectangle' })
    playableObject = new GameObject (
        { x: width / 2, y: -100 }, 
        { radius: objSize * 2, width: objSize * 2, height: objSize * 2 }, // radius works for circle shape, width and height work for rectangular shape
        { shape: Koji.config.strings.objectShape, image: imgObject, color: { r: 0, g: 255, b: 255, a: 1 } } // either `rectangle` or `circle` shape allowed. Else see some error.
    )

    gameBeginning = true

    // playMusic()

    // Mouse moving
    const mouse = Mouse.create()
    mConstraint = MouseConstraint.create(engine, { mouse })
    World.add(world, mConstraint)
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
        gameBeginningOver()
    } else {
        gamePlay()
        Engine.update(engine)
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
// This is a good place to clear all arrays like enemies, bullets etc before starting a new game
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
