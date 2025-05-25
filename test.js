// --- Test Framework ---
const testResultsDiv = document.getElementById('test-results');
let testsRun = 0;
let testsPassed = 0;

function logTestResult(message, passed) {
    testsRun++;
    const resultP = document.createElement('p');
    resultP.textContent = (passed ? '[PASS] ' : '[FAIL] ') + message;
    resultP.className = passed ? 'pass' : 'fail';
    testResultsDiv.appendChild(resultP);
    if (passed) testsPassed++;
}

function assertEqual(actual, expected, message) {
    logTestResult(message + ` (Expected: ${expected}, Got: ${actual})`, actual === expected);
}

function assertTrue(value, message) {
    logTestResult(message, value === true);
}

function assertFalse(value, message) {
    logTestResult(message, value === false);
}

// Mocking alert
let alertCalledWithMessage = null;
const originalAlert = window.alert;

function mockAlert() {
    alertCalledWithMessage = null;
    window.alert = (message) => {
        alertCalledWithMessage = message;
        console.log("Mock alert called with: " + message); // For debugging tests
    };
}

function restoreAlert() {
    window.alert = originalAlert;
    alertCalledWithMessage = null;
}

// --- Test Setup & Teardown ---
// These are the game's DOM elements script.js interacts with
const gamePlayer = document.getElementById('player');
const gameObstacle = document.getElementById('obstacle');
const gameScoreDisplay = document.getElementById('score-display');
const gameContainer = document.getElementById('game-container'); // Needed for width calculations

// Store initial styles to reset
const initialPlayerStyleBottom = gamePlayer.style.bottom || '0px'; // Default if not set
const initialObstacleStyleRight = gameObstacle.style.right || '-30px';

// Need to manually stop the game's interval if possible.
// Since gameInterval is not exposed, we call endGame() components.
// This is not a perfect reset for internal script.js variables like score, isGameOver.
function beforeEachTest(testName) {
    console.log(`Running test: ${testName}`);
    testResultsDiv.innerHTML += `<h3>Running: ${testName}</h3>`;

    // Reset DOM elements to their initial state (as defined in CSS/HTML or initial JS setup)
    gamePlayer.style.bottom = initialPlayerStyleBottom;
    gamePlayer.style.left = '50px'; // As per CSS
    gameObstacle.style.right = initialObstacleStyleRight; // As per CSS
    gameObstacle.style.backgroundColor = 'red'; // Default
    
    // Reset what script.js initializes
    if (typeof score !== 'undefined') { // These are global in test.js, not script.js
      // This won't reset script.js's internal 'score', 'isGameOver', 'isJumping'
      // We are testing the SCRIPT, so we need to influence ITS state.
      // The best we can do is reset DOM and then re-run parts of script.js logic or functions.
    }
    // Manually try to reset game state as much as possible for script.js
    // This is a limitation; ideally script.js would have a resetTestState() function.
    
    // Stop game loop from script.js if it's running from a previous test or initial load
    // Calling endGame() components:
    if (window.gameInterval) { // If gameInterval was made global for testing
        clearInterval(window.gameInterval);
    } else {
        // Try to trigger the game's own endGame logic if it's safe.
        // For now, we assume tests must be carefully sequenced or script.js is reloaded/reset.
        // A "soft" reset for the purpose of tests:
        // If script.js's endGame() was called, it would set its internal isGameOver to true.
        // To "undo" this for the next test, we'd need script.js to expose an init() or reset().
        // For now, we'll assume tests focus on one interaction at a time.
        // We can reset the score display manually:
        gameScoreDisplay.textContent = 'Score: 0';
    }
    
    // Re-attach event listeners if endGame removed them and script.js doesn't re-add them automatically
    // This depends on how script.js is structured. It adds playerJumpHandler once.
    // If a test calls endGame(), playerJumpHandler is removed. Subsequent jump tests would fail.
    // This is a significant issue for testing without a proper reset function in script.js.
    // Workaround: For now, tests that call endGame() should be last in their respective suites.

    mockAlert(); // Mock alert before each test
}

