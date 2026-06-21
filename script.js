// Clear your script.js completely and paste this clean code:
 // Initialize local storage arrays if they don't exist yet
if (!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));
if (!localStorage.getItem('wishlist')) localStorage.setItem('wishlist', JSON.stringify([]));

// 1. QUICKVIEW POPUP LOGIC
function showProduct(title, newPrice, oldPrice, description, imgSrc) {
    console.log("showProduct was found and executed!");
    
    // Set values
    const titleEl = document.getElementById('modalTitle');
    const newPriceEl = document.getElementById('modalNewPrice');
    const oldPriceEl = document.getElementById('modalOldPrice');
    const descEl = document.getElementById('modalDescription');
    const imgEl = document.getElementById('modalImage');

    if (titleEl) titleEl.innerText = title;
    if (newPriceEl) newPriceEl.innerText = newPrice;
    if (oldPriceEl) oldPriceEl.innerText = oldPrice;
    if (descEl) descEl.innerText = description;
    if (imgEl) imgEl.src = imgSrc; 

    // 2. FIND the Add to Cart button inside the modal structure
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
    
    if (modalAddToCartBtn) {
        // 3. DYNAMICALLY rewrite its onclick attribute with clean escaping!
        modalAddToCartBtn.setAttribute('onclick', `addToCart('${title.replace(/'/g, "\\'")}', '${newPrice}', '${imgSrc}')`);
    }

    // currentModalProduct = { title, price: newPrice, imgSrc };
}
// Run this immediately when the page loads to display any existing cart number
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadgeCount();
});

// 1. UPDATED CART LOGIC (No more alert text!)
function addToCart(title, price, imgSrc) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ title, price, imgSrc, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Refresh the navbar badge count automatically
    updateCartBadgeCount();
}

// Helper function to calculate total item quantities and update the HTML badge
function updateCartBadgeCount() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return; // Exit if badge doesn't exist on this page

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Add up all the individual quantities (e.g., 2 apples + 1 soda = 3 items total)
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    if (totalItems > 0) {
        badge.innerText = totalItems;
        badge.style.display = "inline-block"; // Show badge if cart has items
    } else {
        badge.style.display = "none"; // Keep it hidden if cart is empty
    }
}

