// lib/user-prefs.js
const KEY_IDENTITAS = "pjok_identitas_json";
const KEY_COMPLETE  = "pjok_identitas_complete";

export function getIdentitas() {
  try {
    const raw = localStorage.getItem(KEY_IDENTITAS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveIdentitas(obj) {
  try {
    localStorage.setItem(KEY_IDENTITAS, JSON.stringify(obj || {}));
  } catch {}
}

export function setIdentitasComplete(v = true) {
  try {
    localStorage.setItem(KEY_COMPLETE, v ? "1" : "0");
  } catch {}
}

export function isIdentitasComplete() {
  try {
    return localStorage.getItem(KEY_COMPLETE) === "1";
  } catch {
    return false;
  }
}