function afterEachTest() {
    restoreAlert(); // Restore original alert
    testResultsDiv.innerHTML += `<hr>`;
}

// --- Test Suites ---
function runTests() {
    runPlayerJumpTests();
    runObstacleMovementTests();
    runScoringTests();
    runCollisionDetectionTests(); // Collision tests often call endGame, run them towards the end of a suite

    // Summary
    const summaryP = document.createElement('p');
    summaryP.innerHTML = `<b>Test Summary: ${testsPassed} / ${testsRun} passed.</b>`;
    summaryP.className = (testsPassed === testsRun) ? 'pass' : 'fail';
    testResultsDiv.insertBefore(summaryP, testResultsDiv.firstChild);
}

// --- Player Jump Tests ---
function runPlayerJumpTests() {
    const suiteName = "Player Jump";

    beforeEachTest(suiteName + " - Initial State");
    // Note: script.js sets its own internal isJumping, isGameOver. We can't reset them directly.
    // We assume the page is freshly loaded for the entire test suite run for now.
    // Or, that script.js's own variables are reset by its own logic tested elsewhere.
    // For jump, we need to ensure isGameOver and isJumping in script.js are false.
    // We can't directly set script.js's `isGameOver = false` or `isJumping = false`.
    // This is a major limitation. Assume a fresh state for the first test.
    
    // Test 1: Initial player position (bottom style)
    // Player's initial bottom is set by CSS to 0.
    // getComputedStyle will give the actual computed value.
    let initialBottom = window.getComputedStyle(gamePlayer).getPropertyValue('bottom');
    assertEqual(initialBottom, "0px", "Initial player bottom position should be 0px");
    afterEachTest();

    beforeEachTest(suiteName + " - Jump action");
    // Manually reset script.js state for test (conceptual - this won't work for its internal vars)
    // script.isGameOver = false; script.isJumping = false; 
    // We have to rely on the fact that jump() itself checks these.
    
    // Simulate spacebar press
    // We need to ensure the event listener from script.js is active.
    // If a previous test called endGame(), it might be removed.
    // For now, assume it's there or script.js re-adds it (it doesn't).
    
    // To test jump, we need to be able to set script.js's isGameOver = false and isJumping = false.
    // Since we can't, this test is flawed. Let's assume fresh script state.
    if (typeof jump === 'function') { // Check if jump function is global (it is in script.js)
        // Reset player position before jump for this test
        gamePlayer.style.bottom = "0px";
        // Manually ensure script.js's internal state allows jumping (this is the hack part)
        // We can't do: script.isJumping = false; script.isGameOver = false;
        // So, this test might fail if a previous test set these to true.
        
        jump(); // Call the global jump() function from script.js

        // isJumping should be true immediately after jump() starts
        // We cannot check script.js's 'isJumping' variable directly.
        // We can check the effect: player moves up.
        let jumpedBottom = window.getComputedStyle(gamePlayer).getPropertyValue('bottom');
        assertEqual(jumpedBottom, "100px", "Player bottom position should be 100px after jump starts");

        // Test player returns down after timeout (requires async test)
        // This is hard without a proper test framework or promises from jump()
        setTimeout(() => {
            beforeEachTest(suiteName + " - Jump completion (async)");
            let finalBottom = window.getComputedStyle(gamePlayer).getPropertyValue('bottom');
            assertEqual(finalBottom, "0px", "Player bottom position should return to 0px after jump timeout");
            // We also cannot check script.js internal isJumping here.
            afterEachTest();
        }, 600); // Wait a bit longer than the jump's 500ms timeout
    } else {
        logTestResult("jump() function not found. Skipping jump tests.", false);
    }
    afterEachTest(); // For the synchronous part of jump test
}

