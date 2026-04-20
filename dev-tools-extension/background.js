const DEV_URLS = [
  "https://github.com/",
  "https://supabase.com/dashboard",
  "https://vercel.com/dashboard"
];

function openAll() {
  DEV_URLS.forEach((url) => chrome.tabs.create({ url }));
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "open-dev-tools") openAll();
});
