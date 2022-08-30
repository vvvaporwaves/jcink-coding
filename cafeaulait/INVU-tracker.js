/** CONFIG -- Setup your characters. */
const CHARACTERS = new Set();
CHARACTERS.add("TITANIA ELWYN");
CHARACTERS.add("RED RANDELL");

/** CONFIG -- Setup your symbol for owed/not owed. */
const OWED =
  '<span class="owed"><i class="fa-solid fa-circle-dashed"></i></span>';
const NOT_OWED = '<span class="owed"><i class="fa-solid fa-circle"></i></span>';

const setOwed = (thread, threadDoc) => {
  console.log("thread - " + thread.textContent);
  if (isLastPoster(threadDoc)) {
    thread.innerHTML += NOT_OWED;
  } else {
    thread.innerHTML += OWED;
  }
};

const isLastPoster = (docText) => {
  // Workaround - jcink doesn't seem to be valid XML (?)
  const el = document.createElement("div");
  el.hidden = true;
  el.innerHTML = docText;

  let tables = el.getElementsByTagName("table");
  let poster = tables[tables.length - 2].rows[0].cells[0].textContent;

  return CHARACTERS.has(poster);
};

const getThreadPage = async (thread, url) => {
  const res = await makeRequest("GET", url);
  setOwed(thread, res);
};

window.addEventListener("load", (event) => {
  console.log("page is fully loaded");

  // Get all threads.
  let threads = document.querySelectorAll(".red-thread,.nia-thread");

  for (let i = 0; i < threads.length; i++) {
    let url = threads[i].querySelector("a").href;
    // console.log(url);
    getThreadPage(threads[i], url);
  }
});

const makeRequest = (method, url) => {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.responseText);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send();
  });
};

// tabs

var tabLinks = document.querySelectorAll(".tablinks");
var tabContent = document.querySelectorAll(".tabscontent");

tabLinks.forEach(function (el) {
  el.addEventListener("click", openTabs);
});

function openTabs(el) {
  var btnTarget = el.currentTarget;
  var country = btnTarget.dataset.country;

  tabContent.forEach(function (el) {
    el.classList.remove("active");
  });

  tabLinks.forEach(function (el) {
    el.classList.remove("active");
  });

  document.querySelector("#" + country).classList.add("active");

  btnTarget.classList.add("active");
}
