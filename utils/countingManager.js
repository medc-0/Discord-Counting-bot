// Manages counting state per channel with JSON persistence
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.resolve(__dirname, "..", "data.json");

let channels = {};

function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const txt = fs.readFileSync(DATA_FILE, "utf8");
      channels = JSON.parse(txt || "{}");
    } else {
      channels = {};
    }
  } catch (e) {
    console.error("Failed to load counting data:", e);
    channels = {};
  }
}

function save() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(channels, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to save counting data:", e);
  }
}

function _ensure(channelId) {
  if (!channels[channelId]) {
    channels[channelId] = { count: 0, lastUser: null, enabled: false };
  }
  return channels[channelId];
}

load();

module.exports = {
  getState(channelId) {
    return channels[channelId] || null;
  },

  getCurrent(channelId) {
    const s = channels[channelId];
    return s ? s.count : 0;
  },

  getExpected(channelId) {
    const s = channels[channelId];
    return s ? s.count + 1 : 1;
  },

  increment(channelId, userId) {
    const s = _ensure(channelId);
    s.count += 1;
    s.lastUser = userId;
    save();
    return s.count;
  },

  set(channelId, value, userId = null) {
    const s = _ensure(channelId);
    s.count = value;
    s.lastUser = userId;
    save();
    return s;
  },

  reset(channelId) {
    channels[channelId] = { count: 0, lastUser: null, enabled: true };
    save();
  },

  getLastUser(channelId) {
    const s = channels[channelId];
    return s ? s.lastUser : null;
  },

  enable(channelId) {
    const s = _ensure(channelId);
    s.enabled = true;
    save();
  },

  disable(channelId) {
    const s = _ensure(channelId);
    s.enabled = false;
    save();
  },

  isEnabled(channelId) {
    const s = channels[channelId];
    return s ? Boolean(s.enabled) : false;
  },
};
