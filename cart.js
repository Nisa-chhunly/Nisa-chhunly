document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

function renderCart() {
    const cartContainer = document.getElementById('cart-container');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!cartContainer) return;

    // Filter out any broken, empty, or corrupted items from your storage box automatically
    cart = cart.filter(item => item && item.title && item.price);
    localStorage.setItem('cart', JSON.stringify(cart)); // Save the cleaned box back

    // 1. If cart is empty
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-5 w-100">
                <i class="fa-solid fa-cart-shopping fs-1 text-muted mb-3"></i>
                <p class='text-muted fs-5'>Your shopping cart is empty.</p>
                <a href="shop.html" class="btn btn-success mt-2">Continue Shopping</a>
            </div>`;
        return;
    }

    cartContainer.innerHTML = ""; // Clear loader text
    let orderTotal = 0;

    // 2. Loop through valid saved items and inject them as clean rows
    cart.forEach((item, index) => {
        // Safe price cleaning helper logic
        let numericPrice = 0;
        if (typeof item.price === 'string') {
            numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
        } else if (typeof item.price === 'number') {
            numericPrice = item.price;
        }

        const itemQuantity = parseInt(item.quantity) || 1;
        const itemTotal = numericPrice * itemQuantity;
        orderTotal += itemTotal;

        cartContainer.innerHTML += `
            <div class="col-12">
                <div class="card p-3 mb-3 shadow-sm" style="min-height: 120px;">
                    <div class="row align-items-center justify-content-center text-center g-3" style="height: 100%;">
                        
                        <div class="col-md-2 col-12 d-flex justify-content-center align-items-center" style="height: 80px;">
                            <img src="${item.imgSrc || 'images/placeholder.jpg'}" class="img-fluid rounded" alt="${item.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
                        </div>
                        
                        <div class="col-md-4 col-12 text-md-start text-center">
                            <h5 class="fw-bold mb-1 text-truncate" title="${item.title}">${item.title}</h5>
                            <p class="text-success fw-bold mb-0">${item.price}</p>
                        </div>

                        <div class="col-md-3 col-12 d-flex justify-content-center align-items-center gap-2">

    <button class="btn btn-outline-danger btn-sm"
        onclick="decreaseQuantity(${index})">
        <i class="fa-solid fa-minus"></i>
    </button>

    <span class="fw-bold fs-5">${itemQuantity}</span>

    <button class="btn btn-outline-success btn-sm"
        onclick="increaseQuantity(${index})">
        <i class="fa-solid fa-plus"></i>
    </button>

</div>
                        
                          <div class="col-md-3 col-12 d-flex justify-content-center align-items-center">
                            <button class="btn btn-outline-danger btn-sm px-3 d-flex align-items-center justify-content-center gap-2" 
                                    style="height: 38px;" 
                                    onclick="removeItemFromCart(${index})">
                                <i class="fa-solid fa-trash"></i> Remove
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        `;
    });

    // 3. Inject the Summary Order Total Box at the bottom with the Clear/Reset Button
    cartContainer.innerHTML += `
        <div class="card p-4 mt-4 shadow-sm border-success bg-white text-center">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                <div>
                    <h4 class="mb-0 fw-bold text-dark">Estimated Total:</h4>
                </div>
                <div>
                    <span class="text-success fw-bold fs-2">$${orderTotal.toFixed(2)}</span>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-danger btn-lg px-4 fw-bold" onclick="resetCart()">
                        <i class="fa-solid fa-trash-can me-2"></i> Clear Cart
                    </button>
                    <button class="btn btn-success btn-lg px-5 fw-bold" onclick="checkout()">checkout</button>
                </div>
            </div>
        </div>
    `;
}

// Function to delete one row
function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    if (typeof updateCartBadgeCount === "function") updateCartBadgeCount();
}

// Function to completely wipe the cart structure clean
function resetCart() {
    if (confirm("Are you sure you want to empty your entire cart?")) {
        localStorage.removeItem('cart');
        renderCart();
        if (typeof updateCartBadgeCount === "function") updateCartBadgeCount();
    }
}
function increaseQuantity(index) {

    let cart =
        JSON.parse(localStorage.getItem('cart')) || [];

    cart[index].quantity =
        (cart[index].quantity || 1) + 1;

    localStorage.setItem(
        'cart',
        JSON.stringify(cart)
    );

    renderCart();

    if(typeof updateCartBadgeCount === "function"){
        updateCartBadgeCount();
    }
}

function decreaseQuantity(index) {

    let cart =
        JSON.parse(localStorage.getItem('cart')) || [];

    if((cart[index].quantity || 1) > 1){

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    localStorage.setItem(
        'cart',
        JSON.stringify(cart)
    );

    renderCart();

    if(typeof updateCartBadgeCount === "function"){
        updateCartBadgeCount();
    }
}

function checkout() {

    let cart =
        JSON.parse(localStorage.getItem('cart')) || [];

    if(cart.length === 0){

        alert("🛒 Your cart is empty!");

        return;
    }

    let total = 0;

    cart.forEach(item => {

        const price =
            parseFloat(
                item.price.replace(/[^0-9.]/g, '')
            ) || 0;

        total +=
            price * (item.quantity || 1);

    });

    alert(
        `🎉 Order Successful!\n\n` +
        `Total: $${total.toFixed(2)}\n\n` +
        `Thank you for shopping at MetroMall!`
    );

    localStorage.removeItem('cart');

    renderCart();

    if(typeof updateCartBadgeCount === "function"){
        updateCartBadgeCount();
    }
}