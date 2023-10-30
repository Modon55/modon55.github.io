const pixelGrid = document.getElementById("pixel-grid");
let isErasing = false;
let selectedButton = null;
let isDrawing = true;
let selectedColor = "#555555";
let touchIdentifier = null;

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
    pixelGrid.style.cursor = "crosshair";
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
    isDrawing = false;
});

function drawPixelOnMove(e) {
    e.preventDefault();
    const touches = e.touches;
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const pixel = document.elementFromPoint(touch.clientX, touch.clientY);
        if (pixel && pixel.classList.contains("pixel")) {
            if (isErasing) {
                pixel.style.backgroundColor = "transparent"; // Radiergummi-Modus
            } else {
                pixel.style.backgroundColor = selectedColor; // Malen-Modus
            }
        }
    }
}

pixelGrid.addEventListener("touchstart", (e) => {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const pixel = document.elementFromPoint(touch.clientX, touch.clientY);
        if (pixel && pixel.classList.contains("pixel")) {
            if (isErasing) {
                pixel.style.backgroundColor = "transparent"; // Radiergummi-Modus
            } else {
                pixel.style.backgroundColor = selectedColor; // Malen-Modus
            }
        }
    }
    pixelGrid.addEventListener("touchmove", drawPixelOnMove);
});

pixelGrid.addEventListener("touchend", (e) => {
    pixelGrid.removeEventListener("touchmove", drawPixelOnMove);
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

const colorPickerWindow = document.querySelector(".brush-tool-window");
const brushToolButton = document.getElementById("add-pixel");
const eraseToolButton = document.getElementById("erase-pixel");

let brushToolActive = true;

colorPickerWindow.style.display = "block";
colorPickerWindow.style.opacity = 1;
colorPickerWindow.style.transform = "translateX(0)";

let toolSwitchingInProgress = false;

let colorPickerCloseTimer = null;

brushToolButton.addEventListener("click", () => {
    if (!toolSwitchingInProgress) {
        if (!brushToolActive) {
            brushToolActive = true;
            clearTimeout(colorPickerCloseTimer);
            colorPickerWindow.style.display = "block";
            setTimeout(() => {
                colorPickerWindow.style.opacity = 1;
                colorPickerWindow.style.transform = "translateX(0)";
            }, 10);
        }
    }
});

eraseToolButton.addEventListener("click", () => {
    if (!toolSwitchingInProgress) {
        if (brushToolActive) {
            brushToolActive = false;
            colorPickerWindow.style.opacity = 0;
            colorPickerWindow.style.transform = "translateX(-10px)";
            clearTimeout(colorPickerCloseTimer);
            colorPickerCloseTimer = setTimeout(() => {
                colorPickerWindow.style.display = "none";
            }, 300);
        }
    }
});

brushToolButton.addEventListener("mouseover", () => {
    toolSwitchingInProgress = false;
});

eraseToolButton.addEventListener("mouseover", () => {
    toolSwitchingInProgress = false;
});

brushToolButton.addEventListener("mouseout", () => {
    toolSwitchingInProgress = true;
});

eraseToolButton.addEventListener("mouseout", () => {
    toolSwitchingInProgress = true;
});