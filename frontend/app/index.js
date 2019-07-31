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

}

// Setup your props
function setup() {
    createCanvas(windowWidth, windowHeight)
    background(255)
}

// An infinite loop that never ends in p5
function draw() {
    textSize(50)
    text('🤩', width/2 - 22.5, height/2)
}
