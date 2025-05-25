const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score-display'); // Get score display element
let isJumping = false;
let isGameOver = false;
let score = 0; // Initialize score

// Named function for the event listener
function playerJumpHandler(event) {
    if (event.code === 'Space' && !isJumping && !isGameOver) { // Check isGameOver
        jump();
    }
}
document.addEventListener('keydown', playerJumpHandler); // Use named function

function jump() {
    if (isGameOver) return; // Prevent jumping if game is over
    isJumping = true;
    let currentBottom = parseInt(window.getComputedStyle(player).getPropertyValue('bottom'));
    let jumpHeight = 100; // pixels

    // Move player up
    player.style.bottom = (currentBottom + jumpHeight) + 'px';

    // Move player back down after a delay
    setTimeout(() => {
        player.style.bottom = currentBottom + 'px'; // Back to original position
        isJumping = false;
    }, 500); // 500ms for the jump duration
}

const obstacle = document.getElementById('obstacle');
const gameContainer = document.getElementById('game-container');
const obstacleSpeed = 5; // pixels per interval
const moveInterval = 20; // milliseconds

function moveObstacle() {
    let obstacleRight = parseInt(window.getComputedStyle(obstacle).getPropertyValue('right'));
    let gameContainerWidth = gameContainer.offsetWidth;
    let obstacleWidth = obstacle.offsetWidth;

    let newRight = obstacleRight + obstacleSpeed;

    if (newRight > gameContainerWidth) {
        newRight = -obstacleWidth; // Reset to just off-screen right
        // Future: randomize obstacle height or type here if needed
    }
    obstacle.style.right = newRight + 'px';

    if (!isGameOver) {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
    }

    checkCollision(); // Call collision check
}

let gameInterval = setInterval(moveObstacle, moveInterval); // Store interval ID

// Initialize score display at the start
scoreDisplay.textContent = 'Score: ' + score;

function checkCollision() {
    if (isGameOver) return; // Don't check if game already over

    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    // Check for collision
    if (
        playerRect.left < obstacleRect.right &&
        playerRect.right > obstacleRect.left &&
        playerRect.top < obstacleRect.bottom &&
        playerRect.bottom > obstacleRect.top
    ) {
        endGame();
    }
}

function endGame() {
    isGameOver = true; // Set game over flag
    clearInterval(gameInterval); // Stop obstacle movement
    document.removeEventListener('keydown', playerJumpHandler); // Disable jump listener
    alert("Game Over!");
    // For a more integrated message, you could manipulate the DOM:
    // const gameOverMessage = document.createElement('div');
    // gameOverMessage.textContent = 'GAME OVER';
    // gameOverMessage.style.position = 'absolute';
    // gameOverMessage.style.top = '50%';
    // gameOverMessage.style.left = '50%';
    // gameOverMessage.style.transform = 'translate(-50%, -50%)';
    // gameOverMessage.style.fontSize = '40px';
    // gameOverMessage.style.color = 'red';
    // gameContainer.appendChild(gameOverMessage);
}
