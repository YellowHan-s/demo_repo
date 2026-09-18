/* Agent Reach Channel Explorer — frontend logic */

const $ = (sel) => document.querySelector(sel);

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* ---------- Channel grid ---------- */

async function renderChannels() {
  const grid = $("#channel-grid");
  const channels = await (await fetch("/api/channels")).json();
  grid.textContent = "";
  for (const ch of channels) {
    const card = el("article", "channel-card" + (ch.zeroConfig ? " zero" : " login"));

    const head = el("div", "card-head");
    head.append(el("span", "card-icon", ch.icon), el("h3", "", ch.name));
    head.append(
      el("span", "badge " + (ch.zeroConfig ? "badge-zero" : "badge-login"),
        ch.zeroConfig ? "零配置" : "需登录"),
    );
    card.append(head);

    const tool = el("p", "card-tool");
    tool.append("主力工具：", el("strong", "", ch.primaryTool));
    card.append(tool);

    if (ch.backends.length > 1) {
      card.append(el("p", "card-route", "路由：" + ch.backends.join(" ▸ ")));
    }

    card.append(el("p", "card-desc", ch.outOfBox));
    if (ch.unlockable) card.append(el("p", "card-unlock", "🔓 " + ch.unlockable));
    card.append(el("pre", "card-example", "$ " + ch.example));
    grid.append(card);
  }
}

/* ---------- Jina Reader playground ---------- */

function setupReadPlayground() {
  const form = $("#read-form");
  const input = $("#read-url");
  const btn = $("#read-btn");
  const cmd = $("#read-cmd");
  const out = $("#read-output");

  input.addEventListener("input", () => {
    cmd.textContent = "$ curl https://r.jina.ai/" + (input.value || "<url>");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = "读取中…";
    out.hidden = false;
    out.textContent = "正在通过 Jina Reader 抓取，请稍候…";
    try {
      const res = await fetch("/api/read?url=" + encodeURIComponent(input.value));
      const data = await res.json();
      out.textContent = "";
      if (data.error) {
        out.append(el("p", "error", "⚠️ " + data.error));
      } else {
        const meta = el("p", "output-meta");
        meta.append("✅ 已读取 ", el("code", "", data.url),
          `（${data.markdown.length.toLocaleString()} 字符，以下为前 8000 字符预览）`);
        out.append(meta, el("pre", "markdown-preview", data.markdown.slice(0, 8000)));
      }
    } catch (err) {
      out.textContent = "";
      out.append(el("p", "error", "⚠️ 请求失败：" + err.message));
    } finally {
      btn.disabled = false;
      btn.textContent = "读取";
    }
  });
}

/* ---------- GitHub playground ---------- */

function setupGithubPlayground() {
  const form = $("#gh-form");
  const input = $("#gh-repo");
  const btn = $("#gh-btn");
  const out = $("#gh-output");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = "查询中…";
    out.hidden = false;
    out.textContent = "正在查询公开 GitHub API…";
    try {
      const res = await fetch("/api/github?repo=" + encodeURIComponent(input.value));
      const data = await res.json();
      out.textContent = "";
      if (data.error) {
        out.append(el("p", "error", "⚠️ " + data.error));
      } else {
        const card = el("div", "gh-card");
        const title = el("h3");
        const link = el("a", "", data.fullName);
        link.href = data.htmlUrl;
        link.target = "_blank";
        link.rel = "noopener";
        title.append("📦 ", link);
        card.append(title);
        if (data.description) card.append(el("p", "gh-desc", data.description));
        const stats = el("p", "gh-stats");
        stats.append(
          el("span", "stat", `⭐ ${Number(data.stars).toLocaleString()}`),
          el("span", "stat", `🍴 ${Number(data.forks).toLocaleString()}`),
          el("span", "stat", `🐛 ${Number(data.openIssues).toLocaleString()} open issues`),
          el("span", "stat", data.language ? `💻 ${data.language}` : "💻 —"),
          el("span", "stat", data.license ? `📄 ${data.license}` : "📄 —"),
        );
        card.append(stats);
        if (data.topics.length) {
          const topics = el("p", "gh-topics");
          for (const t of data.topics) topics.append(el("span", "topic", t));
          card.append(topics);
        }
        out.append(card);
      }
    } catch (err) {
      out.textContent = "";
      out.append(el("p", "error", "⚠️ 请求失败：" + err.message));
    } finally {
      btn.disabled = false;
      btn.textContent = "查询";
    }
  });
}

/* ---------- Doctor mock panel ---------- */

const STATUS_LABEL = {
  active: ["●", "当前在用", "st-active"],
  skipped: ["○", "备选待命", "st-skipped"],
  unavailable: ["✕", "未配置", "st-unavailable"],
  retired: ["†", "已退役", "st-retired"],
};

async function renderDoctor() {
  const panel = $("#doctor-panel");
  const entries = await (await fetch("/api/doctor")).json();
  panel.textContent = "";
  const term = el("div", "doctor-term");
  term.append(el("div", "doctor-cmd", "$ agent-reach doctor"));
  for (const entry of entries) {
    const row = el("div", "doctor-row");
    row.append(el("span", "doctor-channel", entry.channel));
    const chain = el("span", "doctor-chain");
    entry.backends.forEach((b, i) => {
      if (i > 0) chain.append(el("span", "sep", " ▸ "));
      const [mark, label, cls] = STATUS_LABEL[b.status];
      const item = el("span", "doctor-backend " + cls);
      item.textContent = `${mark} ${b.name}`;
      item.title = label;
      chain.append(item);
    });
    row.append(chain);
    if (entry.note) row.append(el("span", "doctor-note", "— " + entry.note));
    term.append(row);
  }
  const legend = el("div", "doctor-legend");
  for (const [mark, label, cls] of Object.values(STATUS_LABEL)) {
    legend.append(el("span", "doctor-backend " + cls, `${mark} ${label}`));
  }
  panel.append(term, legend);
}

renderChannels();
setupReadPlayground();
setupGithubPlayground();
renderDoctor();
