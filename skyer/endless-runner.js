var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = document.body.clientWidth,
    height = document.body.clientHeight,
    gameHeight = 200, // height of the area that the player can navigate
    requestID,
    player = {
        x: Math.round(width / 3),
        y: gameHeight - 15,
        width: 5,
        height: 5,
        speed: 2, // Base speed for acceleration
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false,
        health: 4, // Player health
        maxHealth: 4, // Max health
        isBlocking: false, // Shield blocking state
        inventory: [], // Player inventory
        hotbar: [], // Hotbar items (visual for now)
        selectedHotbarIndex: 0, // Index of selected hotbar item
        handItem: null, // Item currently "in hand" (e.g., shield visual)
        lastDamageTime: 0, // To prevent rapid damage
        invulnerabilityDuration: 1000, // 1 second invulnerability after damage
        moveInputX: 0 // -1 for left, 1 for right, 0 for none
    },
    keys = [],
    friction = 0.8,
    gravity = 0.2,
    verticalSpeed = 1, // speed of the vertical scroll of the game
    score = 0,
    bestScore = 0,
    coinCount = 0,
    playerBlocks = 0,
    touches = [],
    touchButtonSize = 70,
    touchButtonMargin = 20,
    upButton = {
        x: touchButtonMargin,
        y: height - touchButtonMargin - touchButtonSize,
        width: touchButtonSize,
        height: touchButtonSize
    },
    leftButton = {
        x: width - 2 * touchButtonMargin - 2 * touchButtonSize,
        y: height - touchButtonMargin - touchButtonSize,
        width: touchButtonSize,
        height: touchButtonSize
    },
    rightButton = {
        x: width - touchButtonMargin - touchButtonSize,
        y: height - touchButtonMargin - touchButtonSize,
        width: touchButtonSize,
        height: touchButtonSize
    },
    buildButton = {
        x: touchButtonMargin,
        y: height - touchButtonMargin - touchButtonSize - touchButtonSize - touchButtonMargin,
        width: touchButtonSize,
        height: touchButtonSize
    },
    shootButton = { // Shoot button for touch
        x: width - touchButtonMargin - touchButtonSize,
        y: height - touchButtonMargin - touchButtonSize - touchButtonSize - touchButtonMargin,
        width: touchButtonSize,
        height: touchButtonSize
    },
    blockButton = { // Block button for touch
        x: width - 2 * touchButtonMargin - 2 * touchButtonSize,
        y: height - touchButtonMargin - touchButtonSize - touchButtonSize - touchButtonMargin,
        width: touchButtonSize,
        height: touchButtonSize
    },
    touchButtonTimeout = 0,
    drawCount = 1,
    gamePaused = false; // Game pause state

// Global game state variables for new features
var gameTime = 0; // Tracks game time for day/night cycle (e.g., 0-24 hours)
var dayDuration = 60 * 60 * 2; // 2 minutes per full day cycle (adjust as needed)
var currentWeather = 'none';
var weatherTimer = 0;
var weatherDuration = 60 * 5; // 5 seconds per weather event
var corruptionActive = false;
var corruptionTimer = 0;
var corruptionDuration = 60 * 3; // 3 seconds of corruption
var corruptionChance = 0.0005; // Chance per frame for corruption to start
var randomEventTimer = 0;
var nextRandomEventTime = 60 * 10; // First event after 10 seconds
var playerSpeedMultiplier = 1; // Influenced by weather/mud

var isAIControlled = false; // New: Flag for AI control
var inactivityTimer = 0; // New: Timer for AI activation
const INACTIVITY_THRESHOLD = 60 * 10; // 10 seconds of inactivity to activate AI

var boxes = [];
var enemies = [];
var bullets = []; // Enemy bullets
var playerBullets = []; // Player bullets
var items = []; // Changed from 'coins' to 'items' for more general pickups
var obstacles = [];
var clouds = []; // Clouds for background
var terrainTiles = []; // New: For random terrain generation
var bombs = []; // New: For bombs

// Define item types (for inventory)
const ITEM_TYPE = {
    SHIELD: 'shield',
    BLOCK: 'block',
    COIN: 'coin',
    WATER: 'water',
    LAVA: 'lava',
    STONE: 'stone',
    AXE: 'axe',
    PICKAXE: 'pickaxe',
    SHOVEL: 'shovel',
    FRUIT: 'fruit',
    MUD: 'mud',
    GENERIC: 'generic', // For randomly generated items
    HEALTH_ORB: 'health_orb' // New: Health regeneration orb
};

// Define obstacle types
const OBSTACLE_TYPE = {
    SPIKE: 'spike',
    WATER_HAZARD: 'water_hazard',
    LAVA_HAZARD: 'lava_hazard',
    MUD_PIT: 'mud_pit',
    PORTAL: 'portal', // New: Teleportation portal
    BOMB: 'bomb' // New: Bomb obstacle
};

// Define terrain types
const TERRAIN_TYPE = {
    GRASS: 'grass',
    STONE: 'stone',
    DIRT: 'dirt',
    SAND: 'sand',
    SNOW: 'snow'
};

// Player performance metrics for adaptive difficulty
var playerPerformance = {
    hitsTaken: 0,
    enemiesKilled: 0,
    platformsBuilt: 0,
    coinsCollected: 0,
    recentScoreChange: 0,
    difficultyModifier: 1.0, // 1.0 is normal, higher for harder, lower for easier
    playerHealthHistory: [] // To track recent health for difficulty adjustment
};

// Initial setup for player's inventory
player.inventory.push({
    name: "Wooden Shield",
    type: ITEM_TYPE.SHIELD,
    description: "Blocks enemy blasts.",
    icon: "🛡️",
    properties: {
        defense: 1
    }
});
player.handItem = player.inventory[0]; // Player starts with shield in hand
player.hotbar.push(player.inventory[0]); // Add shield to hotbar

boxes.push({
    x: 0,
    y: gameHeight - 4,
    width: width + 20,
    height: 4,
    type: "platform",
    material: TERRAIN_TYPE.GRASS
});

// Initialize clouds
for (let i = 0; i < 5; i++) {
    clouds.push({
        x: Math.random() * width,
        y: Math.random() * (gameHeight / 2),
        width: randFromToStep(50, 150, 10),
        height: randFromToStep(20, 60, 10),
        velX: -Math.random() * 0.5 - 0.1 // Clouds move slowly left
    });
}

var mountains = []; // New: For background mountains/hills
// Initialize mountains
for (let i = 0; i < 3; i++) {
    mountains.push({
        x: Math.random() * width * 1.5,
        baseY: gameHeight - 4, // Base of the mountains
        width: randFromToStep(100, 300, 20),
        height: randFromToStep(50, 150, 10),
        color: `hsl(90, ${randFromToStep(20, 40, 5)}%, ${randFromToStep(20, 30, 5)}%)`, // Greenish-grey
        velX: -Math.random() * 0.05 - 0.01 // Mountains move very slowly
    });
}


// Set display size (css pixels).
canvas.style.width = width + "px";
canvas.style.height = height + "px";

// Set actual size in memory (scaled to account for extra pixel density).
var scale = window.devicePixelRatio;
canvas.width = width * scale;
canvas.height = height * scale;

// Normalize coordinate system to use css pixels.
ctx.scale(scale, scale);

requestID = requestAnimationFrame(mainMenuDraw);

