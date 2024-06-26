// main js

// VARIABLES

const pixelGrid = document.getElementById("pixel-grid");
const gridSizeSlider = document.getElementById("grid-size-slider");
const gridSizeLabel = document.getElementById("grid-size-label");
const undobutton = document.getElementById("undo-btn");
const redoButton = document.getElementById("redo-btn");
const fillButton = document.getElementById("filltool-btn");
const toolsheader = document.getElementById("tools-header")
const gallerywarningTXT = document.getElementById("gallerywarning-text")
const colorPickerWindow = document.querySelector(".brush-tool-window");
const settingsWindow = document.querySelector(".settings-window");
const brushToolButton = document.getElementById("brushtool-btn");
const eraseToolButton = document.getElementById("erasetool-btn");
const settingsButton = document.getElementById("settings-btn");
const galleryBtn = document.getElementById("gallery-btn");
const closeGalleryBtn = document.getElementById("close-gallery-btn");
const galleryContainer = document.getElementById("gallery-container");
const saveImgBtn = document.getElementById("saveimg-btn");
const galleryContent = document.querySelector(".gallery-scrollbox");
const userLanguage = navigator.language || navigator.userLanguage;
const supportedLanguages = ["en", "de", "fr", "es"];
const defaultLanguage = "en";
const userLanguageCode = userLanguage.split("-")[0];
const languageToUse = supportedLanguages.includes(userLanguageCode) ? userLanguageCode : defaultLanguage;
const drawHistory = [];
const redoHistory = [];
let currentState = pixelGrid.innerHTML;
let currentPixels = [];
let isErasing = false;
let selectedButton = null;
let isDrawing = true;
let selectedColor = "#555555";
let gridSize = 20;
let brushToolActive = true;
let isSettingsActive = false;
let toolSwitchingInProgress = false;
let colorPickerCloseTimer = null;
let settingsTimeout = null;
let saves = [];


// CODE

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loadLanguageResources();

    setTimeout(() => {
        loader.classList.add("loader-hidden");
    }, 550)

    loader.addEventListener("transitionend", () => {
        loader.remove("loader");
    })
})

document.getElementById("brushtool-btn").classList.add("active");
pixelGrid.style.cursor = "crosshair";

document.getElementById("color-picker").addEventListener("input", (e) => {
    selectedColor = e.target.value;
}); 

pixelGrid.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
        isDrawing = true;
        drawPixel(e);
    }
    saveDrawHistory();
});

pixelGrid.addEventListener("mouseup", () => {
    isDrawing = false;
    saveDrawHistory();
});

pixelGrid.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        drawPixel(e);
    }
});

document.getElementById("brushtool-btn").addEventListener("click", () => {
    isErasing = false;
    pixelGrid.style.cursor = "crosshair";
    if (selectedButton) {
        selectedButton.classList.remove("active");
    }
    document.getElementById("brushtool-btn").classList.add("active");
    selectedButton = document.getElementById("brushtool-btn");
});

document.getElementById("erasetool-btn").addEventListener("click", () => {
    isErasing = true;
    pixelGrid.style.cursor = "crosshair";
    if (selectedButton) {
        selectedButton.classList.remove("active");
    }
    document.getElementById("erasetool-btn").classList.add("active");
    selectedButton = document.getElementById("erasetool-btn");
    document.getElementById("brushtool-btn").classList.remove("active");
    saveDrawHistory();
});

document.getElementById("clear-btn").addEventListener("click", () => {
    const pixels = document.querySelectorAll(".pixel");
    pixels.forEach((pixel) => (pixel.style.backgroundColor = "transparent"));
});

pixelGrid.addEventListener("mouseleave", () => {
    isDrawing = false;
    saveDrawHistory();
});

function drawPixelOnMove(e) {
    e.preventDefault();
    const touches = e.touches || e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const pixel = document.elementFromPoint(touch.clientX, touch.clientY);
        if (pixel && pixel.classList.contains("pixel")) {
            if (isErasing) {
                pixel.style.backgroundColor = "transparent";
            } else {
                pixel.style.backgroundColor = selectedColor;
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
                pixel.style.backgroundColor = "transparent";
            } else {
                pixel.style.backgroundColor = selectedColor;
            }
        }
    }
    pixelGrid.addEventListener("touchmove", drawPixelOnMove);
});

pixelGrid.addEventListener("touchend", (e) => {
    pixelGrid.removeEventListener("touchmove", drawPixelOnMove);
    saveDrawHistory();
});


function updatePixelGrid() {
    const pixelCount = gridSize * gridSize;
    pixelGrid.innerHTML = "";
    pixelGrid.style.gridTemplateColumns = `repeat(${gridSize}, 25px)`;
    pixelGrid.style.gridTemplateRows = `repeat(${gridSize}, 25px)`;

    for (let i = 0; i < pixelCount; i++) {
        const pixel = document.createElement("div");
        pixel.className = "pixel";
        pixelGrid.appendChild(pixel);
    }
}

function updateGridSize() {
    gridSize = parseInt(gridSizeSlider.value);
    updatePixelGrid();
    updateGridSizeLabel();
}

