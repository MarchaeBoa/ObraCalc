document.getElementById("open-all").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "open-dev-tools" });
  window.close();
});
