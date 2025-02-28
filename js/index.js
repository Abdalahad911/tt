let login = document.querySelector(".modal .modal-footer button:last-child");
let register = document.querySelector(
  "#registerModal .modal-footer button:last-child"
);
let create = document.querySelector(
  "#postModal .modal-footer button:last-child"
);
getPosts();
register.addEventListener("click", registerFunc);
function registerFunc() {
  loader(true);
  let name = document.querySelector("#registerModal form .name");
  let userName = document.querySelector("#registerModal form .user-name");
  let pass = document.querySelector("#registerModal form input[type=password]");
  let mail = document.querySelector("#registerModal form input[type=email]");
  let img = document.querySelector("#registerModal form input[type=file]");
  let form = new FormData();
  form.append("username", userName.value);
  form.append("password", pass.value);
  form.append("name", name.value);
  form.append("email", mail.value);
  form.append("image", img.files[0]);

  axios
    .post("https://tarmeezacademy.com/api/v1/register", {
      username: userName.value,
      password: pass.value,
      name: name.value,
      email: mail.value
    })
    .then(data => {
      loader(false);
      let token = data.data.token;
      let user = data.data.user;
      console.log(data);
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("user", JSON.stringify(user));
      let modal = document.getElementById("registerModal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showSuccessAlert("register done", "success");
      setUi();
      showShape();
      showInformation();
      window.location.reload();
    })
    .catch(r => {
      alert(r.response.data.message);
      console.log(r);
      loader(false);
    });
}
// =================================================================
// ====================== infinite scroll ==========================
// =================================================================
let currentPage = 1;
let lastPage = 1;

function handleInfiniteScroll() {
  let endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 1;

  if (endOfPage && currentPage <= lastPage) {
    getPosts((currentPage += 1));
  }
}
window.addEventListener("scroll", handleInfiniteScroll);
// =================================================================
// =================================================================
let tags = [1, 3, 8, 9];
function loader(show) {
  if (show) {
    document.querySelector(".loader-parent").style.display = "block";
  } else {
    document.querySelector(".loader-parent").style.display = "none";
  }
}
function getPosts(page) {
  loader(true);

  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?page=${page}`)
    .then(data => {
      loader(false);

      lastPage = data.data.meta.last_page;
      // console.log(data.data.meta.last_page);
      let posts = data.data.data;
      let main = document.querySelector("#posts");
      for (let i = 0; i < posts.length; i++) {
        console.log(posts[i].author.name);
        let display = "";
        if (window.localStorage.getItem("token")) {
          let de =
            posts[i].author.id ==
            JSON.parse(window.localStorage.getItem("user")).id;
          display = de ? "inline-block" : "none";
        } else {
          display = "none";
        }
        console.log();

        let htmlTags = "";
        tags.forEach(e => {
          htmlTags += `<span class="tag">${e}</span>`;
        });
        // card

        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
        <div class="card-header">
          <img src=${posts[i].author
            .profile_image} alt="" onclick=showProfile(${posts[i].author.id})>
          <span onclick=showProfile(${posts[i].author.id})>${posts[i].author
          .name}</span>
          <button class="delete" style="display:${display}" onclick=deletee(${posts[
          i
        ].id})>Delete</button>
        <button class="edit" data-bs-toggle="modal" data-bs-target="#editModal"" onclick=save(${posts[
          i
        ].id})>Edit</button>
        

        </div>
        <div class="card-body" onclick=postClick(${posts[i].id})>
          <img src=${posts[i].image} alt="" loading=lazy>
          <span>${posts[i].created_at}</span>
          <h5 class="card-title">${posts[i].title}</h5>
          <p class="card-text">${posts[i].body}</p>
          
          <hr>
          <div class="comment">
            <i class="bi bi-pen"></i>
            <span>${posts[i]
              .comments_count}</span> Comments <span id=tags>${htmlTags}</span>
          </div>
        </div>
        <hr>

      `;
        // console.log(card);
        main.append(card);

        let uu = JSON.parse(window.localStorage.getItem("user"));
        if (window.localStorage.getItem("user")) {
          if (uu.id == posts[i].author.id) {
            card.children[0].children[3].style.display = "inline-block";
          } else {
            card.children[0].children[3].style.display = "none";
          }
        } else {
          card.children[0].children[3].style.display = "none";
        }
      }
    });
}
function showProfile(id, img) {
  console.log(id);
  if (window.localStorage.getItem("token")) {
    window.location.href = `http://127.0.0.1:5500/profile.html?postid=${id}`;
  } else {
    alert("LOGIN FIRST PLEAAAASE");
  }
}
function deletee(id) {
  loader(true);
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${id}`, {
      headers: {
        AUTHORIZATION: `Bearer ${window.localStorage.getItem("token")}`
      }
    })
    .then(r => {
      loader(false);
      console.log(r);
      document.querySelector("#posts").innerHTML = "";
      getPosts();
    })
    .catch(r => console.log(r));
}
function save(p) {
  window.localStorage.setItem("idd", p);
}
function showooo() {
  if (window.localStorage.getItem("idd")) {
    console.log("red");

    let editButn = document.querySelectorAll(
      "#editModal .modal-footer button"
    )[1];
    let inpuBtn = document.querySelector("#editModal input[type=text]");

    console.log(inpuBtn.value);

    // let inputBtn=document.querySelector("")
    axios
      .put(
        `https://tarmeezacademy.com/api/v1/posts/${window.localStorage.getItem(
          "idd"
        )}`,
        {
          body: inpuBtn.value
        },
        {
          headers: {
            AUTHORIZATION: `Bearer ${window.localStorage.getItem("token")}`
          }
        }
      )
      .then(r => {
        getPosts();
      });
  }
}

function postClick(postid) {
  if (window.localStorage.getItem("token")) {
    console.log("RED");

    console.log(postid);
    window.localStorage.setItem("id", `${postid}`);
    window.location.href = `http://127.0.0.1:5500/postDetails.html?postid=${postid}`;
  } else {
    alert("LOGIN FIRST PLEAAAAAASE");
  }
}
login.addEventListener("click", loginFunc);
function loginFunc() {
  loader(true);
  let userInput = document.querySelector("#loginModal form input[type=text]");
  let passInput = document.querySelector(
    "#loginModal form input[type=password]"
  );
  axios
    .post("https://tarmeezacademy.com/api/v1/login", {
      username: userInput.value,
      password: passInput.value
    })
    .then(r => {
      loader(false);
      let token = r.data.token;
      let user = r.data.user;
      console.log(token);
      console.log(token);

      window.localStorage.setItem("token", token);
      window.localStorage.setItem("user", JSON.stringify(r.data.user));
      let modal = document.getElementById("loginModal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showSuccessAlert("Nice, you triggered this alert message!", "success");
      setUi();
      showShape();
      showInformation();
      window.location.reload();
    })
    .catch(r => {
      alert(r.response.data.message);
      loader(false);
    });
}
//
// function setUi() {
//   let token = window.localStorage.getItem("token");
//   let loginBtn = document.getElementById("login");
//   let logout = document.getElementById("logout");

//   if (token === null) {
//     loginBtn.style.setProperty("display", "flex", "important");
//     logout.style.setProperty("display", "none", "important");
//   } else {
//     loginBtn.style.setProperty("display", "none", "important");
//     logout.style.setProperty("display", "flex", "important");
//   }
// }

// setUi();
// function logout() {
//   localStorage.clear();
//   showSuccessAlert("logged out", "danger");
//   setUi();
//   showShape();
// }

function setUi() {
  let token = window.localStorage.getItem("token");
  let loginBtn = document.getElementById("login");
  let logout = document.getElementById("logout");

  if (token === null) {
    loginBtn.style.setProperty("display", "flex", "important");
    logout.style.setProperty("display", "none", "important");
  } else {
    loginBtn.style.setProperty("display", "none", "important");
    logout.style.setProperty("display", "flex", "important");
  }
}

setUi();

function showShape() {
  if (window.localStorage.getItem("token")) {
    document.querySelector(".shape").style.display = "flex";
  } else {
    document.querySelector(".shape").style.display = "none";
  }
}
showShape();

create.addEventListener("click", newPost);

function newPost() {
  let image = document.querySelector("#postModal .modal-body input[type=file]")
    .files[0];
  let bodyy = document.querySelector("#postModal .modal-body input[type=text]");
  let formData = new FormData();
  formData.append("body", bodyy.value);
  formData.append("image", image);
  formData.append("title", "ya");

  console.log(formData);
  if (window.localStorage.getItem("token")) {
    axios
      .post(
        "https://tarmeezacademy.com/api/v1/posts",
        {
          body: bodyy.value,
          title: "ya"
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`
          }
        }
      )
      .then(r => {
        let modal = document.getElementById("postModal");
        let modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        document.querySelector("#posts").innerHTML = "";
        getPosts();
      });
  }
}