function updateGridSizeLabel() {
    gridSizeLabel.textContent = gridSize + " x " + gridSize;
}

gridSizeSlider.addEventListener("input", updateGridSize);

updateGridSize();

function drawPixel(e) {
    const pixel = e.target;
    if (pixel.classList.contains("pixel") && e.buttons === 1) {
        const isErasing = document.getElementById("erasetool-btn").classList.contains("active");
        const pixelColor = isErasing ? "transparent" : selectedColor;

        pixel.style.backgroundColor = pixelColor;
        saveDrawHistory();
    }
}

gridSizeSlider.addEventListener("input", () => {

    gridSize = parseInt(gridSizeSlider.value);
    updatePixelGrid();
    updateGridSizeLabel();
    resetHistory();
});

undobutton.addEventListener("click", undoDraw);
redoButton.addEventListener("click", redoDraw);

function savePixelState() {
    const pixels = document.querySelectorAll('.pixel');
    const pixelData = Array.from(pixels, pixel => ({
        backgroundColor: pixel.style.backgroundColor
    }));
    currentPixels.push(pixelData);
}

savePixelState();

function saveDrawHistory() {
    const pixels = document.querySelectorAll('.pixel');
    const pixelData = Array.from(pixels, pixel => ({
        backgroundColor: pixel.style.backgroundColor
    }));

    const lastState = currentPixels[currentPixels.length - 1];
    if (JSON.stringify(lastState) !== JSON.stringify(pixelData)) {
        savePixelState();
    }
}

function resetToState(state) {
    if (state) {
        pixelGrid.innerHTML = state;
    }
}

function saveCurrentState() {
    currentState = pixelGrid.innerHTML;
}

function redoDraw() {
    if (redoHistory.length > 0) {
        const redoState = redoHistory.pop();
        currentPixels.push(redoState);

        const pixels = document.querySelectorAll('.pixel');
        pixels.forEach((pixel, index) => {
            pixel.style.backgroundColor = redoState[index].backgroundColor;
        });
    }
}

function undoDraw() {
    if (currentPixels.length > 1) {
        redoHistory.push(currentPixels.pop());
        const lastState = currentPixels[currentPixels.length - 1];

        const pixels = document.querySelectorAll('.pixel');
        pixels.forEach((pixel, index) => {
            pixel.style.backgroundColor = lastState[index].backgroundColor;
        });
    }
}

function resetHistory() {
    drawHistory.length = 0;
    redoHistory.length = 0;

    savePixelState();
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undoDraw();
    } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redoDraw();
    }
});

colorPickerWindow.style.display = "block";
colorPickerWindow.style.opacity = 1;
colorPickerWindow.style.transform = "translateX(0)";

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

settingsButton.addEventListener("click", () => {
    isSettingsActive = !isSettingsActive;

    if (isSettingsActive) {
        showSettingsWindow();
    } else {
        hideSettingsWindow();
    }
});

function showSettingsWindow() {
    clearTimeout(settingsTimeout);
    settingsWindow.style.display = "block";
    requestAnimationFrame(() => {
        settingsWindow.style.opacity = 1;
        settingsWindow.style.transform = "translateX(0)";
    });
}

function hideSettingsWindow() {
    settingsWindow.style.opacity = 0;
    settingsWindow.style.transform = "translateX(-10px)";
    settingsTimeout = setTimeout(() => {
        settingsWindow.style.display = "none";
    }, 300);
}

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

galleryBtn.addEventListener("click", openGallery);
closeGalleryBtn.addEventListener("click", closeGallery);

function openGallery() {
    if (galleryContainer) {
        galleryContainer.style.opacity = "1";
        document.querySelector(".sidebar").style.transform = "translateX(-300%)";
        galleryContainer.classList.add("open");

        const hasLinks = saves.length > 0;

        if (hasLinks) {
            const emptyText = galleryContent.querySelector("p");
            if (emptyText) {
                emptyText.remove();
            }
        } else {
            const existingEmptyText = galleryContent.querySelector("p");
            if (!existingEmptyText) {
                const emptyText = document.createElement("p");
                emptyText.textContent = languageData["galleryemptyTXT"];
                emptyText.setAttribute("data-translate", "galleryemptyTXT");
                galleryContent.appendChild(emptyText);
            }
        }
    }
}

function closeGallery() {
    if (galleryContainer) {
        galleryContainer.style.opacity = "0";
        document.querySelector(".sidebar").style.transform = "translateX(0)";
        galleryContainer.classList.remove("open");
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const savedCanvas = localStorage.getItem("savedCanvas");
    if (savedCanvas) {
        saves = JSON.parse(savedCanvas);
        updateGalleryLinks();
    }

    if (languageToUse === "de") {
        gallerywarningTXT.href = "https://de.wikipedia.org/wiki/Web_Storage";
    } else {
        gallerywarningTXT.href = "https://en.wikipedia.org/wiki/Web_storage";
    }
});

