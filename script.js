const pixelGrid = document.getElementById("pixel-grid");
let isErasing = false;
let selectedButton = null;
let isDrawing = true;
let selectedColor = "black";

document.getElementById("add-pixel").classList.add("active");
pixelGrid.style.cursor = "crosshair";

document.getElementById("color-picker").addEventListener("input", (e) => {
    selectedColor = e.target.value;
});

pixelGrid.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
        isDrawing = true;
        drawPixel(e);
    }
});

pixelGrid.addEventListener("mouseup", () => {
    isDrawing = false;
});

pixelGrid.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        drawPixel(e);
    }
});

document.getElementById("add-pixel").addEventListener("click", () => {
    isErasing = false;
    pixelGrid.style.cursor = "crosshair";
    if (selectedButton) {
        selectedButton.classList.remove("active");
    }
    document.getElementById("add-pixel").classList.add("active");
    selectedButton = document.getElementById("add-pixel");
});

document.getElementById("erase-pixel").addEventListener("click", () => {
    isErasing = true;
    pixelGrid.style.cursor = "not-allowed";
    if (selectedButton) {
        selectedButton.classList.remove("active");
    }
    document.getElementById("erase-pixel").classList.add("active");
    selectedButton = document.getElementById("erase-pixel");
    // Entfernen Sie die "active" Klasse sofort, wenn der "Erase" Button geklickt wird.
    document.getElementById("add-pixel").classList.remove("active");
});

document.getElementById("clear").addEventListener("click", () => {
    const pixels = document.querySelectorAll(".pixel");
    pixels.forEach((pixel) => (pixel.style.backgroundColor = "transparent"));
});

pixelGrid.addEventListener("mouseleave", () => {
    isDrawing = false; // Stop drawing if the cursor leaves the grid area.
});

for (let i = 0; i < 400; i++) {
    const pixel = document.createElement("div");
    pixel.className = "pixel";
    pixelGrid.appendChild(pixel);
}

function drawPixel(e) {
    const pixel = e.target;
    if (pixel.classList.contains("pixel") && e.buttons === 1) {
        // Check if the left mouse button is still held down.
        pixel.style.backgroundColor = isErasing ? "transparent" : selectedColor;
    }
}