// theme toggle (dark / light) recommended by bri
const themeBtn = document.getElementById("themeToggle");
const bodyEl = document.body;

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = bodyEl.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    bodyEl.setAttribute("data-theme", next);
    themeBtn.textContent = next === "dark" ? "☾" : "☼";
  });
}

// small helper so we can switch "Inside Study Room" heading
const activeRoomNameEl = document.getElementById("activeRoomName");
const roomTitleEl = document.getElementById("roomTitle");

// Check for URL params if we are on the details page
const urlParams = new URLSearchParams(window.location.search);
const roomParam = urlParams.get("room");
if (roomParam && roomTitleEl) {
  roomTitleEl.textContent = "Inside Study Room – " + roomParam;
  document.title = "Study App - " + roomParam;
}

// clicking "Open" on a room card updates the active room label and scrolls down
document.querySelectorAll(".open-room-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".room-card");
    const name = card?.getAttribute("data-room-name") || "Study Room";

    // Navigate to the details page
    window.location.href = "room-details.html?room=" + encodeURIComponent(name);
  });
});

// focus timers for each room card
function FocusTimer(displayEl, minutes) {
  this.displayEl = displayEl;
  this.totalSeconds = minutes * 60;
  this.remaining = this.totalSeconds;
  this.running = false;
  this.intervalId = null;
  this.render();
}

FocusTimer.prototype.render = function () {
  const m = Math.floor(this.remaining / 60);
  const s = this.remaining % 60;
  this.displayEl.textContent =
    String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
};

FocusTimer.prototype.tick = function () {
  if (this.remaining <= 0) {
    clearInterval(this.intervalId);
    this.running = false;
    this.displayEl.style.color = "#2ed6c4";
    return;
  }
  this.remaining -= 1;
  this.render();
};

FocusTimer.prototype.stop = function () {
  if (!this.running) return;
  clearInterval(this.intervalId);
  this.running = false;
  this.displayEl.style.color = ""; // reset color
};

FocusTimer.prototype.start = function () {
  if (this.running) return;
  this.running = true;
  this.intervalId = setInterval(() => this.tick(), 1000);
};

const timers = [];
document.querySelectorAll(".timer-display").forEach((d) => {
  const mins = parseInt(d.dataset.minutes || "25", 10);
  timers.push(new FocusTimer(d, mins));
});

document.querySelectorAll(".timer-btn").forEach((btn, i) => {
  btn.addEventListener("click", () => {
    const t = timers[i];
    if (t) {
      if (t.running) {
        t.stop();
        btn.textContent = "Start";
      } else {
        t.start();
        btn.textContent = "Stop";
      }
    }
  });
});

// video expand / shrink this is the recommandation we got from jake
const videoBox = document.getElementById("videoBox");
const videoToggleBtn = document.getElementById("videoToggle");

if (videoToggleBtn && videoBox) {
  videoToggleBtn.addEventListener("click", () => {
    const isLarge = videoBox.classList.toggle("video-box-large");
    videoToggleBtn.textContent = isLarge ? "Shrink video" : "Expand video";
  });
}

// simple chat append so it feels alive when its not :(
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatArea = document.querySelector(".chat-area");
const activityList = document.getElementById("activityList");

if (chatForm && chatInput && chatArea && activityList) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    const msg = document.createElement("div");
    msg.className = "chat-message";
    msg.innerHTML =
      '<span class="chat-name">You:</span> <span>' +
      text.replace(/</g, "&lt;") +
      "</span>";
    chatArea.appendChild(msg);
    chatInput.value = "";

    // drop a small note into activity
    const li = document.createElement("li");
    li.textContent = "You sent a new message";
    activityList.appendChild(li);
  });
}

// fake "add file" button lol
const addFileBtn = document.getElementById("addFileBtn");
const fileList = document.querySelector(".file-list");

if (addFileBtn && fileList) {
  addFileBtn.addEventListener("click", () => {
    const count = fileList.children.length + 1;
    const li = document.createElement("li");
    li.className = "file-item";
    li.innerHTML = "📄 <span>Extra_Notes_" + count + ".txt</span>";
    fileList.appendChild(li);

    if (activityList) {
      const log = document.createElement("li");
      log.textContent = "You added Extra_Notes_" + count + ".txt";
      activityList.appendChild(log);
    }
  });
}
