const products = [
    // Sanduíches
    {
        id: 1,
        name: "Smash Burger",
        price: 26.90,
        category: "sanduiches",
        description: "Pãoc/ gergilim selado, smash burger, fatias de cheddar e molho especial",
        image: "./download.jpg"
    },
    {
        id: 2,
        name: "Salada Burger",
        price: 27.90,
        category: "sanduiches",
        description: "Pãoc/ gergilim selado, smash burger, fatias de cheddar e alface tomate e molho especial",
        image: "./download (3).jpg"
    },
    // Porções
    {
        id: 3,
        name: "Batata Frita rustica",
        price: 48.00,
        category: "porcoes",
        description: "Porção de batata frita rustica crocante (400g)",
        image: "./download (2).jpg"
    },
    {
        id: 4,
        name: "Batata Frita rustica individual",
        price: 9.50,
        category: "porcoes",
        description: "Porção de batata frita rustica crocante (100g)",
        image: "./download (1).jpg"
    },
    // Bebidas
    {
        id: 5,
        name: "Refrigerante",
        price: 9.50,
        category: "bebidas",
        description: "Lata 350ml",
        image: "./download (4).jpg"
    }
];

let cart = [];

function displayProducts(category = 'todos') {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    const filteredProducts = category === 'todos' 
        ? products 
        : products.filter(product => product.category === category);

    filteredProducts.forEach(product => {
        container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="ratio ratio-4x3">
                        <img src="${product.image}" 
                            class="card-img-top img-fluid rounded-top object-fit-cover" 
                            alt="${product.name}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-center mb-3">${product.name}</h5>
                        <p class="card-text flex-grow-1">${product.description}</p>
                        <div class="mt-auto">
                            <p class="product-price text-center mb-3">R$ ${product.price.toFixed(2)}</p>
                            <button class="btn btn-primary w-100 rounded-3" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-cart me-2"></i>Adicionar ao Carrinho
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterProducts(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    displayProducts(category);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <p class="mb-0">R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function addCheckoutModal() {
    const modalHTML = `
        <div class="modal fade" id="checkoutModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Dados para Entrega</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="checkoutForm">
                            <div class="mb-3">
                                <label for="name" class="form-label">Nome Completo</label>
                                <input type="text" class="form-control" id="name" required>
                            </div>
                            <div class="mb-3">
                                <label for="phone" class="form-label">Telefone</label>
                                <input type="tel" class="form-control" id="phone" required>
                            </div>
                            <div class="mb-3">
                                <label for="address" class="form-label">Endereço Completo</label>
                                <textarea class="form-control" id="address" rows="3" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Forma de Pagamento</label>
                                <select class="form-select" id="paymentMethod" required>
                                    <option value="">Selecione a forma de pagamento</option>
                                    <option value="pix">PIX</option>
                                    <option value="card">Cartão de Crédito/Débito</option>
                                    <option value="cash">Dinheiro</option>
                                </select>
                            </div>
                            <div id="changeContainer" class="mb-3 d-none">
                                <label for="change" class="form-label">Troco para quanto?</label>
                                <input type="number" class="form-control" id="change" step="0.01">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="confirmOrder()">Confirmar Pedido</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Modify the checkout function to load saved data
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Create and show checkout modal if it doesn't exist
    if (!document.getElementById('checkoutModal')) {
        addCheckoutModal();
    }

    // Show the checkout modal
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();

    // Load saved customer data
    loadCustomerData();

    // Handle payment method change
    document.getElementById('paymentMethod').addEventListener('change', function(e) {
        const changeContainer = document.getElementById('changeContainer');
        changeContainer.classList.toggle('d-none', e.target.value !== 'cash');
    });
}

// Modify the confirmOrder function to save data
function confirmOrder() {
    const form = document.getElementById('checkoutForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const orderData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        change: document.getElementById('change')?.value,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    // Save customer data
    saveCustomerData(orderData);

    // Format the message for WhatsApp
    let message = `🍔 *Novo Pedido - Boteco do Shao* 🍔\n\n`;
    message += `*Cliente:* ${orderData.name}\n`;
    message += `*Telefone:* ${orderData.phone}\n`;
    message += `*Endereço:* ${orderData.address}\n\n`;
    message += `*Itens do Pedido:*\n`;
    
    orderData.items.forEach(item => {
        message += `▫️ ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Total do Pedido:* R$ ${orderData.total.toFixed(2)}\n`;
    message += `*Forma de Pagamento:* ${orderData.paymentMethod}`;
    
    if (orderData.paymentMethod === 'cash' && orderData.change) {
        message += `\n*Troco para:* R$ ${orderData.change}`;
    }

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp API URL
    const whatsappUrl = `https://wa.me/5514998363981?text=${encodedMessage}`;

    // Close the modal
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    checkoutModal.hide();

    // Clear the cart
    cart = [];
    updateCartDisplay();

    // Open WhatsApp in a new window
    window.open(whatsappUrl, '_blank');
}

// Add these functions after your existing code
function saveCustomerData(orderData) {
    const customerData = {
        name: orderData.name,
        phone: orderData.phone,
        address: orderData.address
    };
    localStorage.setItem('customerData', JSON.stringify(customerData));
}

function loadCustomerData() {
    const savedData = localStorage.getItem('customerData');
    if (savedData) {
        const customerData = JSON.parse(savedData);
        document.getElementById('name').value = customerData.name || '';
        document.getElementById('phone').value = customerData.phone || '';
        document.getElementById('address').value = customerData.address || '';
    }
}

window.onload = () => {
    displayProducts();
    addCheckoutModal();
};