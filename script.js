// Get the canvas element
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Global 2D array to store pixel data
let pixelArray;

// Function to resize the canvas to fill the window and initialize the pixel array
function resizeCanvas() {
    canvas.width = Math.floor(256);
    canvas.height = Math.floor(window.innerHeight/window.innerWidth * 256);

    // Initialize the 2D array with the size of the canvas
    pixelArray = new Array(canvas.height).fill(null).map(() => new Array(canvas.width).fill([0, 0, 0, 255]));
}

// Variable to track if the mouse button is pressed
let isMouseDown = false;
let mouse_x = 0;
let mouse_y = 0;

// Mouse down event handler
function onMouseDown(event) {
    isMouseDown = true;
    updateMousePosition(event);
    //setPixel(mouse_x, mouse_y, [
    //    Math.floor(Math.random() * 256),
    //    Math.floor(Math.random() * 256),
    //    Math.floor(Math.random() * 256),
    //    255
    //]); // Set the pixel to random color
    setPixel(mouse_x, mouse_y, [255, 255, 255, 255]);
    drawPixels(); // Redraw the canvas
}

// Mouse up event handler
function onMouseUp(event) {
    isMouseDown = false;
}

// Mouse move event handler
function onMouseMove(event) {
    if (true) {
        updateMousePosition(event);
        setPixel(mouse_x, mouse_y, [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            255
        ]); // Set the pixel to random color
        drawPixels(); // Redraw the canvas
    }
}

// Function to update mouse position relative to canvas resolution
function updateMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    mouse_x = Math.floor((event.clientX - rect.left) / rect.width * canvas.width);
    mouse_y = Math.floor((event.clientY - rect.top) / rect.height * canvas.height);
}

// Function to set a pixel at a specific position
function setPixel(x, y, color) {
    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        // Only set the pixel if it is currently black
        if (pixelArray[y][x][0] === 0 && pixelArray[y][x][1] === 0 && pixelArray[y][x][2] === 0) {
            pixelArray[y][x] = color;
        }
    }
}

// Function to get the color of a random neighbor
function getColorOfRandNeighbor(x, y, max_x, max_y) {
    let color = [0, 0, 0, 255];
    const neighbors = [];

    for (let c = x - 1; c <= x + 1; c++) {
        for (let r = y - 1; r <= y + 1; r++) {
            if ((c == x && r == y) || (r < 0 || c < 0) || (r >= max_y || c >= max_x)) {
                continue;
            }
            neighbors.push(pixelArray[r][c]);
        }
    }

    if (neighbors.length > 0) {
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        if (randomNeighbor[0] != 0 || randomNeighbor[1] != 0 || randomNeighbor[2] != 0) {
            color = randomNeighbor;
        }
    }

    return color;
}

// Function to draw pixels from the pixel array to the canvas
function drawPixels() {
    const width = canvas.width;
    const height = canvas.height;
    const jaggedness = 3;
    const fade_speed = 2; // Example fade speed
    const flip_chance = 0; // in percentages

    // Create an ImageData object
    const imageData = ctx.createImageData(width, height);

    // Create a new pixel array to store the next state
    const newPixelArray = pixelArray.map(row => row.slice());

    // Run the algorithm on the pixels
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let color = pixelArray[y][x];
            let to_mutate = Math.floor(Math.random() * jaggedness);

            if (color[0] == 0 && color[1] == 0 && color[2] == 0 && to_mutate == 0) {
                color = getColorOfRandNeighbor(x, y, width, height);
                let red_dec = Math.floor(Math.random() * fade_speed);
                let green_dec = Math.floor(Math.random() * fade_speed);
                let blue_dec = Math.floor(Math.random() * fade_speed);

                // SECTION: MORE RANDOMIZATION. CAN DELETE.
                let red_flip = Math.floor(Math.random() * 100);
                let green_flip = Math.floor(Math.random() * 100);
                let blue_flip = Math.floor(Math.random() * 100);
                if (red_flip < flip_chance) {
                    red_dec *= -1;
                }
                if (green_flip < flip_chance) {
                    green_dec *= -1;
                }
                if (blue_flip < flip_chance) {
                    blue_dec *= -1;
                }
                // END OF SECTION
                

                color[0] = Math.max(0, Math.min(255, color[0] - red_dec));
                color[1] = Math.max(0, Math.min(255, color[1] - green_dec));
                color[2] = Math.max(0, Math.min(255, color[2] - blue_dec));
            }

            newPixelArray[y][x] = color;
        }
    }

    // Update the global pixelArray with the new state
    pixelArray = newPixelArray;

    // Set pixels from the pixel array
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const pixel = pixelArray[y][x];
            imageData.data[index] = pixel[0]; // RED 
            imageData.data[index + 1] = pixel[1]; // GREEN
            imageData.data[index + 2] = pixel[2]; // BLUE
            imageData.data[index + 3] = pixel[3]; // ALPHA
        }
    }

    // Put the ImageData object onto the canvas
    ctx.putImageData(imageData, 0, 0);
}

// Animation loop
function animate() {
    drawPixels();
    requestAnimationFrame(animate);
}

// Initialize the canvas size and start the animation loop
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mousemove', onMouseMove);

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('myCanvas');
    const overlayPanel = document.querySelector('.overlay-panel');

    const forwardEvent = (event) => {
        const canvasEvent = new event.constructor(event.type, event);
        canvas.dispatchEvent(canvasEvent);
    };

    overlayPanel.addEventListener('mousedown', forwardEvent);
    overlayPanel.addEventListener('mouseup', forwardEvent);
    overlayPanel.addEventListener('mousemove', forwardEvent);
    overlayPanel.addEventListener('click', forwardEvent);
});

document.addEventListener('DOMContentLoaded', () => {
    const mainSection = document.getElementById('main-section');

    // Add event listener to focus main-section when enter button is clicked
    const enterButton = document.getElementById('enter-button');
    enterButton.addEventListener('click', () => {
        mainSection.focus();
    });

    // Add event listener to main-section to handle mouse wheel scrolling
    mainSection.addEventListener('wheel', (event) => {
        event.preventDefault(); // Prevent default scrolling behavior
        mainSection.scrollTop += event.deltaY; // Scroll main-section vertically
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const enterButton = document.getElementById('enter-button');
    const container = document.querySelector('.container');
    const overlay_panel = document.querySelector('.overlay-panel');
    const mainSection = document.getElementById('main-section');

    enterButton.addEventListener('click', () => {
        // Change the container height
        setTimeout(() => {
            container.style.width = '60%';
            container.style.left = '20%';
        }, 300); // This should match the duration of the opacity transition
        setTimeout(() => {
            container.style.height = '102%';
            container.style.top = '-2%';
        }, 1300); // This should match the duration of the opacity transition
        // Fade out the enter button
        enterButton.classList.add('hidden');
        overlay_panel.classList.add('no-hover');
        // Hide the button after the fade out transition
        setTimeout(() => {
            enterButton.style.display = 'none';
        }, 1000); // This should match the duration of the opacity transition
        // Fade in the main section after the container has expanded
        setTimeout(() => {
            mainSection.classList.add('active');
            mainSection.style.pointerEvents = 'auto';
            mainSection.addEventListener('mousemove', onMouseMove);
        }, 2300); // Delay to match the height transition
    });
});


requestAnimationFrame(animate);
