 {/* // Import the functions you need from the SDKs you need */}

 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
 import {getDatabase, ref,get,set} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

 {/* // TODO: Add SDKs for Firebase products that you want to use */}
 {/* // https://firebase.google.com/docs/web/setup#available-libraries */}

 {/* // Your web app's Firebase configuration */}
 const firebaseConfig = {
   apiKey: "AIzaSyB7JDoaCVc7Om4ON6Yr7nwhTOWy77QzbPE",
   authDomain: "catering-system-abf62.firebaseapp.com",
   projectId: "catering-system-abf62",
   storageBucket: "catering-system-abf62.appspot.com",
   messagingSenderId: "577449185412",
   appId: "1:577449185412:web:8eab656bcf4533b6bef2d1"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 const db = getDatabase(app)

 function GetPostData(){
    const user_ref = ref(db,'post/')
    get(user_ref).then((snapshot)=>{
      const data = snapshot.val()
      console.log(data);
      let html = "";
      const table = document.querySelector('.card-container')
      for( const key in data){
        const { title,post_content,imageUrl} = data[key]

        html+=`
      
        <div class="card">
        <div class="card-img">
                <td>${imageUrl ? `<img src="${imageUrl}" alt="Image" style="width: 100px; height: 100px;" />` : 'No image'}</td>
              </div>
            <div class="card-content">
                <h2 class="card-title">${title}</h2>
                
        <p class="card-price">Rs${parseFloat(post_content).toFixed(2)}</p>
            <button class="add-to-cart-btn" onclick="addToCart('${title}', ${parseFloat(post_content)})">Add to Cart</button>
            </div>
        </div>
    `

        }
        
      
      table.innerHTML= html
  
    })
 
  }

  GetPostData()


  
  
  // addmenu
  


  let cart = [];
  let totalPrice = 0;

    window.addToCart = function addToCart(dishName, dishPrice) {
  const cartItems = document.getElementById('cart-items');
  const listItem = document.createElement('li');

  const itemText = document.createElement('span');
  itemText.textContent = `${dishName} - Rs${dishPrice.toFixed(2)}`;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'delete-button';
  deleteButton.addEventListener('click', function () {
    removeFromCart(dishName, dishPrice, listItem);
  });

  listItem.appendChild(itemText);
  listItem.appendChild(deleteButton);
  cartItems.appendChild(listItem);

  cart.push({ name: dishName, price: dishPrice });
  updateTotalPrice();
}

function removeFromCart(dishName, dishPrice, listItem) {
  const cartItems = document.getElementById('cart-items');
  cartItems.removeChild(listItem);

  const itemIndex = cart.findIndex(item => item.name === dishName && item.price === dishPrice);
  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
  }
  updateTotalPrice();
}

function updateTotalPrice() {
  totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
  document.getElementById('total-price').textContent = `Total: Rs${totalPrice.toFixed(2)}`;
}
 

// jhbajh



document.getElementById('place-order-btn').addEventListener('click', placeOrder);

function placeOrder() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const ordersRef = ref(db, 'orders/');
  
  get(ordersRef).then((snapshot) => {
    let orderNumber = 1; // Default order number if no orders exist
    if (snapshot.exists()) {
      const orders = snapshot.val();
      const orderNumbers = Object.keys(orders).map(Number);
      orderNumber = Math.max(...orderNumbers) + 1; // Increment the highest order number
    }

    const order = {
      orderNumber,
      items: cart,
      totalPrice
    };

    set(ref(db, 'orders/' + orderNumber), order).then(() => {
      alert('Order placed successfully! Scroll down to see your order');
      cart = [];
      totalPrice = 0;
      document.getElementById('cart-items').innerHTML = '';
      document.getElementById('total-price').textContent = 'Total: Rs0.00';
      displayCurrentOrder(orderNumber);
    }).catch((error) => {
      console.error('Error placing order:', error);
    });

  }).catch((error) => {
    console.error('Error fetching orders:', error);
  });
}



function displayCurrentOrder(orderNumber) {
  const orderRef = ref(db, 'orders/' + orderNumber);

  get(orderRef).then((snapshot) => {
      if (snapshot.exists()) {
          const order = snapshot.val();
          const currentOrderDiv = document.getElementById('order-list');
          let itemsHtml = '';
          order.items.forEach(item => {
              itemsHtml += `<li>${item.name} - Rs${item.price.toFixed(2)}</li>`;
          });
          const orderHtml = `
              <div class="order-item">
                  <h3>Order #${order.orderNumber}</h3>
                  <ul>${itemsHtml}</ul>
                  <p>Total Price: Rs${order.totalPrice.toFixed(2)}</p>
              </div>`;
          currentOrderDiv.innerHTML = orderHtml;
      } else {
          document.getElementById('order-list').innerHTML = '<p>No orders found.</p>';
      }
  }).catch((error) => {
      console.error('Error fetching order:', error);
  });
}

// Get orderNumber from URL and display the current order
const orderNumber = new URLSearchParams(window.location.search).get('orderNumber');
if (orderNumber) {
  displayCurrentOrder(orderNumber);
} else {
  document.getElementById('order-list').innerHTML = '<p>No order number provided.</p>';
}


document.getElementById('searchBar').addEventListener('keyup', (e) => {
  const searchData = e.target.value.toLowerCase();
  filterPosts(searchData);
});

function filterPosts(searchData) {
  const postsRef = ref(db, 'post/');
  get(postsRef).then((snapshot) => {
    const data = snapshot.val();
    let html = "";
    const postList = document.getElementsByClassName('card-title');
    for (const key in data) {
      const { title, post_content, imageUrl } = data[key];
      if (title.toLowerCase().includes(searchData)) {
        html += `
          <div class="post-item">
            <h3>${title}</h3>
            <p>${post_content}</p>
            ${imageUrl ? `<img src="${imageUrl}" alt="Image" style="width: 100px; height: 100px;" />` : 'No image'}
          </div>`;
      }
    }
    postList.innerHTML = html;
  }).catch((error) => {
    console.error('Error fetching posts:', error);
  });
}



