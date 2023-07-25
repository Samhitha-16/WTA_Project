const btnCart = document.querySelector('.btn-cart');
const cart = document.querySelector('.cart');
const btnClose = document.querySelector('#cart-close');

btnCart.addEventListener('click', () => {
  // cart.classList.add('cart-active');
  cart.style.display = 'block';
    
});

btnClose.addEventListener('click', () => {
  // cart.classList.remove('cart-active');
  cart.style.display = 'none';
    
});

document.addEventListener('DOMContentLoaded', loadFood);

function loadFood() {
  loadContent();
}

function loadContent() {
  let btnRemove = document.querySelectorAll('.cart-remove');
  console.log(btnRemove);
  btnRemove.forEach((btn) => {
    btn.addEventListener('click', removeItem);
  });
  let qtyElements = document.querySelectorAll('.cart-quantity');
  qtyElements.forEach((input) => { 
    input.addEventListener('change', changeQty);
  });
  let cartBtns = document.querySelectorAll('.add-cart');
  cartBtns.forEach((btn) => {
    btn.addEventListener('click', addCart);
  });
  updateTotal();
 
}

function removeItem() {
  let cartItem = this.parentElement.parentElement.parentElement;
  let title = cartItem.querySelector('.cart-food-title').innerHTML;
  itemList = itemList.filter(el => el.title != title);
  cartItem.remove();
  loadContent();
}

function changeQty() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  loadContent();
}

let itemList = [];

function addCart() {
  let food = this.parentElement;
  let title = food.querySelector('.food-title').innerHTML;
  let price = food.querySelector('.food-price').innerHTML;
  let imgSrc = this.parentElement.querySelector('.food-img').src;
  let newProduct = { title, price, imgSrc }

  if (itemList.find((el) => el.title == newProduct.title)) {
    alert('Product already added to cart');
    return;
  } 
  else {
    itemList.push(newProduct);
  }
  let newProductElement = createCartProduct(title, price, imgSrc);
  let element = document.createElement('div');
  element.innerHTML = newProductElement;
  let cartBasket = document.querySelector('.cart-content');
  cartBasket.append(element);
  loadContent();
  
  fetch('http://localhost/place_order.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'cartData=' + encodeURIComponent(JSON.stringify(itemList)),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      // Optionally, perform any additional actions after the order is placed
    })
    .catch((error) => {
      console.error('Error placing order:', error);
      // Handle the error appropriately
    });

}

function createCartProduct(title, price, imgSrc) {
  return`
    <div class="cart-box">
      <img src="${imgSrc}" class="cart-img">
      <div class="detail-box">
        <div class="cart-food-title">${title}</div>
        <div class="price-box">
          <div class="cart-price">${price}</div>
          <div class="cart-amt">${price}</div>
          <i class="fa fa-trash cart-remove"></i>
        </div>
        <input type="number" value="1" class="cart-quantity">
      </div>
    </div> 
  `;
}


function updateTotal() {
  const cartItems = document.querySelectorAll('.cart-box');
  const totalValue = document.querySelector('.total-price');

  let total = 0;
  cartItems.forEach(product => {
    let priceElement = product.querySelector('.cart-price');
    let price = parseFloat(priceElement.innerHTML.replace("Rs.",""));
    let qty = product.querySelector('.cart-quantity').value;
    total += (price * qty);
    product.querySelector('.cart-amt').innerText = "Rs." + (price * qty);
  });

  totalValue.innerHTML = 'Rs.' + total;

  const cartCount = document.querySelector('.cart-count');
  let count = itemList.length; 
  cartCount.innerHTML = count;

  if (count == 0) {
    cartCount.style.display = 'none';
    cart.classList.remove('cart-active'); // Hide the cart when there are no items
  } else {
    cartCount.style.display = 'block';
  }
}
