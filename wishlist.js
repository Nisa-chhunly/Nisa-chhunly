document.addEventListener("DOMContentLoaded", () => {
    renderWishlist();
    updateCartBadgeCount();
});
function renderWishlist() {
    const wishlistContainer = document.getElementById('wishlist-container');
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (!wishlistContainer) return;

    // 1. If the wishlist is empty
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="text-center py-5 w-100">
                <i class="fa-regular fa-heart fs-1 text-muted mb-3"></i>
                <p class='text-muted fs-5'>Your wishlist is empty.</p>
                <a href="shop.html" class="btn btn-success mt-2">Explore Products</a>
            </div>`;
        return;
    }

    wishlistContainer.innerHTML = ""; // Clear loader text

    // 2. Loop through saved wishlist items and inject them as centered rows
    wishlist.forEach((item, index) => {
        wishlistContainer.innerHTML += `
            <div class="col-12">
                <div class="card p-3 mb-3 shadow-sm" style="min-height: 120px;">
                    <div class="row align-items-center justify-content-center text-center g-3" style="height: 100%;">
                        
                        <div class="col-md-2 col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
                            <img src="${item.imgSrc}" class="img-fluid rounded" alt="${item.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
                        </div>
                        
                        <div class="col-md-5 col-12">
                            <h5 class="fw-bold mb-1 text-truncate" title="${item.title}">${item.title}</h5>
                            <p class="text-success fw-bold mb-0">${item.price}</p>
                        </div>
                        
                        <div class="col-md-5 col-12 d-flex justify-content-center align-items-center gap-2">
                            <button class="btn btn-danger btn-sm px-4 d-flex align-items-center justify-content-center gap-2" 
                                    style="max-width: 160px; height: 38px;" 
                                    onclick="removeFromWishlist(${index})">
                                <i class="fa-solid fa-trash"></i> Remove
                            </button>
                            <button
    class="btn btn-success btn-sm px-4 d-flex align-items-center justify-content-center gap-2"
    style="max-width: 160px; height: 38px;"
    onclick="moveToCart(${index})">

    <i class="fa-solid fa-cart-shopping"></i>
    Move To Cart

</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// 3. Remove function that immediately updates the screen without flickering
function removeFromWishlist(index) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.splice(index, 1); // Delete selected item
    localStorage.setItem('wishlist', JSON.stringify(wishlist)); // Save box changes
    renderWishlist(); // Live re-draw without page refreshing!
}
function moveToCart(index) {

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const item = wishlist[index];

    if (!item) return;

    addToCart(
        item.title,
        item.price,
        item.imgSrc
    );

    wishlist.splice(index, 1);

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    displayWishlist();

    // Refresh cart badge on wishlist page
    updateCartBadgeCount();
}
function updateCartBadgeCount() {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const badge =
        document.getElementById("cartCount");

    if (badge) {
        badge.textContent = totalItems;
    }
}