/**
 * Mermaid 流程图渲染（客户端）
 * - 仅在含 ```mermaid 代码块的文章页有实际开销（无 mermaid 块时直接跳过，库按需动态加载）
 * - 兼容 View Transitions（astro:page-load 重新绑定）
 * - 跟随暗色/亮色主题，切换主题时自动重渲染
 *
 * 注意：顶层标识符加 mermaid 前缀，避免与同一组件内其他 <script>（如 post-enhancements）
 * 在 astro check 的合并作用域检查中冲突。
 */

const isMermaidDark = () => document.documentElement.classList.contains('dark');

let mermaidBound = false;
let mermaidRenderCounter = 0;

async function renderMermaid(mermaid: { render: (id: string, text: string) => Promise<{ svg: string; bindFunctions?: (el: HTMLElement) => void }> }, source: string, target: Element) {
  const id = `mermaid-${Date.now()}-${mermaidRenderCounter++}`;
  const { svg, bindFunctions } = await mermaid.render(id, source);
  const container = document.createElement('div');
  container.className = 'mermaid-container overflow-x-auto';
  container.dataset.mermaidSource = source;
  container.innerHTML = svg;
  target.replaceWith(container);
  bindFunctions?.(container);

  // 放大按钮：全屏查看图表
  const zoomBtn = document.createElement('button');
  zoomBtn.type = 'button';
  zoomBtn.className = 'mermaid-zoom-btn';
  zoomBtn.setAttribute('aria-label', '放大图表');
  zoomBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>`;
  zoomBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    void openMermaidFullscreen(container);
  });
  container.appendChild(zoomBtn);
}

/**
 * 全屏查看图表：查看器背景为深色，统一用 dark 主题重渲染，
 * 避免浅色模式下克隆浅色 SVG 导致文字发灰、对比度不足。
 * Esc / 点击遮罩 / 关闭按钮退出。
 */
async function openMermaidFullscreen(container: HTMLElement) {
  const source = container.dataset.mermaidSource ?? '';
  if (!source) return;

  let svgHtml: string;
  try {
    const { default: mermaid } = await import('mermaid');
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'strict',
    });
    const { svg } = await mermaid.render(`mermaid-fullscreen-${Date.now()}-${mermaidRenderCounter++}`, source);
    svgHtml = svg;
  } catch {
    // 重渲染失败时回退为克隆当前 SVG
    const svgEl = container.querySelector('svg');
    if (!svgEl) return;
    svgHtml = svgEl.outerHTML;
  }

  const overlay = document.createElement('div');
  overlay.className = 'mermaid-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = svgHtml;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'mermaid-lightbox-close';
  closeBtn.setAttribute('aria-label', '关闭');
  closeBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>`;

  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', onKey);

  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

async function renderMermaidBlocks() {
  // rehype-pretty-code 输出为 pre[data-language="mermaid"]，code 无 class
  const blocks = Array.from(document.querySelectorAll<HTMLElement>('.prose pre[data-language="mermaid"]'));
  if (blocks.length === 0) return;

  const { default: mermaid } = await import('mermaid');
  mermaid.initialize({
    startOnLoad: false,
    theme: isMermaidDark() ? 'dark' : 'default',
    securityLevel: 'strict',
  });

  for (const pre of blocks) {
    const code = pre.querySelector('code');
    const source = code?.textContent ?? pre.textContent ?? '';
    try {
      await renderMermaid(mermaid, source, pre);
    } catch (err) {
      // 渲染失败时保留源码块，附加错误提示
      console.error('[mermaid] 渲染失败:', err);
      const hint = document.createElement('p');
      hint.className = 'text-sm text-red-500 dark:text-red-400';
      hint.textContent = '⚠ Mermaid 图表渲染失败，已展示原始代码。';
      pre.after(hint);
    }
  }
}

// 主题切换（<html> class 变化）时重渲染已生成图表
let mermaidThemeObserver: MutationObserver | null = null;
function watchMermaidTheme() {
  if (mermaidThemeObserver || typeof MutationObserver === 'undefined') return;
  mermaidThemeObserver = new MutationObserver((mutations) => {
    const classChanged = mutations.some((m) => m.type === 'attributes' && m.attributeName === 'class');
    if (!classChanged) return;
    const containers = Array.from(document.querySelectorAll<HTMLElement>('[data-mermaid-source]'));
    if (containers.length === 0) return;
    void import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: isMermaidDark() ? 'dark' : 'default',
        securityLevel: 'strict',
      });
      containers.forEach((container) => {
        const source = container.dataset.mermaidSource ?? '';
        void renderMermaid(mermaid, source, container).catch((err) => console.error('[mermaid] 重渲染失败:', err));
      });
    });
  });
  mermaidThemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

function onMermaidPageLoad() {
  watchMermaidTheme();
  renderMermaidBlocks();
}

function initMermaid() {
  if (mermaidBound) return;
  mermaidBound = true;
  document.addEventListener('astro:page-load', onMermaidPageLoad);
  onMermaidPageLoad();
}

initMermaid();