function update() {
    if (gamePaused) {
        requestID = requestAnimationFrame(pauseLoop);
        return;
    }

    // AI Control Logic
    if (inactivityTimer >= INACTIVITY_THRESHOLD && !isAIControlled) {
        isAIControlled = true;
        console.log("AI activated due to inactivity!");
    } else if (inactivityTimer < INACTIVITY_THRESHOLD && isAIControlled && !keys[70]) { // F key to toggle AI
        // If user input (keys) is detected and AI is not manually forced on
        isAIControlled = false;
        console.log("User input detected, AI deactivated!");
    }


    if (isAIControlled) {
        aiControl();
    } else {
        // Reset player input if not AI controlled
        player.moveInputX = 0;
        // check keys for user input
        if (keys[39] || keys[68]) {
            player.moveInputX = 1;
        }
        if (keys[37] || keys[65]) {
            player.moveInputX = -1;
        }
    }

    // Update game time for day/night cycle
    gameTime = (gameTime + 1) % dayDuration;

    // Update weather
    updateWeather();

    // Handle random events
    handleRandomEvents();

    // Check for map corruption
    handleCorruption();

    // Adapt difficulty based on player performance
    updateDifficulty();

    // Handle player horizontal movement
    player.velX += player.moveInputX * (player.speed / 10); // Smoother acceleration
    player.velX *= friction; // Apply friction

    // check keys for actions (jump, block, shoot, inventory)
    if (keys[38] || keys[32] || keys[87]) {
        jumpAction();
    }

    if (keys[66]) { // 'B' key for building/blocking
        if (player.handItem && player.handItem.type === ITEM_TYPE.BLOCK && playerBlocks > 0) {
            buildBlockAction();
        } else if (player.handItem && player.handItem.type === ITEM_TYPE.SHIELD) {
            player.isBlocking = true; // Hold B to block
        }
    } else {
        player.isBlocking = false; // Release B to stop blocking
    }
    if (keys[83]) { // 'S' key to shoot
        shootPlayerBullet();
        keys[83] = false; // Prevent continuous shooting
    }
    if (keys[73]) { // 'I' key for inventory
        toggleInventory();
        keys[73] = false; // Prevent multiple toggles
    }

    //check touches
    for (var i = 0; i < touches.length; i++) {
        if (buttonTouched(upButton, touches[i])) {
            jumpAction();
        } else if (buttonTouched(leftButton, touches[i])) {
            player.moveInputX = -1;
        } else if (buttonTouched(rightButton, touches[i])) {
            player.moveInputX = 1;
        } else if (buttonTouched(buildButton, touches[i])) {
            if (player.handItem && player.handItem.type === ITEM_TYPE.BLOCK && playerBlocks > 0) {
                buildBlockAction();
            } else if (player.handItem && player.handItem.type === ITEM_TYPE.SHIELD) {
                player.isBlocking = true;
            }
        } else if (buttonTouched(shootButton, touches[i])) {
            shootPlayerBullet();
        } else if (buttonTouched(blockButton, touches[i])) {
            player.isBlocking = true;
        }
    }

    if (touchButtonTimeout > 0) {
        touchButtonTimeout--;
    } else {
        player.isBlocking = false; // Stop blocking if touch buttons fade
    }

    // Apply playerSpeedMultiplier (from weather/mud)
    player.velX *= playerSpeedMultiplier;
    player.velY += gravity;

    // Move platforms and other static elements
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].x -= verticalSpeed;
    }
    for (var i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= verticalSpeed;
    }
    for (var i = 0; i < items.length; i++) {
        items[i].x -= verticalSpeed;
    }
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].x -= verticalSpeed * playerPerformance.difficultyModifier; // Enemies move faster with difficulty
        // Enemy shooting logic
        if (Date.now() - enemies[i].lastShotTime > enemies[i].shootingInterval / playerPerformance.difficultyModifier) { // Shoot faster with difficulty
            bullets.push({
                x: enemies[i].x + enemies[i].width / 2,
                y: enemies[i].y + enemies[i].height / 2,
                radius: 3,
                color: "purple",
                velX: (player.x - (enemies[i].x + enemies[i].width / 2)) / 50,
                velY: (player.y - (enemies[i].y + enemies[i].height / 2)) / 50
            });
            enemies[i].lastShotTime = Date.now();
        }
    }
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].x += bullets[i].velX;
        bullets[i].y += bullets[i].velY;
    }
    for (var i = 0; i < playerBullets.length; i++) { // Player bullet movement
        playerBullets[i].x += playerBullets[i].velX;
    }
    for (let i = 0; i < clouds.length; i++) { // Cloud movement
        clouds[i].x += clouds[i].velX;
        if (clouds[i].x + clouds[i].width < 0) {
            clouds[i].x = width + Math.random() * 100; // Respawn cloud off-screen to the right
            clouds[i].y = Math.random() * (gameHeight / 2);
            clouds[i].width = randFromToStep(50, 150, 10);
            clouds[i].height = randFromToStep(20, 60, 10);
            clouds[i].velX = -Math.random() * 0.5 - 0.1;
        }
    }

    // Move mountains
    for (let i = 0; i < mountains.length; i++) {
        mountains[i].x += mountains[i].velX;
        // If mountain goes off screen, respawn it on the right
        if (mountains[i].x + mountains[i].width < 0) {
            mountains[i].x = width + Math.random() * 200; // Spawn further out
            mountains[i].height = randFromToStep(50, 150, 10);
            mountains[i].width = randFromToStep(100, 300, 20);
            mountains[i].velX = -Math.random() * 0.05 - 0.01;
        }
    }

    // Bomb movement and explosion
    for (let i = bombs.length - 1; i >= 0; i--) {
        bombs[i].y += bombs[i].velY; // Bombs fall
        bombs[i].x -= verticalSpeed; // Move with screen scroll
        bombs[i].velY += gravity; // Apply gravity to bombs

        // Check for ground collision or explosion timer
        if (bombs[i].y + bombs[i].radius > gameHeight - 4 || bombs[i].explosionTimer <= 0) {
            // Explode!
            takeDamage(bombs[i].damage); // Apply damage
            // Create a small explosion effect (e.g., a temporary visual cue)
            // For simplicity, just remove the bomb for now
            bombs.splice(i, 1);
        } else {
            bombs[i].explosionTimer--;
        }
    }


    score += verticalSpeed;
    playerPerformance.recentScoreChange += verticalSpeed;

    if (verticalSpeed < 9) {
        verticalSpeed = (drawCount / 2000) * (2 - (drawCount / 2000)) * 8 + 1;
    }
    drawCount++;

    // Add new terrain/platforms
    if (boxes[boxes.length - 1].x + boxes[boxes.length - 1].width < width) {
        addNewWorldElements();
    }

    // deletes the elements that go out of screen
    if (boxes[0] && boxes[0].x + boxes[0].width < 0) {
        boxes = boxes.slice(1);
    }
    if (enemies[0] && enemies[0].x + enemies[0].width < 0) {
        enemies = enemies.slice(1);
    }
    if (items[0] && items[0].x + items[0].radius < 0) {
        items = items.slice(1);
    }
    if (bullets[0] && (bullets[0].x < 0 || bullets[0].x > width || bullets[0].y < 0 || bullets[0].y > gameHeight)) {
        bullets = bullets.slice(1);
    }
    if (playerBullets[0] && (playerBullets[0].x > width)) { // Player bullet removal
        playerBullets = playerBullets.slice(1);
    }
    if (obstacles[0] && obstacles[0].x + obstacles[0].width < 0) {
        obstacles = obstacles.slice(1);
    }
    if (bombs[0] && (bombs[0].x + bombs[0].radius < 0 || bombs[0].y > height + 50)) {
        bombs = bombs.slice(1); // Remove if off-screen or fallen too far
    }


    // Apply gravity
    player.velY += gravity;

    // Apply horizontal speed limit
    if (player.velX > player.speed * 2) player.velX = player.speed * 2;
    if (player.velX < -player.speed * 2) player.velX = -player.speed * 2;


    // --- Drawing Section ---
    ctx.clearRect(0, 0, width, height);

    // Draw background with day/night cycle
    drawBackground();

    // Draw mountains (before clouds for parallax)
    drawMountains();


    // Draw clouds
    ctx.fillStyle = "white";
    for (let i = 0; i < clouds.length; i++) {
        ctx.beginPath();
        ctx.arc(clouds[i].x, clouds[i].y, clouds[i].width / 4, 0, Math.PI * 2);
        ctx.arc(clouds[i].x + clouds[i].width / 3, clouds[i].y - clouds[i].height / 4, clouds[i].width / 4, 0, Math.PI * 2);
        ctx.arc(clouds[i].x + clouds[i].width * 2 / 3, clouds[i].y, clouds[i].width / 4, 0, Math.PI * 2);
        ctx.fill();
    }


    // Draw boxes (platforms)
    for (var i = 0; i < boxes.length; i++) {
        ctx.save();
        if (boxes[i].material === TERRAIN_TYPE.GRASS) {
            ctx.fillStyle = "darkgreen";
        } else if (boxes[i].material === TERRAIN_TYPE.STONE) {
            ctx.fillStyle = "grey";
        } else if (boxes[i].material === TERRAIN_TYPE.DIRT) {
            ctx.fillStyle = "saddlebrown";
        } else if (boxes[i].material === TERRAIN_TYPE.SAND) {
            ctx.fillStyle = "khaki";
        } else if (boxes[i].material === TERRAIN_TYPE.SNOW) {
            ctx.fillStyle = "white";
        } else {
            ctx.fillStyle = "black"; // Default for "platform" type
        }
        ctx.fillRect(Math.round(boxes[i].x), boxes[i].y, boxes[i].width, boxes[i].height);
        ctx.restore();
    }


    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        var dir = colCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }
    }

    // Draw enemies
    for (var i = 0; i < enemies.length; i++) {
        ctx.save();
        ctx.fillStyle = enemies[i].color;
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
        ctx.restore();
    }

    // Draw bullets (enemy)
    for (var i = 0; i < bullets.length; i++) {
        ctx.save();
        ctx.fillStyle = bullets[i].color;
        ctx.beginPath();
        ctx.arc(bullets[i].x, bullets[i].y, bullets[i].radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
    }

    // Draw player bullets
    for (var i = 0; i < playerBullets.length; i++) {
        ctx.save();
        ctx.fillStyle = playerBullets[i].color;
        ctx.fillRect(playerBullets[i].x, playerBullets[i].y, playerBullets[i].width, playerBullets[i].height);
        ctx.restore();
    }

    // Draw items
    for (var i = 0; i < items.length; i++) {
        ctx.save();
        ctx.fillStyle = items[i].color;
        ctx.beginPath();
        ctx.arc(items[i].x, items[i].y, items[i].radius, 0, Math.PI * 2, false);
        ctx.fill();
        // Draw icon for items
        ctx.fillStyle = "black"; // Icon color
        ctx.font = `${items[i].radius * 1.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(items[i].icon, items[i].x, items[i].y);
        ctx.restore();
    }

    // Draw obstacles
    for (var i = 0; i < obstacles.length; i++) {
        ctx.save();
        // Draw based on obstacle type
        if (obstacles[i].type === OBSTACLE_TYPE.SPIKE) {
            ctx.fillStyle = "darkred";
            ctx.beginPath();
            ctx.moveTo(obstacles[i].x, obstacles[i].y + obstacles[i].height);
            ctx.lineTo(obstacles[i].x + obstacles[i].width / 2, obstacles[i].y);
            ctx.lineTo(obstacles[i].x + obstacles[i].width, obstacles[i].y + obstacles[i].height);
            ctx.fill();
        } else if (obstacles[i].type === OBSTACLE_TYPE.WATER_HAZARD) {
            ctx.fillStyle = "blue";
            ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        } else if (obstacles[i].type === OBSTACLE_TYPE.LAVA_HAZARD) {
            ctx.fillStyle = "orange";
            ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        } else if (obstacles[i].type === OBSTACLE_TYPE.MUD_PIT) {
            ctx.fillStyle = "darkbrown";
            ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        } else if (obstacles[i].type === OBSTACLE_TYPE.PORTAL) {
            ctx.fillStyle = "purple";
            ctx.beginPath();
            ctx.arc(obstacles[i].x + obstacles[i].width / 2, obstacles[i].y + obstacles[i].height / 2, obstacles[i].width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "white"; // Inner glow
            ctx.beginPath();
            ctx.arc(obstacles[i].x + obstacles[i].width / 2, obstacles[i].y + obstacles[i].height / 2, obstacles[i].width / 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // Draw bombs
    for (let i = 0; i < bombs.length; i++) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(bombs[i].x, bombs[i].y, bombs[i].radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "red"; // Fuse
        ctx.fillRect(bombs[i].x - 1, bombs[i].y - bombs[i].radius - 5, 2, 5);
        ctx.restore();
    }


    if (player.grounded) {
        player.velY = 0;
    }

    player.x += player.velX;
    player.y += player.velY;

    // Player boundary checks
    if (player.x < -20) player.x = -20; // Allow slight backward movement
    if (player.x + player.width > width + 20) player.x = width + 20 - player.width;
    if (player.y < 0) player.y = 0;


    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // Draw player's hand item (shield visual)
    if (player.handItem && player.handItem.type === ITEM_TYPE.SHIELD) {
        ctx.fillStyle = player.isBlocking ? "lightblue" : "gray"; // Shield color changes when blocking
        ctx.fillRect(player.x + player.width + 2, player.y + player.height / 2 - 3, 5, 10); // Simple shield
    }
    ctx.restore();

    // Collision detection for player with enemies, bullets, items, and obstacles
    for (var i = enemies.length - 1; i >= 0; i--) { // Iterate backwards for safe splicing
        if (colCheck(player, enemies[i])) {
            takeDamage(1); // Player takes damage from enemy touch
            enemies.splice(i, 1); // Remove enemy after collision
        }
    }

    for (var i = bullets.length - 1; i >= 0; i--) {
        var dx = bullets[i].x - (player.x + player.width / 2);
        var dy = bullets[i].y - (player.y + player.height / 2);
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bullets[i].radius + player.width / 2) {
            if (player.isBlocking && player.handItem && player.handItem.type === ITEM_TYPE.SHIELD) {
                // Blocked the shot
                bullets.splice(i, 1);
            } else {
                takeDamage(1);
                bullets.splice(i, 1);
            }
        }
    }

    for (var i = playerBullets.length - 1; i >= 0; i--) { // Player bullet collision with enemies
        for (var j = enemies.length - 1; j >= 0; j--) {
            if (colCheck(playerBullets[i], enemies[j])) {
                playerBullets.splice(i, 1); // Remove bullet
                enemies.splice(j, 1); // Remove enemy
                score += 500; // Reward for killing enemy
                playerPerformance.enemiesKilled++;
                break; // Break inner loop as enemy is removed
            }
        }
    }


    for (var i = items.length - 1; i >= 0; i--) {
        var dx = items[i].x - (player.x + player.width / 2);
        var dy = items[i].y - (player.y + player.height / 2);
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < items[i].radius + player.width / 2) {
            collectItem(items[i]);
            items.splice(i, 1); // Remove collected item
        }
    }

    for (var i = obstacles.length - 1; i >= 0; i--) {
        if (colCheck(player, obstacles[i])) {
            handleObstacleCollision(obstacles[i]);
        }
    }

    // Bomb collision detection with player
    for (let i = bombs.length - 1; i >= 0; i--) {
        const dx = bombs[i].x - (player.x + player.width / 2);
        const dy = bombs[i].y - (player.y + player.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bombs[i].radius + player.width / 2) {
            takeDamage(bombs[i].damage);
            bombs.splice(i, 1); // Remove bomb after it hits player
        }
    }


    // Draw weather effects
    drawWeatherEffects();

    ctx.save();
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = 'center';
    ctx.fillText("Score: " + Math.round(score / 100), width / 2, 20);
    ctx.fillText("Best: " + bestScore, width / 2, 40);
    ctx.fillText("Coins: " + coinCount, width / 2, 60);
    ctx.fillText("Blocks: " + playerBlocks, width / 2, 80);
    ctx.fillText("Health: " + player.health + "/" + player.maxHealth, width / 2, 100); // Display health
    ctx.fillText("Weather: " + currentWeather, width / 2, 120); // Display weather
    ctx.restore();

    // Draw Hotbar
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    const hotbarY = height - 50;
    const itemSize = 40;
    const hotbarStartX = (width - (player.hotbar.length * itemSize)) / 2;
    for (let i = 0; i < player.hotbar.length; i++) {
        const item = player.hotbar[i];
        const x = hotbarStartX + i * itemSize;
        ctx.fillRect(x, hotbarY, itemSize, itemSize);
        if (i === player.selectedHotbarIndex) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, hotbarY, itemSize, itemSize);
        }
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon, x + itemSize / 2, hotbarY + itemSize / 2);
    }
    ctx.restore();


    if (touchButtonTimeout > 0) {
        ctx.fillStyle = "blue";
        ctx.fillRect(upButton.x, upButton.y, upButton.width, upButton.height);
        ctx.fillRect(leftButton.x, leftButton.y, leftButton.width, leftButton.height);
        ctx.fillRect(rightButton.x, rightButton.y, rightButton.width, rightButton.height);
        ctx.fillRect(buildButton.x, buildButton.y, buildButton.width, buildButton.height);
        ctx.fillRect(shootButton.x, shootButton.y, shootButton.width, shootButton.height); // Draw shoot button
        ctx.fillRect(blockButton.x, blockButton.y, blockButton.width, blockButton.height); // Draw block button

        ctx.fillStyle = "white";
        drawTriangle(upButton.x + upButton.width / 2, upButton.y + upButton.height / 2, 0, 15);
        drawTriangle(leftButton.x + leftButton.width / 2, leftButton.y + leftButton.height / 2, -Math.PI / 2, 15);
        drawTriangle(rightButton.x + rightButton.width / 2, rightButton.y + rightButton.height / 2, Math.PI / 2, 15);
        // Draw icon for build button (e.g., a small block)
        ctx.fillRect(buildButton.x + buildButton.width / 4, buildButton.y + buildButton.height / 4, buildButton.width / 2, buildButton.height / 2);
        // Draw icon for shoot button (e.g., an arrow)
        ctx.beginPath();
        ctx.moveTo(shootButton.x + shootButton.width / 4, shootButton.y + shootButton.height / 2);
        ctx.lineTo(shootButton.x + shootButton.width * 3 / 4, shootButton.y + shootButton.height / 2);
        ctx.lineTo(shootButton.x + shootButton.width / 2, shootButton.y + shootButton.height / 4);
        ctx.fill();
        // Draw icon for block button (e.g., a shield)
        ctx.fillRect(blockButton.x + blockButton.width / 4, blockButton.y + blockButton.height / 4, blockButton.width / 2, blockButton.height / 2); // Simple block icon
        ctx.fillStyle = "black";
    }

    if ((player.y > gameHeight + 20) || (player.x + player.width < -50) || (player.x > width + 50)) {
        playerDeath();
    } else {
        requestID = requestAnimationFrame(update);
    }
}

function drawBackground() {
    ctx.save();
    const timeRatio = gameTime / dayDuration; // 0 (morning) to 1 (end of night)

    let skyColor1, skyColor2, groundColor1, groundColor2;

    if (timeRatio < 0.25) { // Morning (sunrise)
        skyColor1 = interpolateColor([135, 206, 250], [255, 165, 0], timeRatio * 4); // Light blue to orange
        skyColor2 = interpolateColor([0, 191, 255], [255, 69, 0], timeRatio * 4); // Deep sky blue to red-orange
    } else if (timeRatio < 0.5) { // Day
        skyColor1 = [135, 206, 250]; // Light blue
        skyColor2 = [0, 191, 255]; // Deep sky blue
    } else if (timeRatio < 0.75) { // Evening (sunset)
        const transition = (timeRatio - 0.5) * 4;
        skyColor1 = interpolateColor([135, 206, 250], [25, 25, 112], transition); // Light blue to midnight blue
        skyColor2 = interpolateColor([0, 191, 255], [0, 0, 128], transition); // Deep sky blue to navy
    } else { // Night
        skyColor1 = [25, 25, 112]; // Midnight blue
        skyColor2 = [0, 0, 128]; // Navy
    }

    // Sky gradient
    var skyGradient = ctx.createLinearGradient(0, 0, 0, gameHeight);
    skyGradient.addColorStop(0, `rgb(${skyColor1[0]}, ${skyColor1[1]}, ${skyColor1[2]})`);
    skyGradient.addColorStop(1, `rgb(${skyColor2[0]}, ${skyColor2[1]}, ${skyColor2[2]})`);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, gameHeight);

    // Ground colors (remain relatively constant but might darken at night)
    const darknessFactor = 1 - Math.abs(timeRatio - 0.5) * 2; // Darkest at 0.75-1 and 0-0.25, brightest at 0.5
    groundColor1 = [Math.round(20 * darknessFactor), Math.round(100 * darknessFactor), Math.round(20 * darknessFactor)]; // Darker green
    groundColor2 = [Math.round(139 * darknessFactor), Math.round(69 * darknessFactor), Math.round(19 * darknessFactor)]; // Darker brown

    ctx.fillStyle = `rgb(${groundColor1[0]}, ${groundColor1[1]}, ${groundColor1[2]})`; // Grass
    ctx.fillRect(0, gameHeight - 4, width, 4); // Ground grass part
    ctx.fillStyle = `rgb(${groundColor2[0]}, ${groundColor2[1]}, ${groundColor2[2]})`; // Dirt
    ctx.fillRect(0, gameHeight, width, height - gameHeight); // Area below game height is dirt/abyss

    ctx.fillStyle = "black"; // Abyss remains black
    ctx.fillRect(0, gameHeight + 20, width, height - (gameHeight + 20));

    ctx.restore();
}

function interpolateColor(color1, color2, factor) {
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
}

function drawMountains() {
    ctx.save();
    for (let i = 0; i < mountains.length; i++) {
        const mountain = mountains[i];
        ctx.fillStyle = mountain.color;
        ctx.beginPath();
        ctx.moveTo(mountain.x, mountain.baseY);
        ctx.lineTo(mountain.x + mountain.width / 2, mountain.baseY - mountain.height);
        ctx.lineTo(mountain.x + mountain.width, mountain.baseY);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
}


function updateWeather() {
    weatherTimer++;
    if (weatherTimer > weatherDuration) {
        weatherTimer = 0;
        const weatherTypes = ['none', 'rain', 'hail', 'snow', 'heat', 'freezing'];
        currentWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        weatherDuration = 60 * randFromToStep(5, 15, 1); // New random duration for next weather event
    }

    playerSpeedMultiplier = 1; // Reset multiplier each frame
    // Apply weather effects
    switch (currentWeather) {
        case 'rain':
            // Slight visual obstruction, maybe minor slippery ground
            break;
        case 'hail':
            if (Math.random() < 0.005) takeDamage(0.1); // Small chance to take damage
            break;
        case 'snow':
            playerSpeedMultiplier = 0.8; // Slow down
            break;
        case 'heat':
            if (Math.random() < 0.002) takeDamage(0.05); // Minor health drain
            playerSpeedMultiplier = 1.1; // Slight speed boost from heat? (or thirst mechanic)
            break;
        case 'freezing':
            if (Math.random() < 0.005) takeDamage(0.1); // Health drain
            playerSpeedMultiplier = 0.7; // Significant slow down
            break;
    }
}

function drawWeatherEffects() {
    ctx.save();
    switch (currentWeather) {
        case 'rain':
            ctx.fillStyle = "rgba(100, 100, 255, 0.5)";
            for (let i = 0; i < 50; i++) {
                ctx.fillRect(Math.random() * width, Math.random() * height, 1, 10);
            }
            break;
        case 'hail':
            ctx.fillStyle = "rgba(200, 200, 255, 0.7)";
            for (let i = 0; i < 30; i++) {
                ctx.fillRect(Math.random() * width, Math.random() * height, 3, 3);
            }
            break;
        case 'snow':
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            for (let i = 0; i < 70; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * width, Math.random() * height, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        case 'heat':
            // Subtle heat haze
            ctx.fillStyle = "rgba(255, 165, 0, 0.1)";
            ctx.fillRect(0, 0, width, height);
            break;
        case 'freezing':
            // Subtle blue tint
            ctx.fillStyle = "rgba(100, 100, 255, 0.1)";
            ctx.fillRect(0, 0, width, height);
            break;
    }
    ctx.restore();
}

function handleRandomEvents() {
    randomEventTimer++;
    if (randomEventTimer > nextRandomEventTime) {
        randomEventTimer = 0;
        nextRandomEventTime = 60 * randFromToStep(15, 30, 1); // Next event 15-30 seconds later

        const eventTypes = ['enemy_swarm', 'health_boost', 'speed_boost', 'item_drop', 'bomb_drop']; // Added 'bomb_drop'
        const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        switch (randomEventType) {
            case 'enemy_swarm':
                for (let i = 0; i < randFromToStep(3, 7, 1); i++) {
                    enemies.push({
                        x: width + randFromToStep(50, 200, 10),
                        y: randFromToStep(20, gameHeight - 50, 10),
                        width: 15,
                        height: 15,
                        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                        speed: 1,
                        shootingInterval: 500 + Math.random() * 1000,
                        lastShotTime: Date.now()
                    });
                }
                break;
            case 'health_boost':
                player.health = Math.min(player.maxHealth, player.health + 2);
                break;
            case 'speed_boost':
                verticalSpeed += 2; // Temporary speed boost
                setTimeout(() => verticalSpeed -= 2, 60 * 5); // Lasts 5 seconds
                break;
            case 'item_drop':
                for (let i = 0; i < randFromToStep(2, 5, 1); i++) {
                    items.push(generateRandomItem(getRandomItemType(), width + randFromToStep(0, 100, 10), randFromToStep(gameHeight / 2, gameHeight - 20, 10), 10));
                }
                break;
            case 'bomb_drop':
                spawnBomb(player.x + randFromToStep(-50, 50, 10), randFromToStep(0, 50, 10)); // Drop near player's x
                break;
        }
    }
}

function spawnBomb(x, y) {
    bombs.push({
        x: x,
        y: y,
        radius: 8,
        color: "black",
        velY: 0, // Starts with no vertical velocity, drops with gravity
        damage: 2, // Damage on impact/explosion
        explosionTimer: 60 * randFromToStep(1, 3, 1) // 1-3 seconds before explosion
    });
}


function handleCorruption() {
    if (corruptionActive) {
        corruptionTimer++;
        if (corruptionTimer > corruptionDuration) {
            corruptionActive = false;
            corruptionTimer = 0;
            // Restore map elements if temporary
            // For now, let's just stop the destruction
        } else {
            // Randomly destroy parts of the map
            if (Math.random() < 0.05) { // 5% chance per frame to destroy a piece
                if (boxes.length > 5) { // Keep some starting platforms
                    const index = randFromToStep(5, boxes.length - 1, 1);
                    boxes.splice(index, 1); // Remove a random platform
                }
            }
            if (Math.random() < 0.03) { // Destroy obstacles
                if (obstacles.length > 0) {
                    const index = randFromToStep(0, obstacles.length - 1, 1);
                    obstacles.splice(index, 1);
                }
            }
        }
    } else {
        if (Math.random() < corruptionChance * playerPerformance.difficultyModifier) { // Higher chance on higher difficulty
            corruptionActive = true;
            corruptionTimer = 0;
        }
    }
}


function takeDamage(amount) {
    if (Date.now() - player.lastDamageTime > player.invulnerabilityDuration) {
        player.health -= amount;
        player.lastDamageTime = Date.now();
        playerPerformance.hitsTaken++;
        playerPerformance.playerHealthHistory.push({
            time: Date.now(),
            health: player.health
        });
        if (player.health <= 0) {
            playerDeath();
        } else {
            // Player is still alive, maybe flash red or something
        }
    }
}

function handleObstacleCollision(obstacle) {
    if (Date.now() - player.lastDamageTime < player.invulnerabilityDuration && obstacle.type !== OBSTACLE_TYPE.PORTAL) {
        return; // Player is invulnerable to non-portal obstacles
    }

    switch (obstacle.type) {
        case OBSTACLE_TYPE.SPIKE:
            takeDamage(1);
            break;
        case OBSTACLE_TYPE.WATER_HAZARD:
            takeDamage(0.5); // Less damage, but slows player
            playerSpeedMultiplier = 0.5; // Slow down
            break;
        case OBSTACLE_TYPE.LAVA_HAZARD:
            takeDamage(2); // High damage
            break;
        case OBSTACLE_TYPE.MUD_PIT:
            playerSpeedMultiplier = 0.2; // Significant slow down
            break;
        case OBSTACLE_TYPE.PORTAL:
            teleportPlayer();
            obstacles = obstacles.filter(o => o !== obstacle); // Remove portal after use
            break;
    }
}

function teleportPlayer() {
    player.x = randFromToStep(width / 4, width * 3 / 4, 10);
    player.y = randFromToStep(gameHeight - 100, gameHeight - 20, 10);
    player.velX = 0;
    player.velY = 0;
    player.grounded = false;
    player.jumping = false;

    // Ensure there's a platform under the player after teleporting
    // Find the closest existing platform or create a new one
    let safeLandingFound = false;
    for (let i = 0; i < boxes.length; i++) {
        if (player.x >= boxes[i].x - player.width && player.x <= boxes[i].x + boxes[i].width &&
            player.y + player.height <= boxes[i].y && player.y + player.height + 50 >= boxes[i].y) {
            safeLandingFound = true;
            break;
        }
    }
    if (!safeLandingFound) {
        // Create a new platform for safe landing
        boxes.push({
            x: player.x - 20,
            y: player.y + player.height + 5,
            width: 80,
            height: 4,
            type: "platform",
            material: TERRAIN_TYPE.GRASS
        });
    }
}


function getRandomItemType() {
    const itemTypes = [
        ITEM_TYPE.COIN, ITEM_TYPE.BLOCK, ITEM_TYPE.FRUIT, ITEM_TYPE.AXE,
        ITEM_TYPE.PICKAXE, ITEM_TYPE.SHOVEL, ITEM_TYPE.WATER, ITEM_TYPE.LAVA,
        ITEM_TYPE.STONE, ITEM_TYPE.MUD, ITEM_TYPE.GENERIC, ITEM_TYPE.HEALTH_ORB
    ];
    return itemTypes[Math.floor(Math.random() * itemTypes.length)];
}

function generateRandomItem(type, x, y, platformWidth) {
    let item = {
        x: x + randFromToStep(0, platformWidth - 10, 5),
        y: y,
        radius: 7,
        type: type,
        properties: {},
        icon: "",
        color: ""
    };

    switch (type) {
        case ITEM_TYPE.COIN:
            item.radius = 5;
            item.color = "gold";
            item.icon = "💰";
            break;
        case ITEM_TYPE.BLOCK:
            item.radius = 7;
            item.color = "brown";
            item.icon = "🧱";
            break;
        case ITEM_TYPE.FRUIT:
            const fruits = [{
                name: "Apple",
                icon: "🍎",
                heal: 1
            }, {
                name: "Banana",
                icon: "🍌",
                heal: 0.5
            }, {
                name: "Cherry",
                icon: "🍒",
                heal: 0.2
            }];
            const selectedFruit = fruits[Math.floor(Math.random() * fruits.length)];
            item.name = selectedFruit.name;
            item.icon = selectedFruit.icon;
            item.color = "red";
            item.radius = 6;
            item.properties.heal = selectedFruit.heal;
            break;
        case ITEM_TYPE.HEALTH_ORB:
            item.name = "Health Orb";
            item.icon = "❤️";
            item.color = "hotpink";
            item.radius = 8;
            item.properties.heal = randFromToStep(1, 3, 0.5); // Heals 1-3 health
            break;
        case ITEM_TYPE.AXE:
            item.name = "Axe";
            item.icon = "🪓";
            item.color = "silver";
            item.radius = 8;
            item.properties.damage = randFromToStep(5, 15, 1);
            item.properties.speed = randFromToStep(1, 3, 0.5);
            break;
        case ITEM_TYPE.PICKAXE:
            item.name = "Pickaxe";
            item.icon = "⛏️";
            item.color = "darkgray";
            item.radius = 8;
            item.properties.damage = randFromToStep(7, 20, 1);
            item.properties.speed = randFromToStep(0.5, 2.5, 0.5);
            break;
        case ITEM_TYPE.SHOVEL:
            item.name = "Shovel";
            item.icon = " shovel";
            item.color = "burlywood";
            item.radius = 8;
            item.properties.digSpeed = randFromToStep(1, 4, 0.5);
            break;
        case ITEM_TYPE.WATER:
            item.name = "Water Bottle";
            item.icon = "💧";
            item.color = "cyan";
            item.radius = 5;
            item.properties.effect = "hydration"; // Could remove mud slow, or slight heal
            break;
        case ITEM_TYPE.LAVA:
            item.name = "Lava Bucket";
            item.icon = "🌋";
            item.color = "darkorange";
            item.radius = 5;
            item.properties.effect = "burn"; // Could be used as a weapon
            break;
        case ITEM_TYPE.STONE:
            item.name = "Stone";
            item.icon = "🪨";
            item.color = "gray";
            item.radius = 7;
            item.properties.material = "stone";
            break;
        case ITEM_TYPE.MUD:
            item.name = "Mud";
            item.icon = "🟫";
            item.color = "sienna";
            item.radius = 7;
            item.properties.material = "mud";
            break;
        case ITEM_TYPE.GENERIC:
            item.name = "Mystery Item";
            item.icon = "❓";
            item.color = `hsl(${Math.random() * 360}, 100%, 70%)`; // Random bright color
            item.radius = randFromToStep(5, 10, 1);
            // Random properties
            item.properties.power = Math.random() < 0.5 ? randFromToStep(1, 10, 1) : null;
            item.properties.luck = Math.random() < 0.5 ? Math.random().toFixed(2) : null;
            item.properties.rarity = ["common", "uncommon", "rare", "epic"][Math.floor(Math.random() * 4)];
            break;
    }
    return item;
}

function collectItem(item) {
    if (item.type === ITEM_TYPE.COIN) {
        coinCount++;
        playerPerformance.coinsCollected++;
    } else if (item.type === ITEM_TYPE.BLOCK) {
        playerBlocks++;
        playerPerformance.platformsBuilt++;
        const existingBlock = player.inventory.find(invItem => invItem.type === ITEM_TYPE.BLOCK);
        if (!existingBlock) {
            player.inventory.push({
                name: "Building Block",
                type: ITEM_TYPE.BLOCK,
                description: "Used to build platforms.",
                icon: "🧱"
            });
        }
    } else if (item.type === ITEM_TYPE.FRUIT || item.type === ITEM_TYPE.HEALTH_ORB) {
        if (item.properties.heal) {
            player.health = Math.min(player.maxHealth, player.health + item.properties.heal);
        }
    } else {
        // For other new items, add to inventory
        const existingItem = player.inventory.find(invItem => invItem.name === item.name);
        if (!existingItem) {
            player.inventory.push({
                name: item.name,
                type: item.type,
                description: item.properties.rarity ? `Rarity: ${item.properties.rarity}` : item.description,
                icon: item.icon,
                properties: item.properties
            });
        }
    }
}


function getRandomObstacleType() {
    const obstacleTypes = [
        OBSTACLE_TYPE.SPIKE,
        OBSTACLE_TYPE.WATER_HAZARD,
        OBSTACLE_TYPE.LAVA_HAZARD,
        OBSTACLE_TYPE.MUD_PIT,
        OBSTACLE_TYPE.PORTAL,
        OBSTACLE_TYPE.BOMB // Added bomb to random obstacles
    ];
    // Adjust probabilities based on difficulty
    let weightedObstacles = [];
    obstacleTypes.forEach(type => {
        let weight = 1; // Default weight
        if (type === OBSTACLE_TYPE.LAVA_HAZARD) weight = 0.5 * playerPerformance.difficultyModifier; // More lava on harder difficulty
        if (type === OBSTACLE_TYPE.SPIKE) weight = 1.2 * playerPerformance.difficultyModifier; // More spikes on harder difficulty
        if (type === OBSTACLE_TYPE.MUD_PIT) weight = 0.8 * playerPerformance.difficultyModifier; // Less mud on harder difficulty (as it just slows)
        if (type === OBSTACLE_TYPE.PORTAL) weight = 0.1 / playerPerformance.difficultyModifier; // Portals are rarer, especially on high difficulty
        if (type === OBSTACLE_TYPE.BOMB) weight = 0.7 * playerPerformance.difficultyModifier; // More bombs on harder difficulty

        for (let i = 0; i < Math.round(weight * 10); i++) {
            weightedObstacles.push(type);
        }
    });
    return weightedObstacles[Math.floor(Math.random() * weightedObstacles.length)];
}


function generateRandomObstacle(type, x, y) {
    let obstacle = {
        x: x,
        y: y,
        width: randFromToStep(10, 40, 10),
        height: randFromToStep(10, 30, 10),
        type: type
    };
    if (type === OBSTACLE_TYPE.SPIKE) {
        obstacle.y = gameHeight - obstacle.height; // Always on ground
    } else if (type === OBSTACLE_TYPE.WATER_HAZARD || type === OBSTACLE_TYPE.LAVA_HAZARD || type === OBSTACLE_TYPE.MUD_PIT) {
        obstacle.height = randFromToStep(15, 40, 5); // Vary height of liquid/mud
        obstacle.y = gameHeight - obstacle.height; // Always on ground
    } else if (type === OBSTACLE_TYPE.PORTAL) {
        obstacle.width = 30;
        obstacle.height = 30;
        obstacle.y = gameHeight - obstacle.height - randFromToStep(20, 80, 10); // Floating above platforms
    } else if (type === OBSTACLE_TYPE.BOMB) {
        // Bombs are handled separately with spawnBomb, so this case shouldn't be reached if used as an obstacle,
        // but if it is, set default bomb properties.
        obstacle.radius = 8;
        obstacle.color = "black";
        obstacle.velY = 0;
        obstacle.damage = 2;
        obstacle.explosionTimer = 60 * randFromToStep(1, 3, 1);
        obstacle.y = randFromToStep(0, 50, 10); // Spawn at the top
        obstacle.x = x; // Use the provided x
    }
    return obstacle;
}

function getRandomTerrainType() {
    const terrainTypes = [TERRAIN_TYPE.GRASS, TERRAIN_TYPE.STONE, TERRAIN_TYPE.DIRT, TERRAIN_TYPE.SAND, TERRAIN_TYPE.SNOW];
    // Adjust probabilities for terrain based on difficulty or time of day
    let weightedTerrain = [];
    terrainTypes.forEach(type => {
        let weight = 1;
        if (type === TERRAIN_TYPE.SNOW && currentWeather === 'snow') weight = 2; // More snow terrain in snow weather
        if (type === TERRAIN_TYPE.STONE) weight = 1 + (playerPerformance.difficultyModifier - 1); // More stone on higher difficulty
        for (let i = 0; i < Math.round(weight * 10); i++) {
            weightedTerrain.push(type);
        }
    });
    return weightedTerrain[Math.floor(Math.random() * weightedTerrain.length)];
}


function addNewWorldElements() {
    var lastBox = boxes[boxes.length - 1];
    var newBoxX = lastBox.x + lastBox.width + randFromToStep(8, 68, 10); // Standard gap
    var boxHeight = 4 + randFromToStep(0, 10, 2);

    // Vary platform height and gap
    if (Math.random() < 0.3) { // 30% chance for a larger gap or higher platform
        newBoxX = lastBox.x + lastBox.width + randFromToStep(80, 150, 10); // Larger gap
        boxHeight = 4 + randFromToStep(0, 30, 2); // Vary height more
    }

    let platformMaterial = getRandomTerrainType();

    boxes.push({
        x: newBoxX,
        y: gameHeight - boxHeight,
        width: randFromToStep(100, 300, 40),
        height: boxHeight,
        type: "platform",
        material: platformMaterial
    });

    // Spawn enemies (sky or platform)
    if (Math.random() < (0.2 * playerPerformance.difficultyModifier)) {
        let enemyY;
        if (Math.random() < 0.5) { // 50% chance for sky enemy
            enemyY = randFromToStep(20, gameHeight - 80, 10); // In the sky
        } else {
            enemyY = gameHeight - boxHeight - randFromToStep(20, 50, 10); // Floating above platforms
        }
        enemies.push({
            x: newBoxX + randFromToStep(0, boxes[boxes.length - 1].width - 30, 10),
            y: enemyY,
            width: 15,
            height: 15,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`, // Random color
            speed: 1,
            shootingInterval: 500 + Math.random() * 1000,
            lastShotTime: Date.now()
        });
    }

    // Spawn various items
    if (Math.random() < (0.4 * playerPerformance.difficultyModifier)) {
        let itemType = getRandomItemType();
        items.push(generateRandomItem(itemType, newBoxX, gameHeight - boxHeight - randFromToStep(10, 40, 5), boxes[boxes.length - 1].width));
    }

    // Spawn obstacles (e.g., spikes, water, lava, mud, portal, BOMB)
    if (Math.random() < (0.25 * playerPerformance.difficultyModifier)) {
        let obstacleType = getRandomObstacleType();
        if (obstacleType === OBSTACLE_TYPE.BOMB) {
            spawnBomb(newBoxX + randFromToStep(0, boxes[boxes.length - 1].width - 30, 10), randFromToStep(0, 50, 10)); // Spawn bomb from above
        } else {
            obstacles.push(generateRandomObstacle(obstacleType, newBoxX + randFromToStep(0, boxes[boxes.length - 1].width - 30, 10), gameHeight - 10));
        }
    }
}


