/* VoltPRo public learning assistant — ADIGUN-inspired interface, VoltPRo-specific scope. */
(() => {
  "use strict";
  if (window.VoltProAssistant) return;
  const API_URL = "https://hephzibahbehulah.com/api/chat";
  const sessionKey = "voltpro-public-assistant-session";
  const getSession = () => {
    try {
      let id = localStorage.getItem(sessionKey);
      if (!id) {
        id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(36).slice(2);
        localStorage.setItem(sessionKey, id);
      }
      return id;
    } catch (_) { return "voltpro-public-session"; }
  };
  const localAnswer = (question) => {
    const q = String(question || "").toLowerCase().trim();
    if (/\b(voltage|potential difference)\b/.test(q) && /what|define|explain|mean/.test(q))
      return "Voltage is the electrical potential difference between two points. It is measured in volts (V). In a simple resistive circuit, Ohm’s law gives U = I × R.";
    if (/\b(current|amperage)\b/.test(q) && /what|define|explain|mean/.test(q))
      return "Electric current is the rate of charge flow, measured in amperes (A). For a resistive load, I = U / R. Always isolate and verify equipment before physical work.";
    if (/\bresistance\b/.test(q) && /what|define|explain|mean/.test(q))
      return "Resistance describes opposition to current flow and is measured in ohms (Ω). For an ohmic component, R = U / I.";
    if (/ohm.?s law|calculate resistance/.test(q))
      return "Ohm’s law: U = I × R. Rearranged: I = U / R and R = U / I. Use volts, amperes and ohms consistently.";
    if (/power|watt/.test(q) && /electrical|calculate|formula|what|explain/.test(q))
      return "For DC or a resistive load, electrical power is P = U × I. Other useful forms are P = I²R and P = U²/R. AC and motor calculations may require power factor and efficiency.";
    if (/voltage drop/.test(q))
      return "Voltage drop depends on current, conductor length, cross-sectional area, conductor material and circuit arrangement. VoltPRo’s engineering tools provide an educational estimate; verify against applicable standards and installation conditions.";
    if (/simulator|simulation|circuit/.test(q))
      return "VoltPRo includes a browser-based circuit simulator and learning workspaces. Open “VoltPRo Simulator” to build a schematic, explore supported DC/AC/transient analyses, or practise panel and control logic workflows. Results are educational, not certified safety verification.";
    if (/safety|230 ?v|400 ?v|mains|live circuit|electric shock/.test(q))
      return "Electrical safety first: do not work on live equipment. Isolate all sources, secure against reconnection, verify absence of voltage with suitable tested equipment, and follow the applicable local procedures and qualifications. VoltPRo is an educational tool, not authorization to perform electrical work.";
    if (/voltpro|what can you do|help|capabilit/.test(q))
      return "I’m the VoltPRo learning assistant. I can help with electrical fundamentals, formulas, component concepts, simulator workflows, engineering exercises and troubleshooting approaches. For calculations, share the known values and units. I cannot certify an installation or replace manufacturer documentation and current standards.";
    return null;
  };
  const boot = () => {
    if (document.getElementById("vpBotWindow")) return;
    const root = document.createElement("div");
    root.innerHTML = `
      <button class="vp-bot-launcher" id="vpBotLauncher" type="button" aria-label="Open VoltPRo learning assistant" aria-expanded="false" title="Ask VoltPRo"><span>AI</span><i class="vp-bot-dot" aria-hidden="true"></i></button>
      <section class="vp-bot-window" id="vpBotWindow" role="dialog" aria-label="VoltPRo learning assistant" aria-modal="false" aria-hidden="true">
        <header class="vp-bot-head"><div class="vp-bot-brand"><div class="vp-bot-core">VP</div><div class="vp-bot-title"><strong>VOLTPRO ASSISTANT</strong><span>ENGINEERING · LEARNING · LABS</span></div></div>
          <div class="vp-bot-actions"><button id="vpBotClear" type="button" title="Clear conversation" aria-label="Clear conversation">⌫</button><button id="vpBotClose" type="button" title="Close assistant" aria-label="Close assistant">×</button></div>
        </header>
        <div class="vp-bot-status"><b>● READY</b> · PUBLIC LEARNING ASSISTANT · NO ADMIN ACCESS</div>
        <div class="vp-bot-messages" id="vpBotMessages" aria-live="polite" aria-relevant="additions text"></div>
        <div class="vp-bot-suggestions" id="vpBotSuggestions"><button type="button">Explain Ohm’s law</button><button type="button">Help with the simulator</button><button type="button">Electrical safety basics</button></div>
        <form class="vp-bot-composer" id="vpBotForm"><textarea id="vpBotInput" rows="1" maxlength="2000" placeholder="Ask about electrical engineering…" autocomplete="off" aria-label="Ask VoltPRo"></textarea><button class="vp-bot-send" id="vpBotSend" type="submit" aria-label="Send message">→</button></form>
        <footer class="vp-bot-footer"><span>EDUCATIONAL USE ONLY · VERIFY SAFETY-CRITICAL WORK</span><span>VOLTPRO / HB</span></footer>
      </section>`;
    document.body.appendChild(root);
    const launcher = root.querySelector("#vpBotLauncher");
    const win = root.querySelector("#vpBotWindow");
    const msgs = root.querySelector("#vpBotMessages");
    const input = root.querySelector("#vpBotInput");
    const form = root.querySelector("#vpBotForm");
    const send = root.querySelector("#vpBotSend");
    const history = [];
    const add = (text, role = "bot") => {
      const el = document.createElement("div");
      el.className = "vp-bot-msg " + role;
      el.textContent = String(text || "");
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
      return el;
    };
    add("VoltPRo assistant ready. Ask about electrical fundamentals, calculations, components, simulator workflows or learning resources. For safety-critical decisions, consult qualified professionals, manufacturer data and applicable standards.");
    const open = () => { win.classList.add("open"); win.setAttribute("aria-hidden", "false"); launcher.setAttribute("aria-expanded", "true"); setTimeout(() => input.focus(), 80); };
    const close = () => { win.classList.remove("open"); win.setAttribute("aria-hidden", "true"); launcher.setAttribute("aria-expanded", "false"); launcher.focus(); };
    launcher.addEventListener("click", () => win.classList.contains("open") ? close() : open());
    root.querySelector("#vpBotClose").addEventListener("click", close);
    root.querySelector("#vpBotClear").addEventListener("click", () => { history.length = 0; msgs.replaceChildren(); add("Conversation cleared. Ask a new question."); });
    root.querySelectorAll("#vpBotSuggestions button").forEach(button => button.addEventListener("click", () => { input.value = button.textContent; form.requestSubmit(); }));
    input.addEventListener("keydown", event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); } });
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question || send.disabled) return;
      add(question, "user");
      input.value = "";
      send.disabled = true;
      const thinking = add("Working…", "system");
      let answer = null;
      try {
        const messages = [...history.slice(-8), { role: "user", content: question }];
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "content-type": "application/json", "x-hb-session": getSession() },
          body: JSON.stringify({ messages, siteContext: "VoltPRo Academy: electrical/electronics education, simulator, engineering tools, component reference and safety-first learning. This is a public user with no administrative privileges." }),
          signal: AbortSignal.timeout(12000)
        });
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.answer === "string" && data.answer.trim()) answer = data.answer.trim();
        }
      } catch (_) { /* Cross-origin or gateway unavailable: use safe local educational answers when possible. */ }
      if (!answer) answer = localAnswer(question);
      thinking.remove();
      if (answer) {
        add(answer);
        history.push({ role: "user", content: question }, { role: "assistant", content: answer });
        if (history.length > 12) history.splice(0, history.length - 12);
      } else {
        add("I couldn’t reach the AI service, and I don’t have a reliable offline answer for that question. Try asking about Ohm’s law, electrical power, voltage drop, electrical safety or the VoltPRo simulator.");
      }
      send.disabled = false;
      input.focus();
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.VoltProAssistant = { open: () => document.getElementById("vpBotLauncher")?.click() };
})();