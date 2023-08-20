// Grab the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const MAX_ASTEROIDS = 5;

// Initialize game variables
let score = 0;
let asteroids = [];
let bullets = [];
let ship;
let lastAsteroidTime = 0;

let stars = [];

function initializeStars() {
    stars = [];
    const NUM_STARS = 100; // Number of stars

    for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 0.5 + 0.1, // Random speed
        });
    }
}

// Call the function to initialize the stars
initializeStars();



// Ship object
ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: -Math.PI / 2, // Point upwards
    speed: 0,
    // ... other properties as needed
};

// Asteroids array
for (let i = 0; i < MAX_ASTEROIDS; i++) {
    asteroids.push(createAsteroid());
}



// Bullets array

bullets = [];

let keys = {
    up: false,
    left: false,
    right: false
};

window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'w':
        case 'ArrowUp':
            keys.up = true;
            break;
        case 'a':
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'd':
        case 'ArrowRight':
            keys.right = true;
            break;
    }
});

window.addEventListener('keyup', function (event) {
    switch (event.key) {
        case 'w':
        case 'ArrowUp':
            keys.up = false;
            break;
        case 'a':
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'd':
        case 'ArrowRight':
            keys.right = false;
            break;
    }
});

window.addEventListener('keydown', function (event) {
    if (event.key === ' ' || event.key === 'Spacebar') {
        fireBullet();
    }
});
window.addEventListener('resize', setCanvasSize);
window.addEventListener('resize', () => {
    // Update the canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reinitialize the stars
    initializeStars();
});

// TODO: Define the ship object and its properties
// TODO: Define the asteroid object and its properties
// TODO: Define the bullet object and its properties

// Main game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw the ship
    updateShip();
    drawShip();
	
	updateStars();
    drawStars();

    // Update and draw the asteroids
    updateAsteroids();
    drawAsteroids();
	
	 // Check the time and add an asteroid if needed
    if (Date.now() - lastAsteroidTime > 20000 && asteroids.length < MAX_ASTEROIDS) {
        addAsteroid();
        lastAsteroidTime = Date.now(); // Update the last asteroid time
    }
	

    // Update and draw the bullets
    updateBullets();
    drawBullets();

checkBulletAsteroidCollisions();
checkShipAsteroidCollisions();
    // TODO: Handle collisions
    // TODO: Update the score

    // Request the next animation frame
    requestAnimationFrame(gameLoop);
}

function updateStars() {
    stars.forEach(star => {
        star.x -= star.speed; // Move the star to the left

        // Wrap around the screen if the star goes off the left edge
        if (star.x < 0) {
            star.x += canvas.width;
        }
    });
}
function drawStars() {
    ctx.fillStyle = '#FFF'; // Set the fill color to white

    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1, 0, Math.PI * 2); // Draw a small circle as a star
        ctx.closePath();
        ctx.fill();
    });
}



function addAsteroid() {
    asteroids.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 50, // Size in pixels
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 1,
        // ... other properties as needed
    });
}

function checkShipAsteroidCollisions() {
    asteroids.forEach(asteroid => {
        const dx = ship.x - asteroid.x;
        const dy = ship.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < asteroid.size / 2 + 10) { // 10 is half the ship's size
            // Collision detected
            // Handle game over or reduce lives, etc.
            console.log("Ship collided with an asteroid!");
        }
    });
}

function checkBulletAsteroidCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        asteroids.forEach((asteroid, asteroidIndex) => {
            const dx = bullet.x - asteroid.x;
            const dy = bullet.y - asteroid.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < asteroid.size / 2) {
                // Collision detected

                // Remove the bullet
                bullets.splice(bulletIndex, 1);

                // Break the asteroid into smaller pieces or remove it
                if (asteroid.size > 40) { // Minimum size for breaking
                    for (let i = 0; i < 2; i++) { // Create two smaller bugs
                        asteroids.push({
                            x: asteroid.x,
                            y: asteroid.y,
                            size: asteroid.size / 2,
                            angle: Math.random() * Math.PI * 2,
                            speed: Math.random() * 2 + 1,
                            rotation: Math.random() * Math.PI * 2,
                            rotationSpeed: (Math.random() - 0.5) * 0.1,
                            color: asteroid.color, // Same color as the original asteroid
                            legAngle: Math.random() * Math.PI,
                            legSpeed: Math.random() * 0.1 + 0.05
                        });
                    }
                }

                // Remove the original asteroid
                asteroids.splice(asteroidIndex, 1);

                // Increment the score
                score += 10;
            }
        });
    });
}