function updateDifficulty() {
    // A simple adaptive difficulty logic
    // Increase difficulty if player is doing well, decrease if struggling

    const healthRatio = player.health / player.maxHealth;

    // Calculate recent health trend
    const recentHealthHistory = playerPerformance.playerHealthHistory.filter(h => Date.now() - h.time < 5000); // Last 5 seconds
    if (recentHealthHistory.length > 1) {
        const healthTrend = recentHealthHistory[recentHealthHistory.length - 1].health - recentHealthHistory[0].health;
        if (healthTrend > 0) { // Gaining health
            playerPerformance.difficultyModifier += 0.0001;
        } else if (healthTrend < 0) { // Losing health
            playerPerformance.difficultyModifier -= 0.0002;
        }
    }


    if (healthRatio > 0.8 && playerPerformance.enemiesKilled > 0) {
        playerPerformance.difficultyModifier += 0.00005; // Slightly increase difficulty
    } else if (healthRatio < 0.3 || playerPerformance.hitsTaken > 0) {
        playerPerformance.difficultyModifier -= 0.0001; // Decrease difficulty more significantly
    }

    // Keep difficulty within reasonable bounds
    playerPerformance.difficultyModifier = Math.max(0.7, Math.min(2.0, playerPerformance.difficultyModifier));

    // Reset temporary performance metrics
    playerPerformance.hitsTaken = 0;
    playerPerformance.enemiesKilled = 0;
    playerPerformance.platformsBuilt = 0;
    playerPerformance.coinsCollected = 0;
    playerPerformance.recentScoreChange = 0;
    playerPerformance.playerHealthHistory = [];
}

