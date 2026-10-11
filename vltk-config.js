/* VLTKIDLE2 self-hosted backend config. Keep this file before app.js. */
(() => {
  const url = 'https://getxendjerlcwgwnvted.supabase.co';
  const key = 'sb_publishable_bC4EDAb8zGQdHn7dMxLCPQ_YiCncl7d';
  window.CHAT_CFG = Object.assign({}, window.CHAT_CFG || {}, {
    url,
    key,
    anonKey: key,
    supabaseUrl: url,
    supabaseKey: key
  });
})();
