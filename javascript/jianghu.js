/** CONFIG -- Setup your characters. */
const CHARACTERS = new Set();
CHARACTERS.add("zheng yuze");
CHARACTERS.add("song qian");

/** CONFIG -- Setup your symbol for owed/not owed. */
const OWED =
  '<span class="owed"><i class="fa-solid fa-circle-dashed"></i></span>';
const NOT_OWED = '<span class="owed"><i class="fa-solid fa-circle"></i></span>';

const setOwed = (thread, threadDoc) => {
  console.log("thread - " + thread.textContent);
  if (isLastPoster(threadDoc)) {
    thread.innerHTML += NOT_OWED;
    console.log("not owed");
  } else {
    thread.innerHTML += OWED;
    console.log("owed");
  }
};

const isLastPoster = (docText) => {
  // Workaround - jcink doesn't seem to be valid XML (?)
  const el = document.createElement("div");
  el.hidden = true;
  el.innerHTML = docText;

  let postName = el.querySelectorAll(".post-row .post-mini-row .mini-stick .post-name a");
  console.log(postName);
  let poster = postName[postName.length - 1].innerHTML;
  console.log(poster);

  return CHARACTERS.has(poster);
};

const getThreadPage = async (thread, url) => {
  const res = await makeRequest("GET", url);
  setOwed(thread, res);
};

window.addEventListener("load", (event) => {
  console.log("page is fully loaded");

  // Get all threads.
  let threads = document.querySelectorAll(".yuze-thread,.qian-thread");

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
