/** CONFIG -- Setup your symbol for owed/not owed. */
const OWED =
  '<span class="owed"><i class="fa-solid fa-sparkles"></i></span>';
const NOT_OWED = '<span class="owed"> </span>';

const setOwed = (thread, threadDoc) => {
  console.log("thread - " + thread.textContent);
  if (isLastPoster(threadDoc)) {
    thread.classList.add("not-owed");
    thread.insertAdjacentHTML("afterbegin",NOT_OWED);
  } else {
    thread.classList.add("owed");
    thread.insertAdjacentHTML("afterbegin",OWED);
  }
};

const isLastPoster = (docText) => {
  // Workaround - jcink doesn't seem to be valid XML (?)
  const el = document.createElement("div");
  el.hidden = true;
  el.innerHTML = docText;

  let postName = el.querySelectorAll(".post-row .mini-profile-name a span");
  console.log(postName);
  let poster = postName[postName.length - 1].innerHTML;
  console.log(poster);

  return CHARACTERS.has(poster);
};

const getThreadPage = async (thread, url) => {
  const res = await makeRequest("GET", url);
  setOwed(thread, res);
};

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