// 2. UPDATED WISHLIST TOGGLE (Turns the icon solid red instantly)
function toggleWishlist(button, title, price, imgSrc) {
    // Look inside the clicked button to find the FontAwesome <i> icon tag
    const icon = button.querySelector('i');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const itemIndex = wishlist.findIndex(item => item.title === title);

    if (itemIndex === -1) {
        // Item isn't saved yet -> Add it
        wishlist.push({ title, price, imgSrc });
        
        // Swap FontAwesome regular class out for the solid filled class
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        
        // Force the color inline style to red
        button.style.color = '#dc3545'; 
    } else {
        // Item is already saved -> Remove it
        wishlist.splice(itemIndex, 1);
        
        // Swap it back to an empty outline heart style
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        
        // Reset the text color to your default theme color
        button.style.color = ''; 
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}
document.addEventListener("DOMContentLoaded", () => {
    updateNavbarUserIcon();
});

function updateNavbarUserIcon() {
    const userLink = document.getElementById('navbar-user-link');
    if (!userLink) return;

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');

    if (isLoggedIn === 'true' && username) {
        // Change icon to text bubble with user name
        userLink.innerHTML = `
            <div class="d-inline-flex align-items-center gap-1 border rounded-pill px-2 py-1 bg-light text-dark" style="font-size: 0.85rem;">
                <i class="fa-solid fa-circle-user text-success fs-5"></i>
                <span class="fw-bold me-1">${username}</span>
            </div>
        `;
    } else {
        // Fallback to standard clean user icon outline if logged out
        userLink.innerHTML = `<i class="fa-regular fa-user"></i>`;
    }
}

document.getElementById("searchInput")
.addEventListener("keyup", function() {

    let value = this.value.toLowerCase();

    document.querySelectorAll(".product-item")
    .forEach(product => {

        let name =
        product.dataset.name.toLowerCase();

        product.style.display =
        name.includes(value) ? "" : "none";

    });

});
let originalProducts = [];
let selectedCategory = "all";

document.addEventListener("DOMContentLoaded", () => {

    const container =
        document.getElementById("productContainer");

    originalProducts =
        Array.from(container.querySelectorAll(".product-item"));

});
document.querySelectorAll(".category-filter")
.forEach(item => {

    item.addEventListener("click", function(e){

        e.preventDefault();

        const selectedCategory =
            this.dataset.category;

        const selectedTitle =
            this.dataset.title;

        document.getElementById(
            "categoryTitle"
        ).innerText = selectedTitle;

        document.querySelectorAll(".product-item")
        .forEach(product => {

            const category =
                product.dataset.category;

            if (
                selectedCategory === "all" ||
                category === selectedCategory
            ) {
                product.style.display = "";
            } else {
                product.style.display = "none";
            }

        });

    }); 
});

document.getElementById("sortSelect")
.addEventListener("change", sortProducts);

function sortProducts() {

    const container =
        document.getElementById("productContainer");

    const allProducts =
        Array.from(container.querySelectorAll(".product-item"));

    const sortValue =
        document.getElementById("sortSelect").value;

    // STEP 1: FILTER (optional if you already use category)
    let result = allProducts.filter(product => {

        return selectedCategory === "all" ||
               product.dataset.category === selectedCategory;

    });

    // STEP 2: SORT
    if (sortValue === "low-high") {

        result.sort((a, b) =>
            parseFloat(a.dataset.price) -
            parseFloat(b.dataset.price)
        );

    }

    else if (sortValue === "high-low") {

        result.sort((a, b) =>
            parseFloat(b.dataset.price) -
            parseFloat(a.dataset.price)
        );

    }

    else if (sortValue === "rating") {

        result.sort((a, b) =>
            parseFloat(b.dataset.rating) -
            parseFloat(a.dataset.rating)
        );

    }

    else if (sortValue === "featured") {

        // original order
        result = originalProducts.filter(product =>
            selectedCategory === "all" ||
            product.dataset.category === selectedCategory
        );

    }

    // STEP 3: RE-RENDER
    container.innerHTML = "";

    result.forEach(product => {
        container.appendChild(product);
    });
}
function initMetroMallCountdown() {
    // 1. Set the countdown length (e.g., 2 days, 14 hours, 35 minutes from right now)
    // You can also hardcode a fixed date like: new Date("June 30, 2026 23:59:59").getTime();
    const durationInMs = (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (35 * 60 * 1000);
    const targetDeadline = new Date().getTime() + durationInMs;

    // 2. Update the countdown every single second
    const timerInterval = setInterval(function() {
        const currentTime = new Date().getTime();
        const timeRemaining = targetDeadline - currentTime;

        // 3. Mathematical breakdown for Days, Hours, Minutes, and Seconds
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // 4. Helper function to ensure single numbers get a leading zero (e.g., "05" instead of "5")
        const formatTime = (num) => num < 10 ? "0" + num : num;

        // 5. Inject the live ticking numbers into your HTML elements safely
        const daysEl = document.getElementById("flash-days");
        const hoursEl = document.getElementById("flash-hours");
        const minsEl = document.getElementById("flash-mins");
        const secsEl = document.getElementById("flash-secs");

        // Check if the elements exist on the current page to prevent console bugs
        if (daysEl && hoursEl && minsEl && secsEl) {
            daysEl.innerText = formatTime(days);
            hoursEl.innerText = formatTime(hours);
            minsEl.innerText = formatTime(minutes);
            secsEl.innerText = formatTime(seconds);
        }

        // 6. Action to take when the timer reaches zero
        if (timeRemaining < 0) {
            clearInterval(timerInterval);
            const wrapper = document.querySelector(".countdown-wrapper");
            if (wrapper) {
                wrapper.innerHTML = `
                    <div class="alert alert-warning fw-bold border-0 text-center rounded-3 w-100 py-3">
                        ⚡ This flash sale has ended! Refresh or check back soon for the next rush.
                    </div>
                `;
            }
        }
    }, 1000);
}

// 7. Fire up the script cleanly as soon as the DOM finishes loading
document.addEventListener("DOMContentLoaded", initMetroMallCountdown);

