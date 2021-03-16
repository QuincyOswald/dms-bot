// ==UserScript==
// @name         New User Automator
// @namespace    http://willcro.com/
// @version      1.0
// @description  Bulk creation of owners
// @author       Will Croteau
// @match        https://*.appfolio.com/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  function start() {
    var popup = document.createElement("div");
    popup.style.backgroundColor = "white";
    popup.style.border = "black solid";
    popup.style.padding = "15px";
    popup.style.position = "fixed";
    popup.style.width = "500px";
    popup.style.zIndex = 1000000;
    popup.style.left = "50%";
    popup.style.marginLeft = "-250px";
    popup.style.textAlign = "center";
    popup.style.top = "0px";

    popup.innerHTML = `
<span>Enter names here (one on each line)<span><br>
<textarea style="width: 100%; height: 300px" id="users"></textarea><br><br>
<button id="submitButton">Submit</button>
`
    document.body.appendChild(popup);
    document.getElementById("submitButton").onclick = submit
  }

  function submit() {
    var usersStr = document.getElementById("users").value;
    var users = usersStr.split("\n").map((userName) => {
      return {
        name: userName,
        created: false
      };
    })
    var state = {
      status: "RUNNING",
      currentIndex: 0,
      users: users
    }
    saveState(state);
    window.location = "/owners/new";
  }

  function next() {
    var state = getState();
    if (state == null || state.status != "RUNNING") {
      if (window.location.pathname == "/") {
        // start();
      }
      return;
    }
    if (window.location.pathname == "/owners/new") {
      createUser(state)
      saveState(state);
    } else if (/owners\/(\d*)/.test(window.location.pathname)) {
      recordUser(state);
      checkDone(state);
      saveState(state);
      if (state.status == "RUNNING") {
        window.location = "/owners/new";
      }
    }
  }

  function createUser(state) {
    var user = state.users[state.currentIndex];
    document.getElementById("owner_contact_info_attributes_company_name").value = user.name;
    document.getElementById("owner_contact_info_attributes_company").checked = true;
    state.currentIndex++;
    user.created = true;
    document.getElementById("save_button").click();
  }

  function recordUser(state) {
    var userId = /owners\/(\d*)/.exec(window.location.pathname)[1];
    state.users[state.currentIndex - 1].id = userId;
  }

  function checkDone(state) {
    if (state.currentIndex >= state.users.length) {
      state.status = "DONE";
      showDoneScreen(state);
    }
  }

  function showDoneScreen(state) {
    var popup = document.createElement("div");
    popup.style.backgroundColor = "white";
    popup.style.border = "black solid";
    popup.style.padding = "15px";
    popup.style.position = "fixed";
    popup.style.width = "500px";
    popup.style.zIndex = 1000000;
    popup.style.left = "50%";
    popup.style.marginLeft = "-250px";
    popup.style.textAlign = "center";
    popup.style.top = "0px";

    popup.innerHTML = `
<span>Ids<span><br>
<textarea style="width: 100%;" id="ids" readonly></textarea><br><br>
`

    document.body.appendChild(popup);

    var ids = state.users.map(user => user.id).join("\n");

    document.getElementById("ids").value = ids
  }

  function getState() {
    return JSON.parse(localStorage.getItem("state"));
  }

  function saveState(state) {
    localStorage.setItem("state", JSON.stringify(state));
  }

  function createMenuItem() {
    var menuItem = document.createElement("li");
    menuItem.classList.add("js-nav-menu-row");
    menuItem.innerHTML = `
<div id="bulk_add">
    <a id="bulk_add_link" href="#" class="list-group-item border-0 text-uppercase text-nowrap text-light js-nav-menu-primary-item">
    <i class="fa fa-fw mr-2 fa-users text-white-50">
        <span class="whats_new_notification notification-dot animated infinite tada"></span>
    </i>
    <span class="mini-hide js-name">Bulk Add Owners</span>
  </a>
</div>
    `

    document.querySelector("#accordion > ul").appendChild(menuItem);
    document.getElementById("bulk_add_link").onclick = start;
  }

  document.addEventListener("readystatechange", next);
  document.addEventListener("readystatechange", createMenuItem);
  // next();
})();