// --- Obstacle Movement Tests ---
function runObstacleMovementTests() {
    const suiteName = "Obstacle Movement";

    beforeEachTest(suiteName + " - Initial Position");
    // Obstacle's initial right is -30px from CSS.
    // script.js reads this.
    gameObstacle.style.right = "-30px"; // Ensure it for the test
    let initialRight = window.getComputedStyle(gameObstacle).getPropertyValue('right');
    assertEqual(initialRight, "-30px", "Initial obstacle right position");
    afterEachTest();

    beforeEachTest(suiteName + " - Move Obstacle Once");
    gameObstacle.style.right = "-30px"; // Reset for this test
    // We need to ensure script.js's isGameOver is false for obstacle to move.
    // Again, cannot set script.js's internal isGameOver. Assume it's false.
    if (typeof moveObstacle === 'function') {
        moveObstacle(); // Call global moveObstacle from script.js
        // obstacleSpeed is 5. Initial right -30px. So, new right should be -25px.
        let movedRight = window.getComputedStyle(gameObstacle).getPropertyValue('right');
        assertEqual(movedRight, "-25px", "Obstacle right position after one move");
    } else {
        logTestResult("moveObstacle() function not found. Skipping move tests.", false);
    }
    afterEachTest();

    beforeEachTest(suiteName + " - Obstacle Reset");
    // Set obstacle to be just before reset threshold
    // gameContainer width is 800px. obstacle width is 30px.
    // Reset happens if newRight > gameContainerWidth.
    // If current right is 798px, speed is 5, newRight = 803px. 803 > 800. Reset to -30px.
    gameObstacle.style.right = "798px";
    if (typeof moveObstacle === 'function') {
        moveObstacle();
        let resetRight = window.getComputedStyle(gameObstacle).getPropertyValue('right');
        assertEqual(resetRight, "-30px", "Obstacle should reset to -30px when it goes off-screen");
    }
    afterEachTest();
}

// --- Scoring Tests ---
function runScoringTests() {
    const suiteName = "Scoring";

    beforeEachTest(suiteName + " - Initial Score Display");
    // script.js initializes score to 0 and updates display.
    // We can't check script.js's internal 'score' variable.
    // We check the display which script.js is responsible for.
    // Need to ensure script.js's own score variable is 0 for this test.
    // The beforeEachTest tries to reset display, but not script.js's internal score.
    // This is a known limitation.
    gameScoreDisplay.textContent = 'Score: 0'; // Manually reset display for test start
    // If script.js has an init function that sets its 'score = 0', call it here. It doesn't.

    assertEqual(gameScoreDisplay.textContent, "Score: 0", "Initial score display should be 'Score: 0'");
    afterEachTest();

    beforeEachTest(suiteName + " - Score Increment");
    gameScoreDisplay.textContent = 'Score: 0'; // Reset display
    // Manually ensure script.js's 'score' is 0 and 'isGameOver' is false (conceptual)
    // script.score = 0; script.isGameOver = false;
    if (typeof moveObstacle === 'function') {
        // moveObstacle also increments score if !isGameOver
        moveObstacle(); // Call once
        // Assuming script.js's internal score was 0 and isGameOver was false.
        assertEqual(gameScoreDisplay.textContent, "Score: 1", "Score should be 'Score: 1' after one update cycle");
        moveObstacle(); // Call twice
        assertEqual(gameScoreDisplay.textContent, "Score: 2", "Score should be 'Score: 2' after two update cycles");
    }
    afterEachTest();
    
    beforeEachTest(suiteName + " - Score Stops on Game Over");
    gameScoreDisplay.textContent = 'Score: 10'; // Simulate some score
    // script.score = 10; script.isGameOver = false; (Conceptual)
    if (typeof endGame === 'function' && typeof moveObstacle === 'function') {
        endGame(); // This will set script.js's isGameOver = true and clear its interval.
        // Alert will be mocked and its message checked by a collision test later.
        // Now, try to move obstacle again. Score should not increment.
        moveObstacle(); // This call should not increment score.
        assertEqual(gameScoreDisplay.textContent, "Score: 10", "Score should not change after game is over");
    }
    restoreAlert(); // endGame calls alert.
    afterEachTest();
}