function aiControl() {
    // AI logic:
    // 1. Prioritize avoiding immediate threats (obstacles, enemies, bombs)
    // 2. Prioritize jumping over gaps
    // 3. Shoot at visible enemies
    // 4. Move forward
    // 5. Block if shield equipped and bullet incoming

    player.moveInputX = 1; // Default: move forward

    // Check for incoming bullets to block
    const shieldEquipped = player.handItem && player.handItem.type === ITEM_TYPE.SHIELD;
    if (shieldEquipped) {
        const incomingBullet = bullets.find(b => b.x < player.x + player.width + 20 && b.x > player.x && b.y > player.y && b.y < player.y + player.height);
        if (incomingBullet) {
            player.isBlocking = true;
        } else {
            player.isBlocking = false;
        }
    }

    // Check for immediate obstacles
    const imminentObstacle = obstacles.find(o => o.x > player.x && o.x < player.x + 100); // Obstacle within 100 units
    if (imminentObstacle) {
        if (imminentObstacle.type === OBSTACLE_TYPE.SPIKE || imminentObstacle.type === OBSTACLE_TYPE.LAVA_HAZARD || imminentObstacle.type === OBSTACLE_TYPE.WATER_HAZARD || imminentObstacle.type === OBSTACLE_TYPE.MUD_PIT) {
            jumpAction(); // Jump over it
        } else if (imminentObstacle.type === OBSTACLE_TYPE.PORTAL) {
            // AI might decide to jump into or avoid portals based on a random chance or game state
            if (Math.random() < 0.5) { // 50% chance to enter portal
                jumpAction(); // Jump into it
            } else {
                player.moveInputX = -1; // Try to move backward to avoid
            }
        }
    }

    // Check for incoming bombs
    const incomingBomb = bombs.find(b => b.x > player.x - 50 && b.x < player.x + player.width + 50 && b.y > player.y - 100 && b.y < player.y + player.height + 50);
    if (incomingBomb) {
        // Try to move away from the bomb's predicted landing spot
        if (incomingBomb.x < player.x) {
            player.moveInputX = 1; // Move right if bomb is to the left
        } else {
            player.moveInputX = -1; // Move left if bomb is to the right
        }
        // Jump if bomb is too close vertically
        if (Math.abs(incomingBomb.y - player.y) < 50 && player.grounded) {
            jumpAction();
        }
    }


    // Check for gaps (no platform ahead)
    const nextPlatform = boxes.find(b => b.x > player.x + player.width);
    if (!nextPlatform || (nextPlatform.x - (player.x + player.width)) > 50) { // If large gap
        if (player.grounded) {
            jumpAction();
        }
    }

    // Check for enemies to shoot
    const nearestEnemy = enemies.find(e => e.x > player.x && e.x < player.x + 200 && e.y >= player.y - 10 && e.y <= player.y + player.height + 10);
    if (nearestEnemy && !player.isBlocking) { // Don't shoot if blocking
        shootPlayerBullet();
    }
}


