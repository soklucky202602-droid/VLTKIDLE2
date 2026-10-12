"use strict";
(() => {
  const cfg = window.VLTK_AUTH_CONFIG || window.CHAT_CFG || {};
  const anonKey = cfg.anonKey || cfg.key;
  if (!cfg.url || !anonKey || !window.supabase) return;
  const sb = window.supabase.createClient(cfg.url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "admv_auth" }
  });

  document.addEventListener("click", async (ev) => {
    const button = ev.target.closest("#saveAdmvSettings");
    if (!button) return;

    ev.preventDefault();
    ev.stopImmediatePropagation();

    const out = {};
    document.querySelectorAll("[data-setting]").forEach((el) => {
      out[el.dataset.setting] = Number(el.value);
    });
    document.querySelectorAll("[data-flag]").forEach((el) => {
      out[el.dataset.flag] = !!el.checked;
    });

    button.disabled = true;
    const msg = document.getElementById("admvSettingsMsg");
    try {
      const { data, error } = await sb.rpc("gm_set_admv_settings", { p_settings: out });
      if (error) throw error;
      if (msg) {
        msg.textContent = "Đã lưu toàn bộ hệ số ADMV vào server. Game sẽ nhận cấu hình mới.";
        msg.classList.remove("danger");
      }
      window.dispatchEvent(new CustomEvent("admv-settings-saved", { detail: data || out }));
    } catch (e) {
      if (msg) {
        msg.textContent = e?.message || "Không thể lưu hệ số ADMV.";
        msg.classList.add("danger");
      }
    } finally {
      button.disabled = false;
    }
  }, true);
})();