function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Function to fire a bullet
function fireBullet() {
    bullets.push({
        x: ship.x,
        y: ship.y,
        angle: ship.angle,
        speed: 5,
    });
}

// Function to draw the bullets
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.save();
        ctx.translate(bullet.x, bullet.y);
        ctx.rotate(bullet.angle);
        ctx.fillStyle = '#FF0000'; // Bright red color
        ctx.shadowColor = '#FF0000'; // Shadow color
        ctx.shadowBlur = 5; // Shadow blur effect
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2); // Larger circle for the bullet
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    });
}



function updateBullets() {
    // Iterate through bullets and update their position
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.speed * Math.cos(bullet.angle);
        bullet.y += bullet.speed * Math.sin(bullet.angle);

        // Remove bullets that are off the screen
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });
}


// Function to create a new asteroid (bug)
function createAsteroid() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 60 + 40, // Size in pixels (20 to 50)
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 1,
        rotation: Math.random() * Math.PI * 2, // Rotation angle for the bug
        rotationSpeed: (Math.random() - 0.5) * 0.05, // Rotation speed (negative or positive)
        color: getRandomColor(), // Random color for the bug
        legAngle: Math.random() * Math.PI, // Angle for wiggling legs
        legSpeed: Math.random() * 0.05 + 0.02 // Speed for wiggling legs
    };
}

// Function to generate a random color
function getRandomColor() {
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
    return colors[Math.floor(Math.random() * colors.length)];
}



// Function to draw the asteroids
// Function to draw the asteroids (bugs)
function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        ctx.fillStyle = asteroid.color; // Use the bug's color
        ctx.beginPath();

        // Draw the body (ellipse)
        ctx.ellipse(0, 0, asteroid.size / 3, asteroid.size / 4, 0, 0, Math.PI * 2);
        ctx.fill(); // Fill the body

        ctx.lineWidth = 2; // Increase the stroke thickness for legs
        ctx.strokeStyle = asteroid.color; // Use the same color for legs
        // Draw legs (wiggling)
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i + asteroid.legAngle;
            const length = asteroid.size / 2; // Increase the length of the legs
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    });
}

// Function to generate a random color with softer tones
function getRandomColor() {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return `rgb(${r}, ${g}, ${b})`;
}






// Function to update the asteroids' movement
function updateAsteroids() {
    asteroids.forEach(asteroid => {
        // Update the x and y positions based on the speed and angle
        asteroid.x += asteroid.speed * Math.cos(asteroid.angle);
        asteroid.y += asteroid.speed * Math.sin(asteroid.angle);

        // Handle screen wrapping for asteroids
        if (asteroid.x < 0) asteroid.x += canvas.width;
        if (asteroid.x > canvas.width) asteroid.x -= canvas.width;
        if (asteroid.y < 0) asteroid.y += canvas.height;
        if (asteroid.y > canvas.height) asteroid.y -= canvas.height;
		
		// Update leg angle for wiggling effect
        asteroid.legAngle += asteroid.legSpeed;
        if (asteroid.legAngle > Math.PI * 2) {
            asteroid.legAngle -= Math.PI * 2;
        }
		
		asteroid.rotation += asteroid.rotationSpeed;
    });
}


// Function to draw the ship
function drawShip() {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.strokeStyle = '#00FF00'; // Bright green color
    ctx.lineWidth = 2; // Thicker line
    ctx.shadowColor = '#00FF00'; // Shadow color
    ctx.shadowBlur = 10; // Shadow blur effect
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-10, -7);
    ctx.lineTo(-10, 7);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}


// Function to update the ship's movement
function updateShip() {
    // TODO: Update the ship's position based on its speed and angle
    // TODO: Handle user input for movement and turning
	    if (keys.up) {
        // Thrust forward
        ship.speed += 0.05;
    }

    if (keys.left) {
        // Rotate left
        ship.angle -= 0.05;
    }

    if (keys.right) {
        // Rotate right
        ship.angle += 0.05;
    }

    // Update position based on speed and angle
    ship.x += ship.speed * Math.cos(ship.angle);
    ship.y += ship.speed * Math.sin(ship.angle);

    // Implement friction (optional)
    ship.speed *= 0.99;

    // Handle screen wrapping
    if (ship.x < 0) ship.x += canvas.width;
    if (ship.x > canvas.width) ship.x -= canvas.width;
    if (ship.y < 0) ship.y += canvas.height;
    if (ship.y > canvas.height) ship.y -= canvas.height;
}

// Start the game loop
setCanvasSize();
initializeStars();
gameLoop();