function playerDeath() {
    bestScore = Math.max(bestScore, Math.round(score / 100));
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.textAlign = "center";
    ctx.font = "18px sans-serif";
    ctx.fillText("You died!", width / 2, 60); // Changed message
    ctx.font = "14px sans-serif";
    ctx.fillText("Score: " + Math.round(score / 100), width / 2, 90);
    ctx.fillText("Best: " + bestScore, width / 2, 110);
    ctx.fillText("Coins collected: " + coinCount, width / 2, 130);
    ctx.fillText("All hearts lost! Restarting fresh.", width / 2, 150);
    ctx.fillText("Press Space or touch the screen to restart", width / 2, 170);
    ctx.restore();
    window.setTimeout(function() {
        requestAnimationFrame(gameoverLoop);
    }, 700);
}

function resetPlayerPosition() {
    player.x = Math.round(width / 3);
    player.y = gameHeight - 15;
    player.velX = 0;
    player.velY = 0;
    player.jumping = false;
    player.grounded = false;
}


/**
 * Draws a equilateral triangle on canvas.
 * @param {*} x x of center of the triangle
 * @param {*} y y of center of the triangle
 * @param {*} angle The angle to rotate clockwise in radians.
 * @param {*} radius The radius of the circle passing over the corners of the triange.
 */
