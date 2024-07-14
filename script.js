// Global variable to track current theme
let isDarkMode = false;

// Function to set theme based on time of day or manual toggle
const setTheme = (darkMode) => {
    isDarkMode = darkMode;
    document.body.style.backgroundColor = isDarkMode ? '#3B3C36' : '#F0EEE4';
    document.body.style.color = isDarkMode ? '#F0EEE4' : '#3B3C36';
    // Update button text
    document.querySelector("#themeToggle").textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

// Function to toggle theme manually
const toggleTheme = () => {
    setTheme(!isDarkMode);
}

// Function to set initial theme based on time of day
const setInitialTheme = () => {
    const hour = new Date().getHours();
    setTheme(hour < 7 || hour >= 19);
}

// Set initial theme on page load
window.addEventListener('load', setInitialTheme);

// Event listener for theme toggle button
document.querySelector("#themeToggle").addEventListener("click", toggleTheme);

// Function to fetch images from Unsplash API
const fetchImages = () => {
    const query = document.querySelector("#input").value;
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=9&client_id=SouHY7Uul-OxoMl3LL3c0NkxUtjIrKwf3tsGk1JaiVo`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(loadImages)
        .catch(error => console.log(error));
}

// Function to load images into the grid
const loadImages = (data) => {
    const grid = document.querySelector("#grid");
    grid.innerHTML = "";

    data.results.forEach(result => {
        const image = document.createElement("div");
        image.className = "img";
        image.style.backgroundImage = `url(${result.urls.raw}&w=1366&h=768)`;
        image.addEventListener("dblclick", () => window.open(result.links.download, '_blank'));
        image.addEventListener("click", () => showFullImage(result.urls.full, result.links.download));
        grid.appendChild(image);
    });
}

// Function to display full-size image
const showFullImage = (url, downloadLink) => {
    const fullImageBox = document.getElementById("full-imageBox");
    const fullImage = document.getElementById("full-image");
    const downloadButton = document.getElementById("downloadButton");
    
    fullImage.src = url;
    fullImageBox.style.display = "flex";
    
    downloadButton.onclick = () => {
        let filename = prompt("Enter a name for your image:", "unsplash_image");
        if (!filename) return;
        if (!filename.toLowerCase().endsWith('.jpg')) filename += '.jpg';
        
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
                URL.revokeObjectURL(link.href);
            })
            .catch(error => {
                console.error('Error downloading image:', error);
                alert('Error downloading image. Please try again.');
            });
    };
}

// Function to close full-size image view
const closeFullImg = () => {
    document.getElementById("full-imageBox").style.display = "none";
}

// Event listeners for search functionality
document.querySelector("#input").addEventListener("keydown", event => {
    if (event.key === "Enter") fetchImages();
});
document.querySelector("#search").addEventListener("click", fetchImages);