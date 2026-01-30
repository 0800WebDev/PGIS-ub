fetch("/killswitch.json", { cache: "no-store" })
  .then(r => r.json())
  .then(cfg => {
    if (!cfg.enabled) {
      startShutdownTimer(cfg.timer);
    }
  });

function startShutdownTimer(minutes) {
  let remaining = minutes * 60; // seconds

  // Create warning banner
  const banner = document.createElement("div");
  banner.style.position = "fixed";
  banner.style.bottom = "0";
  banner.style.left = "0";
  banner.style.width = "100%";
  banner.style.padding = "12px";
  banner.style.background = "black";
  banner.style.color = "white";
  banner.style.fontFamily = "monospace";
  banner.style.textAlign = "center";
  banner.style.zIndex = "999999";
  document.body.appendChild(banner);

  const interval = setInterval(() => {
    const min = Math.floor(remaining / 60);
    const sec = remaining % 60;

    banner.textContent =
      `This page is closing temporarily in ${min} minutes and ${sec} seconds please click <a href="/info.txt">here</a> for more info`;

    if (remaining <= 0) {
      clearInterval(interval);
      killPage();
    }

    remaining--;
  }, 1000);
}

function killPage() {
  // Stop loading/execution
  window.stop();

  // Clear storage
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {}

  // Blank the page
  document.documentElement.innerHTML = "";

  // Redirect to blank
  location.replace("about:blank");

  // Attempt close (will only work if JS-opened)
  setTimeout(() => {
    window.close();
  }, 100);
}