function drawTriangle(x, y, angle, radius) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -radius);
    ctx.lineTo(radius * 0.866, radius / 2);
    ctx.lineTo(-radius * 0.866, radius / 2);
    ctx.fill();
    ctx.restore();
}

function mainMenuDraw() {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "48px serif";
    ctx.fillText("Skyer", width / 2, height / 2 - 50); // New title
    ctx.font = "16px sans-serif";
    ctx.fillText("An Open-source 2D exploration, fighting and destroyer game.", width / 2, height / 2 - 10);
    ctx.fillText("Forked from 'https://github.com/kilicbaran/endless-runner/'", width / 2, height / 2 + 10);
    ctx.font = "12px sans-serif";
    ctx.fillText("Press Space or touch the screen to start", width / 2, height / 2 + 50);
    ctx.fillText("Controls:", width / 2, height / 2 + 70);
    ctx.fillText("W, A, D or arrows or space to jump, go left and go right", width / 2, height / 2 + 90);
    ctx.fillText("S to Shoot, B to Block", width / 2, height / 2 + 110); // Shoot and Block controls
    ctx.fillText("I to Open Inventory, F to Toggle AI", width / 2, height / 2 + 130); // Inventory and AI controls
    ctx.restore();
    requestID = requestAnimationFrame(mainMenuLoop);
}

