function showInformation(namePerson, img) {
  let name = document.querySelector("#logout .information span");
  let image = document.querySelector("#logout .information img");
  if (window.localStorage.getItem("user")) {
    let user = JSON.parse(window.localStorage.getItem("user"));
    name.innerHTML = user.name;
    image.src = user.profile_image;
  }
}
showInformation();
function setUi() {
  let token = window.localStorage.getItem("token");
  let loginBtn = document.getElementById("login");
  let logout = document.getElementById("logout");

  if (token === null) {
    // loginBtn.style.setProperty("display", "flex", "important");
    logout.style.setProperty("display", "none", "important");
  } else {
    // loginBtn.style.setProperty("display", "none", "important");
    logout.style.setProperty("display", "flex", "important");
  }
}

setUi();
function logout() {
  localStorage.clear();
  showSuccessAlert("logged out", "danger");
  setUi();
  if (document.querySelector(".shape") != null) {
    showShape();
  }
  window.location.href = "http://127.0.0.1:5500/index.html";
  if (window.location.href == "http://127.0.0.1:5500/profile.html") {
    console.log("red");
  }
}
function showSuccessAlert(customMessage, customType) {
  const alertPlaceholder = document.getElementById("successAlert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert" ">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>"
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  appendAlert(customMessage, customType);
  // todo: hide alert
  setTimeout(() => {
    let alertHide = bootstrap.Alert.getOrCreateInstance("#successAlert");
    // alertHide.hide();
    // document.querySelector("#successAlert").hide();
  }, 2000);
}
