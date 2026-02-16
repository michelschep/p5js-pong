// FC Utrecht kleuren
const FCU_RED = '#C8102E';
const FCU_WHITE = '#FFFFFF';
const FCU_DARK = '#1a1a1a';

// Game variabelen
let ball;
let playerPaddle;
let computerPaddle;
let playerScore = 0;
let computerScore = 0;
let gameState = 'playing'; // 'playing' of 'gameover'
let winner = '';

const WINNING_SCORE = 10;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 6;

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    
    resetBall();
    
    playerPaddle = {
        x: 30,
        y: height / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT
    };
    
    computerPaddle = {
        x: width - 30 - PADDLE_WIDTH,
        y: height / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT
    };
}

function draw() {
    background(FCU_DARK);
    
    // Teken middenlijn
    drawCenterLine();
    
    if (gameState === 'playing') {
        // Update speler paddle (volgt muis)
        playerPaddle.y = constrain(mouseY - PADDLE_HEIGHT / 2, 0, height - PADDLE_HEIGHT);
        
        // Update computer paddle (AI)
        updateComputerPaddle();
        
        // Update bal
        updateBall();
        
        // Check collisions
        checkPaddleCollision();
        
    } else if (gameState === 'gameover') {
        displayGameOver();
    }
    
    // Teken game elementen
    drawPaddles();
    drawBall();
    drawScores();
}

function drawCenterLine() {
    stroke(FCU_WHITE);
    strokeWeight(2);
    for (let i = 0; i < height; i += 20) {
        line(width / 2, i, width / 2, i + 10);
    }
}

function drawPaddles() {
    fill(FCU_RED);
    noStroke();
    rect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, 5);
    rect(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, 5);
}

function drawBall() {
    fill(FCU_WHITE);
    noStroke();
    circle(ball.x, ball.y, BALL_SIZE);
}

function drawScores() {
    fill(FCU_WHITE);
    textAlign(CENTER, TOP);
    textSize(48);
    text(playerScore, width / 4, 30);
    text(computerScore, 3 * width / 4, 30);
}

function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    // Bounce van boven en onder
    if (ball.y - BALL_SIZE / 2 <= 0 || ball.y + BALL_SIZE / 2 >= height) {
        ball.speedY *= -1;
    }
    
    // Check of bal achter paddle is (punt gescoord)
    if (ball.x - BALL_SIZE / 2 <= 0) {
        computerScore++;
        checkGameOver();
        resetBall();
    } else if (ball.x + BALL_SIZE / 2 >= width) {
        playerScore++;
        checkGameOver();
        resetBall();
    }
}

function checkPaddleCollision() {
    // Speler paddle collision
    if (ball.x - BALL_SIZE / 2 <= playerPaddle.x + playerPaddle.width &&
        ball.x + BALL_SIZE / 2 >= playerPaddle.x &&
        ball.y >= playerPaddle.y &&
        ball.y <= playerPaddle.y + playerPaddle.height) {
        
        ball.speedX = abs(ball.speedX);
        ball.speedX *= 1.05; // Verhoog snelheid een beetje
        
        // Voeg Engels toe op basis van waar bal paddle raakt
        let hitPos = (ball.y - playerPaddle.y) / playerPaddle.height;
        ball.speedY = (hitPos - 0.5) * 10;
    }
    
    // Computer paddle collision
    if (ball.x + BALL_SIZE / 2 >= computerPaddle.x &&
        ball.x - BALL_SIZE / 2 <= computerPaddle.x + computerPaddle.width &&
        ball.y >= computerPaddle.y &&
        ball.y <= computerPaddle.y + computerPaddle.height) {
        
        ball.speedX = -abs(ball.speedX);
        ball.speedX *= 1.05;
        
        let hitPos = (ball.y - computerPaddle.y) / computerPaddle.height;
        ball.speedY = (hitPos - 0.5) * 10;
    }
}

function updateComputerPaddle() {
    // Simple AI: volg de bal
    let targetY = ball.y - computerPaddle.height / 2;
    let diff = targetY - computerPaddle.y;
    
    // Beweeg naar doel, maar niet te snel (maak het te verslaan)
    if (abs(diff) > PADDLE_SPEED) {
        computerPaddle.y += PADDLE_SPEED * Math.sign(diff);
    } else {
        computerPaddle.y = targetY;
    }
    
    computerPaddle.y = constrain(computerPaddle.y, 0, height - computerPaddle.height);
}

function resetBall() {
    ball = {
        x: width / 2,
        y: height / 2,
        speedX: random([-5, 5]),
        speedY: random(-3, 3)
    };
}

function checkGameOver() {
    if (playerScore >= WINNING_SCORE) {
        gameState = 'gameover';
        winner = 'Speler';
    } else if (computerScore >= WINNING_SCORE) {
        gameState = 'gameover';
        winner = 'Computer';
    }
}

function displayGameOver() {
    fill(FCU_RED);
    textAlign(CENTER, CENTER);
    textSize(64);
    text(winner + ' wint!', width / 2, height / 2 - 40);
    
    fill(FCU_WHITE);
    textSize(24);
    text('Klik om opnieuw te spelen', width / 2, height / 2 + 40);
}

function mousePressed() {
    if (gameState === 'gameover') {
        // Reset game
        playerScore = 0;
        computerScore = 0;
        gameState = 'playing';
        resetBall();
    }
}