function mainMenuLoop() {
    if (keys[32] || touches.length > 0) {
        // space or screen touched
        requestID = requestAnimationFrame(update);
    } else {
        requestID = requestAnimationFrame(mainMenuLoop);
    }
}

function buttonTouched(button, touch) {
    return (touch.pageX >= button.x && touch.pageX <= (button.x + button.width) &&
        touch.pageY >= button.y && touch.pageY <= (button.y + button.height));
}

function jumpAction() {
    if (!player.jumping && player.grounded) {
        player.jumping = true;
        player.grounded = false;
        player.velY = -player.speed * 3.5;
    }
}

function shootPlayerBullet() { // Function to handle player shooting
    // Only shoot if not blocking and if player is alive
    if (!player.isBlocking && player.health > 0) {
        playerBullets.push({
            x: player.x + player.width,
            y: player.y + player.height / 2 - 1, // Centered vertically with player
            width: 8,
            height: 2,
            color: "orange",
            velX: 10 // Speed of player bullet
        });
    }
}


function buildBlockAction() {
    // Find a "Building Block" in the inventory
    const blockItem = player.inventory.find(item => item.type === ITEM_TYPE.BLOCK);

    if (blockItem && playerBlocks > 0) {
        // Create a new block near the player
        boxes.push({
            x: player.x + player.width + 5, // Slightly to the right of player
            y: player.y + player.height - 10, // Around player's height
            width: 10,
            height: 10,
            type: "platform", // Built blocks are platforms
            material: TERRAIN_TYPE.STONE, // Built blocks are stone material
            isBuilt: true // Mark as built
        });
        playerBlocks--;
        playerPerformance.platformsBuilt++;
    }
}

