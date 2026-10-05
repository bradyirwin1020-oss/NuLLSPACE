import { establishPrimitive } from "./webkit.js";
import { installWindowP } from "./utils/mem.js";

const output = document.getElementById("console");
const fwValue = document.getElementById("firmwareValue");
const statusTitle = document.getElementById("statusTitle");
const progressBar = document.getElementById("progressBar");
const progressNumber = document.getElementById("progressNumber");
const elfValue = document.getElementById("elfValue");
const connectionText = document.getElementById("connectionText");
const connectionChip = document.getElementById("connectionChip");
const toast = document.getElementById("toast");

const stageOrder = ["webkit", "worker", "kernel", "loader"];

function nowStamp() {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map(v => String(v).padStart(2, "0")).join(":");
}

function setProgress(value, title) {
  const n = Math.max(0, Math.min(100, Number(value) || 0));
  progressBar.style.width = `${n}%`;
  progressNumber.textContent = String(Math.round(n));
  if (title) statusTitle.textContent = title;
}

function stageEl(name) {
  return document.querySelector(`[data-stage="${name}"]`);
}

function setStage(name, state) {
  const el = stageEl(name);
  if (!el) return;

  el.classList.remove("active", "done");
  const label = el.querySelector(".stage-state");

  if (state === "active") {
    el.classList.add("active");
    label.textContent = "ACTIVE";
  } else if (state === "done") {
    el.classList.add("done");
    label.textContent = "DONE";
  } else {
    label.textContent = "WAIT";
  }
}

function activateOnly(name) {
  const idx = stageOrder.indexOf(name);
  stageOrder.forEach((stage, i) => {
    if (i < idx) setStage(stage, "done");
    else if (stage === name) setStage(stage, "active");
    else setStage(stage, "wait");
  });
}

function markReady() {
  stageOrder.forEach(stage => setStage(stage, "done"));
  setProgress(100, "Exploit complete · ELF loader ready");
  elfValue.textContent = "READY :9021";
  elfValue.style.color = "var(--green)";
  connectionText.textContent = "READY";
  connectionChip.querySelector(".dot").style.background = "var(--green)";
  showToast("ELF loader ready on port 9021");
}

function reactToLog(message, type) {
  const m = String(message).toLowerCase();

  if (m.includes("starting webkit")) {
    activateOnly("webkit");
    setProgress(10, "Starting WebKit exploit");
  }
  if (m.includes("arw ready")) {
    setStage("webkit", "done");
    setStage("worker", "active");
    setProgress(32, "WebKit primitive ready");
  }
  if (m.includes("worker") && (m.includes("waiting") || m.includes("ready"))) {
    activateOnly("worker");
    setProgress(m.includes("ready") ? 52 : 40, m.includes("ready") ? "ROP worker ready" : "Preparing ROP worker");
  }
  if (m.includes("worker chain") && m.includes("ready")) {
    setStage("worker", "done");
    setStage("kernel", "active");
    setProgress(64, "Launching kernel stage");
  }
  if (m.includes("kernel exploit") || m.includes("kernel chain")) {
    setStage("kernel", "done");
    setStage("loader", "active");
    setProgress(88, "Kernel stage complete");
  }
  if (m.includes("9021") || m.includes("elfldr is listening")) {
    markReady();
  }
  if (type === "error") {
    statusTitle.textContent = "Exploit stopped · check console";
    connectionText.textContent = "ERROR";
    connectionChip.querySelector(".dot").style.background = "var(--red)";
    showToast("Exploit error — use Retry after checking the console");
  }
}

function writeLog(message, type = "log", replace = false) {
  let line = replace ? output.lastElementChild : null;

  if (!line) {
    line = document.createElement("div");
    line.className = "console-line";
    line.innerHTML = `<span class="time"></span><span class="sig"></span><span class="msg"></span>`;
    output.appendChild(line);
  }

  line.className = `console-line ${type}`;
  line.querySelector(".time").textContent = nowStamp();

  let marker = "·";
  if (type === "error") marker = "×";
  if (type === "info" || type === "success") marker = "+";
  if (type === "system") marker = ">";
  line.querySelector(".sig").textContent = marker;
  line.querySelector(".msg").textContent = String(message);

  output.scrollTop = output.scrollHeight;
  reactToLog(message, type);
}

function writeEvent(name, detail, type) {
  writeLog(
    detail == null || detail === "" ? name : `${name}: ${detail}`,
    type || (name === "Failed" ? "error" : "log")
  );
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

window.writeLog = writeLog;
window.jb = { mark: writeEvent };

document.getElementById("clearBtn")?.addEventListener("click", () => {
  output.innerHTML = "";
  writeLog("Console cleared", "system");
});

document.getElementById("retryBtn")?.addEventListener("click", () => location.reload());

document.getElementById("fullscreenBtn")?.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  } catch (_) {}
});

async function getPrimitive() {
  writeLog("Starting WebKit exploit");
  const primitive = installWindowP(await establishPrimitive(writeEvent));

  if (!primitive || typeof primitive.read8 !== "function")
    throw new Error("Memory primitive unavailable");

  writeLog("ARW ready", "success");
  return primitive;
}

function getWebKitBase() {
  const ctor = globalThis.__ps5NativeCtor;

  if (typeof ctor !== "number" || typeof OFFSET_wk_host_constructor_candidates === "undefined")
    throw new Error("WebKit base inputs are unavailable");

  for (const offset of OFFSET_wk_host_constructor_candidates) {
    const base = ctor - offset;
    if (base >= 0x800000000 && base < 0x900000000 && base % 0x4000 === 0)
      return base;
  }

  throw new Error("WebKit base not found");
}

async function run() {
  fwValue.textContent = window.fw_str || "Unknown";
  connectionText.textContent = "CHECKING";

  const rejection = window.firmware.rejection();
  if (rejection) throw new Error(rejection);

  connectionText.textContent = "RUNNING";
  connectionChip.querySelector(".dot").style.background = "var(--cyan)";

  writeLog("NULLSPACE interface initialized", "system");
  writeLog("Relapse runtime detected", "system");
  writeLog(`Firmware: ${window.fw_str}`, "info");
  writeLog(`Agent: ${navigator.userAgent}`, "info");

  const primitive = await getPrimitive();

  writeLog(`WebKit base: 0x${getWebKitBase().toString(16)}`, "info");

  await import("./relapse_exploit.js");
  await main(primitive);
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  writeLog(message, "error");

  if (!window.fw_str) fwValue.textContent = "Not PS5";
  if (message.includes("PlayStation 5 Required")) {
    fwValue.textContent = "Desktop preview";
    setProgress(0, "Open on a supported PlayStation 5");
  }
});
