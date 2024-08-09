


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, set, ref, get, remove, update } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

// Your web app's Firebase configuration
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
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

const container = document.querySelector('.my_blog');
const form_control = document.querySelector('.login');
const your_order=document.querySelector('.yourorder')
const yourorder=document.querySelector('.order-list')

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";

    container.classList.add('show');
    form_control.classList.add('hide');
    // your_order.classList.add('hide')
    your_order.classList.remove('hide')
    yourorder.classList.remove('hide')


    sign_out_btn.classList.remove('hide')

    // getOrders(); // Fetch and display orders when user is authenticated

  } else {
    container.classList.remove('show');
    form_control.classList.remove('hide');
    sign_out_btn.classList.add('hide')
    your_order.classList.add('hide')
    yourorder.classList.add('hide')



    // sign_out_btn.classList.add('hide')


  }
});

function signinuser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password).then((usercredinals) => {
    console.log(usercredinals.user.uid);
  });
}

const sign_btn = document.querySelector('#sign_in');
sign_btn.addEventListener('click', signinuser);

// Sign out
const sign_out_btn = document.querySelector('#Logout');
sign_out_btn.addEventListener('click', () => {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    console.log("error" + error);
  });
});

// Blog section
const notifi = document.querySelector('.notifi');
const add_post_btn = document.querySelector('#post_btn');

function Add_post() {
  const title = document.querySelector('#title').value;
  const post_content = document.querySelector('#post_content').value;
  const id = Math.floor(Math.random() * 100);
  const imageFile = document.querySelector('#image').files[0];

  if (imageFile) {
    const storageReference = storageRef(storage, 'images/' + imageFile.name);
    uploadBytes(storageReference, imageFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        set(ref(db, 'post/' + id), {
          title: title,
          post_content: post_content,
          imageUrl: url
        }).then(() => {
          notifi.innerHTML = "Data Added";
          document.querySelector('#title').value = "";
          document.querySelector('#post_content').value = "";
          document.querySelector('#image').value = "";
          GetPostData();
        });
      });
    });
  } else {
    set(ref(db, 'post/' + id), {
      title: title,
      post_content: post_content
    }).then(() => {
      notifi.innerHTML = "Data Added";
      document.querySelector('#title').value = "";
      document.querySelector('#post_content').value = "";
      GetPostData();
    });
  }
}

add_post_btn.addEventListener('click', Add_post);

// Get data from Firebase database
function GetPostData() {
  const user_ref = ref(db, 'post/');
  get(user_ref).then((snapshot) => {
    const data = snapshot.val();
    console.log(data);
    let html = "";
    const table = document.querySelector('table');
    for (const key in data) {
      const { title, post_content, imageUrl } = data[key];

      html += `
      <tr>
        <td> <span class="postnumber"></span></td>
        <td>${title} </td>
        <td>${imageUrl ? `<img src="${imageUrl}" alt="Image" style="width: 100px; height: 100px;" />` : 'No image'}</td>
        <td> <button class="delete" onclick="delete_data(${key})">Delete</button> </td>
        <td> <button class="update" onclick="update_data(${key})">Update</button> </td>
      </tr>`;
    }
    table.innerHTML = html;
  });
}

GetPostData();

// Delete data
window.delete_data = function (key) {
  remove(ref(db, `post/${key}`));
  notifi.innerHTML = "Data deleted";
  GetPostData();
};

// Get and update data
window.update_data = function (key) {
  const user_ref = ref(db, `post/${key}`);
  get(user_ref).then((item) => {
    document.querySelector('#title').value = item.val().title;
    document.querySelector('#post_content').value = item.val().post_content;
  });
  const update_btn = document.querySelector('.update_btn');
  update_btn.classList.add('show');
  document.querySelector('.post_btn').classList.add('hide');

  // Update
  update_btn.addEventListener('click', Update_form);

  function Update_form() {
    const title = document.querySelector('#title').value;
    const post_content = document.querySelector('#post_content').value;
    const imageFile = document.querySelector('#image').files[0];

    if (imageFile) {
      const storageReference = storageRef(storage, 'images/' + imageFile.name);
      uploadBytes(storageReference, imageFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          update(ref(db, `post/${key}`), {
            title: title,
            post_content: post_content,
            imageUrl: url
          }).then(() => {
            document.querySelector('#title').value = "";
            document.querySelector('#post_content').value = "";
            document.querySelector('#image').value = "";
            update_btn.classList.remove('show');
            document.querySelector('.post_btn').classList.remove('hide');
            GetPostData();
          });
        });
      });
    } else {
      update(ref(db, `post/${key}`), {
        title: title,
        post_content: post_content
      }).then(() => {
        document.querySelector('#title').value = "";
        document.querySelector('#post_content').value = "";
        update_btn.classList.remove('show');
        document.querySelector('.post_btn').classList.remove('hide');
        GetPostData();
      });
    }
  }
};




function getOrders() {
  const ordersRef = ref(db, 'orders/');
  get(ordersRef).then((snapshot) => {
    const data = snapshot.val();
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    for (const key in data) {
      const order = data[key];
      let itemsHtml = '';
      order.items.forEach(item => {
        itemsHtml += `<li>${item.name} - Rs${item.price.toFixed(2)}</li>`;
      });
      const orderHtml = `
        <div class="order-item">
        
          <h3>Order #${order.orderNumber}</h3>
          <ul>${itemsHtml}</ul>
          <p>Total Price: Rs${order.totalPrice.toFixed(2)}</p>
          <button class="removeorder" onclick="removeOrder('${key}')">Remove Order</button>

        </div>`;
      orderList.innerHTML += orderHtml;
    }
  }).catch((error) => {
    console.error('Error fetching orders:', error);
  });
}
window.removeOrder = function removeOrder(orderId) {
  const orderRef = ref(db, 'orders/' + orderId);
  remove(orderRef).then(() => {
      alert('Order removed successfully!');
      getOrders(); // Refresh the order list after removal
  }).catch((error) => {
      console.error('Error removing order:', error);
  });
}
// getOrders(); 


getOrders();