function gameoverLoop() {
    if (keys[32] || touches.length > 0) {
        // space key or screen is touched
        resetGameState();

        requestID = requestAnimationFrame(update);
    } else {
        requestID = requestAnimationFrame(gameoverLoop);
    }
}

function resetGameState() {
    player = {
        x: Math.round(width / 3),
        y: gameHeight - 15,
        width: 5,
        height: 5,
        speed: 2,
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false,
        health: 4, // Reset health
        maxHealth: 4,
        isBlocking: false,
        inventory: [{ // Reset inventory to default shield
            name: "Wooden Shield",
            type: ITEM_TYPE.SHIELD,
            description: "Blocks enemy blasts.",
            icon: "🛡️",
            properties: {
                defense: 1
            }
        }],
        hotbar: [],
        selectedHotbarIndex: 0,
        handItem: null,
        lastDamageTime: 0,
        invulnerabilityDuration: 1000,
        moveInputX: 0
    };
    player.handItem = player.inventory[0];
    player.hotbar.push(player.inventory[0]);

    verticalSpeed = 1;
    drawCount = 1;
    score = 0;
    coinCount = 0;
    playerBlocks = 0;

    gameTime = 0;
    currentWeather = 'none';
    weatherTimer = 0;
    corruptionActive = false;
    corruptionTimer = 0;
    randomEventTimer = 0;
    nextRandomEventTime = 60 * 10; // Reset next random event time
    playerSpeedMultiplier = 1;

    isAIControlled = false; // Reset AI control
    inactivityTimer = 0; // Reset inactivity timer

    playerPerformance = { // Reset player performance metrics
        hitsTaken: 0,
        enemiesKilled: 0,
        platformsBuilt: 0,
        coinsCollected: 0,
        recentScoreChange: 0,
        difficultyModifier: 1.0,
        playerHealthHistory: []
    };

    boxes = [];
    enemies = [];
    bullets = [];
    playerBullets = [];
    items = [];
    obstacles = [];
    clouds = [];
    bombs = []; // Reset bombs array

    // Re-initialize starting platform
    boxes.push({
        x: 0,
        y: gameHeight - 4,
        width: width + 20,
        height: 4,
        type: "platform",
        material: TERRAIN_TYPE.GRASS
    });

    // Re-initialize clouds
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * width,
            y: Math.random() * (gameHeight / 2),
            width: randFromToStep(50, 150, 10),
            height: randFromToStep(20, 60, 10),
            velX: -Math.random() * 0.5 - 0.1
        });
    }

    // Re-initialize mountains
    mountains = [];
    for (let i = 0; i < 3; i++) {
        mountains.push({
            x: Math.random() * width * 1.5,
            baseY: gameHeight - 4,
            width: randFromToStep(100, 300, 20),
            height: randFromToStep(50, 150, 10),
            color: `hsl(90, ${randFromToStep(20, 40, 5)}%, ${randFromToStep(20, 30, 5)}%)`,
            velX: -Math.random() * 0.05 - 0.01
        });
    }
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

function randFromToStep(from, to, step) {
    return Math.floor(Math.random() * (((to - from) / step) + 1)) * step + from;
}

// Event listeners for user input to reset AI timer
document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    inactivityTimer = 0; // Reset timer on any key press

    // Toggle AI with 'F' key
    if (e.keyCode === 70) { // 'F' key
        isAIControlled = !isAIControlled;
        console.log("AI Toggled: " + (isAIControlled ? "ON" : "OFF"));
    }
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
    if (e.keyCode === 66) { // Release 'B' key
        player.isBlocking = false;
    }
});

canvas.addEventListener("click", function(e) { // For inventory interaction
    inactivityTimer = 0; // Reset timer on click
    if (gamePaused) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / scale;
        const mouseY = (e.clientY - rect.top) / scale;

        // Check for inventory item clicks
        const inventoryStartX = (width - 200) / 2;
        const inventoryStartY = (height - (player.inventory.length * 30 + 100)) / 2 + 50; // Adjust for title

        for (let i = 0; i < player.inventory.length; i++) {
            const item = player.inventory[i];
            const itemY = inventoryStartY + i * 30;
            if (mouseX >= inventoryStartX && mouseX <= inventoryStartX + 200 &&
                mouseY >= itemY && mouseY <= itemY + 25) {
                // Item selected
                player.handItem = item;
                // Add to hotbar if not already there
                if (!player.hotbar.includes(item)) {
                    if (player.hotbar.length < 5) { // Limit hotbar size
                        player.hotbar.push(item);
                    } else {
                        // Replace last item if hotbar is full
                        player.hotbar[player.hotbar.length - 1] = item;
                    }
                }
                player.selectedHotbarIndex = player.hotbar.indexOf(item);
                toggleInventory(); // Close inventory
                break;
            }
        }
    }
});


window.addEventListener('touchstart', function(e) {
    e.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
    touchButtonTimeout = 60 * 5;
    inactivityTimer = 0; // Reset timer on touch
    var changedTouches = e.changedTouches;
    for (var i = 0; i < changedTouches.length; i++) {
        touches.push({
            id: changedTouches[i].identifier,
            pageX: changedTouches[i].pageX,
            pageY: changedTouches[i].pageY
        });
    }
});

// Finds the array index of a touch in the touches array.
var findCurrentTouchIndex = function(id) {
    for (var i = 0; i < touches.length; i++) {
        if (touches[i].id === id) {
            return i;
        }
    }

    // Touch not found! Return -1.
    return -1;
};

window.addEventListener('touchend', function(e) {
    e.preventDefault(); // Prevent default touch behavior
    inactivityTimer = 0; // Reset timer on touch end
    var changedTouches = e.changedTouches;
    for (var i = 0; i < changedTouches.length; i++) {
        var touch = changedTouches[i];
        var currentTouchIndex = findCurrentTouchIndex(touch.identifier);

        if (currentTouchIndex >= 0) {
            // Remove the record.
            touches.splice(currentTouchIndex, 1);
        } else {
            console.log('Touch was not found!');
        }
    }
});

function resized() {
    alert("Reload the page to correct game screen size");
}

window.addEventListener("resize", resized);

// Inventory functions
function toggleInventory() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        cancelAnimationFrame(requestID); // Stop game loop
        drawInventory(); // Draw inventory
    } else {
        requestID = requestAnimationFrame(update); // Resume game loop
    }
}

function drawInventory() {
    ctx.save();
    // Dark overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, width, height);

    // Inventory panel
    ctx.fillStyle = "darkgrey";
    const panelWidth = 220;
    const panelHeight = player.inventory.length * 30 + 100; // Dynamic height based on items
    const panelX = (width - panelWidth) / 2;
    const panelY = (height - panelHeight) / 2;
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);


    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText("Inventory", width / 2, panelY + 10);

    ctx.font = "14px Arial";
    ctx.textAlign = 'left';
    // List items
    const itemStartX = panelX + 10;
    let itemY = panelY + 50;
    player.inventory.forEach((item, index) => {
        ctx.fillStyle = "grey";
        ctx.fillRect(itemStartX, itemY, panelWidth - 20, 25);
        ctx.fillStyle = "white";
        let itemText = `${item.icon} ${item.name}`;
        if (item.properties.rarity) {
            itemText += ` (${item.properties.rarity})`;
        }
        ctx.fillText(itemText, itemStartX + 5, itemY + 5);
        if (player.handItem === item) {
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 2;
            ctx.strokeRect(itemStartX, itemY, panelWidth - 20, 25);
        }
        itemY += 30;
    });

    ctx.fillText("Press 'I' to close", width / 2, panelY + panelHeight - 30);
    ctx.restore();
}

function pauseLoop() {
    // If the game is paused, we just redraw the inventory until 'I' is pressed again
    if (gamePaused) {
        drawInventory();
        requestID = requestAnimationFrame(pauseLoop);
    } else {
        // This case should be handled by toggleInventory() setting gamePaused to false
        // and then requesting update frame.
    }
}