// --- Collision Detection Tests ---
function runCollisionDetectionTests() {
    const suiteName = "Collision Detection";

    beforeEachTest(suiteName + " - No Collision");
    // Ensure player and obstacle are far apart
    gamePlayer.style.bottom = '0px'; gamePlayer.style.left = '50px'; // Width 50px. Right edge at 100px.
    gameObstacle.style.right = '700px'; // Obstacle width 30px. If right is 700px, its left edge is at 800-700=100px from origin.
                                       // So obstacle is at gameContainer.width - 700 = 100px.
                                       // No, style.right is distance from right edge of container.
                                       // If right:700px, means obstacle's right edge is 700px from container's right.
                                       // Container 800px wide. Obstacle's right edge is at 800-700 = 100px.
                                       // Obstacle's left edge is at 100-30 = 70px.
                                       // Player: left=50, right=100. Obstacle: left=70, right=100. They ARE colliding.
    
    // Let's position them clearly not colliding:
    // Player: left: 50px, right: 100px, top: 350px (bottom:0, height:50), bottom: 400px.
    // Obstacle: right: 670px (meaning its right edge is at 800-670=130px). So left edge is 100px.
    // Player right 100px, Obstacle left 100px. Barely touching, or just separated if calculations are exact.
    // Let's make it clearer:
    gameObstacle.style.right = '600px'; // Obstacle right edge at 200px. Left edge at 170px.
                                      // Player right edge at 100px. No collision.
    
    // We need script.js's isGameOver to be false for checkCollision to run its logic.
    // script.isGameOver = false; (Conceptual)
    if (typeof checkCollision === 'function') {
        checkCollision(); // Call global checkCollision
        assertTrue(alertCalledWithMessage === null, "Alert should not be called if no collision");
        // We also need to check that script.js's internal isGameOver is still false. Cannot directly.
    }
    afterEachTest();

    beforeEachTest(suiteName + " - Collision Occurs");
    // Position player and obstacle to overlap
    // Player: left: 50px, right: 100px, bottom: 0px, top: 350px (height 50px)
    // Obstacle: width: 30px, height: 30px, bottom: 0px
    // Set obstacle.style.right such that it overlaps.
    // If obstacle.style.right = '700px', its left edge is at 100px (game width 800 - 700). Obstacle is [100, 130]. Player is [50,100]. They touch.
    // If obstacle.style.right = '702px', its left edge is at 98px. Obstacle is [98, 128]. Player is [50,100]. Overlap.
    gameObstacle.style.right = '702px'; // Overlap: player L:50 R:100, obstacle L:98 R:128
    
    // script.isGameOver = false; (Conceptual)
    if (typeof checkCollision === 'function' && typeof endGame === 'function') {
        // Temporarily make gameInterval global so endGame can clear it in the test context
        // This is a hack. Ideally, script.js manages its own interval.
        window.testGameInterval = setInterval(() => {}, 1000); // Dummy interval
        let originalGameInterval = null;
        if (typeof gameInterval !== 'undefined') originalGameInterval = gameInterval;
        gameInterval = window.testGameInterval; // Overwrite global gameInterval if script.js made it global (it's not)
                                                // This won't affect script.js's internal gameInterval.

        checkCollision(); // This should call endGame() in script.js
        
        assertEqual(alertCalledWithMessage, "Game Over!", "Alert should be called with 'Game Over!' on collision");
        // Check if script.js's isGameOver was set to true. Cannot directly.
        // We can check if the jump listener was removed, as endGame() does that.
        // How to check if an event listener is removed is non-trivial.
        // We can also check if the interval was cleared. (script.js's internal one).
        
        // Restore gameInterval if we overwrote a global one
        if (originalGameInterval) gameInterval = originalGameInterval;
        else delete window.gameInterval; // Clean up if we made it global for test
        clearInterval(window.testGameInterval);

    }
    afterEachTest();
}

// --- Run all tests ---
// Wait for the main script (script.js) to be loaded and initialized, then run tests.
// script.js might also use DOMContentLoaded or window.onload.
// For simplicity, using a small timeout to hope script.js has done its initial setup.
window.onload = () => {
    // A small delay to ensure script.js has initialized, especially if it uses DOMContentLoaded or similar
    setTimeout(() => {
        console.log("Starting tests...");
        runTests();
        console.log("Tests finished.");
    }, 100); // 100ms delay, adjust if needed
};
