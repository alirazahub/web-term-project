const searchIcon = document.getElementById('search-icon');
const closeIcon = document.getElementById('close-icon');
const searchInput = document.getElementById('search-input');

// Function to toggle search and close icons
function toggleIcons() {
    searchIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
}

// Toggle icons and focus on the input field
searchIcon.addEventListener('click', () => {
    toggleIcons();
    searchInput.classList.toggle('hidden');
    searchInput.classList.toggle('block');
    searchInput.focus();
});

// Toggle icons and hide the input field when clicking the close icon
closeIcon.addEventListener('click', () => {
    toggleIcons();
    searchInput.classList.toggle('hidden');
    searchInput.classList.toggle('block');
});

const dropdownToggle = document.querySelector('.group');

dropdownToggle.addEventListener('click', () => {
    const dropdownContent = dropdownToggle.querySelector('ul');
    dropdownContent.classList.toggle('hidden');
});

// Slider
$(document).ready(function(){
    $(".owl-carousel").owlCarousel({
        items: 4, // Number of items to display at a time
        loop: true, // Infinite loop
        margin: 20, // Space between items
        autoplayHoverPause: true,
        autoplay: true, // Autoplay
        autoplayTimeout: 3000, // Autoplay interval in milliseconds
        responsive: {
            0: {
                items: 1, // Number of items to display at a time
                nav: false // Hide navigation buttons
            },
            600: {
                items: 2, // Number of items to display at a time
                nav: false // Hide navigation buttons
            },
            1000: {
                items: 4, // Number of items to display at a time
                nav: false, // Hide navigation buttons
                loop: true // Infinite loop
            }
        }
    });
});