function updateGalleryLinks() {
    saves.forEach((save, index) => {
        const link = document.createElement('saveslot');
        link.textContent = `${save.timestamp}`;
        link.addEventListener('click', () => {
            loadCanvas(save);
            closeGallery();
        });

        const existingLinks = galleryContent.querySelectorAll('a');
        const isLinkExists = Array.from(existingLinks).some(existingLink => existingLink.textContent === link.textContent);

        if (!isLinkExists) {
            galleryContent.appendChild(link);
        }
    });
}

function generateImageIdentifier() {
    const pixels = document.querySelectorAll('.pixel');
    const pixelData = Array.from(pixels, pixel => ({
        backgroundColor: pixel.style.backgroundColor
    }));

    return JSON.stringify(pixelData);
}

function isImageIdentical() {
    const currentImageIdentifier = generateImageIdentifier();

    for (const save of saves) {
        const savedImageIdentifier = JSON.stringify(save.pixels);

        if (currentImageIdentifier === savedImageIdentifier) {
            if (languageToUse === "en") {
                alert("This artwork has already been saved identically in your gallery!");
                return true;
            }
            if (languageToUse === "de") {
                alert("Dieses Kunstwerk befindet sich bereits identisch in der Galerie!");
                return true;
            }
            if (languageToUse === "fr") {
                alert("Cette œuvre est déjà enregistrée à l'identique dans votre galerie!");
                return true;
            }
            if (languageToUse === "es") {
                alert("Esta obra ya está almacenada de forma idéntica en su galería!");
                return true;
            }
        }
    }
    return false;
}

saveImgBtn.addEventListener("click", () => {
    if (!isImageIdentical()) {
        saveCanvas();
    }
});

function saveCanvas() {
    const pixels = document.querySelectorAll('.pixel');
    const pixelCount = pixels.length;

    let hasPaintedPixel = false;

    pixels.forEach(pixel => {
        if (pixel.style.backgroundColor && pixel.style.backgroundColor !== "transparent") {
            hasPaintedPixel = true;
            return;
        }
    });

    if (!hasPaintedPixel) {
        if (languageToUse === "de") {
            alert("Leere Kunstwerke können nicht abgespeichert werden!");
            return;
        } if (languageToUse === "en") {
            alert("Empty artworks cannot be saved!");
            return;
        } if (languageToUse === "fr") {
            alert("Les œuvres d'art vides ne peuvent pas être sauvegardées!");
            return;
        }
        if (languageToUse === "es") {
            alert("Las obras vacías no pueden salvar!");
            return;
        }
    }

    const currentGridSize = gridSize;

    const pixelData = Array.from(pixels, pixel => ({
        backgroundColor: pixel.style.backgroundColor
    }));

    function getFormattedTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const formattedHours = (now.getHours() % 12 || 12);
        const amPm = now.getHours() >= 12 ? 'PM' : 'AM';

        if (languageToUse === "de") {
            return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds} Uhr`;
        } else {
            return `${formattedHours}:${minutes}:${seconds} ${amPm}, ${day}/${month}/${year}`;
        }
    }
    
    const timestamp = getFormattedTimestamp();    

    const newSave = {
        timestamp: timestamp,
        gridSize: currentGridSize,
        pixels: pixelData
    };

    saves.push(newSave);

    localStorage.setItem("savedCanvas", JSON.stringify(saves));

    updateGalleryLinks();
}


function loadCanvas(save) {
    if (save) {
        if (save.gridSize) {
            gridSize = save.gridSize;
            updatePixelGrid();
            gridSizeSlider.value = gridSize;
            updateGridSizeLabel();
        }

        if (save.pixels) {
            const pixels = document.querySelectorAll('.pixel');

            pixels.forEach((pixel, index) => {
                pixel.style.backgroundColor = save.pixels[index].backgroundColor;
            });

            savePixelState();
        }
    }
}

function closeGallery() {
    if (galleryContainer) {
        galleryContainer.style.opacity = "0";
        document.querySelector(".sidebar").style.transform = "translateX(0)";
        galleryContainer.classList.remove("open");
    }
}

document.documentElement.lang = languageToUse;

function loadLanguageResources() {
    const scriptElement = document.createElement("script");
    scriptElement.src = `lang_${languageToUse}.js`;
    document.head.appendChild(scriptElement);

    scriptElement.onload = () => {
        applyTranslations(languageData);
    };
}

function applyTranslations(data) {
    Object.keys(data).forEach((key) => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach((element) => {
            element.innerHTML = data[key];
        });
    });
}

if (languageToUse == "de") {
    saveImgBtn.style.padding = "8px 6px 8px 6px";
}

if (languageToUse == "fr") {
    saveImgBtn.style.padding = "13px 7px";
}

if (languageToUse == "de") {
    toolsheader.style.fontSize = "22px";
}

if (languageToUse == "es") {
    saveImgBtn.style.padding = "10px";
    toolsheader.style.fontSize = "20px";
}

var webstatus = document.body.getAttribute('state');

if (webstatus === 'maintenance') {
    window.location.href = '../503/index.html';
} else if (webstatus !== 'normal') {
    window.location.href = '../404/index.html';
}