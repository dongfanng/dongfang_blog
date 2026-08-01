/**
 * 文章页增强：回到顶部、图片灯箱、TOC 高亮、代码复制
 * 在 Astro View Transitions 下通过 astro:page-load 重新绑定
 */

let lightboxEl: HTMLDivElement | null = null;
let scrollTicking = false;
let bound = false;

function ensureLightbox() {
  if (lightboxEl) return lightboxEl;
  lightboxEl = document.createElement('div');
  lightboxEl.className = 'lightbox-overlay';
  lightboxEl.hidden = true;
  lightboxEl.innerHTML = `
    <img class="lightbox-image" alt="" />
    <button type="button" class="lightbox-close" aria-label="关闭">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  `;
  document.body.appendChild(lightboxEl);

  lightboxEl.addEventListener('click', (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });
  lightboxEl.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  return lightboxEl;
}

function openLightbox(img: HTMLImageElement) {
  const overlay = ensureLightbox();
  const image = overlay.querySelector('.lightbox-image') as HTMLImageElement;
  image.src = img.src;
  image.alt = img.alt;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightboxEl) return;
  lightboxEl.hidden = true;
  document.body.style.overflow = '';
}

function bindLightboxImages() {
  const prose = document.querySelector('.prose');
  if (!prose) return;
  prose.querySelectorAll('img').forEach((img) => {
    if (img.dataset.lightboxBound) return;
    img.dataset.lightboxBound = 'true';
    (img as HTMLImageElement).style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img as HTMLImageElement));
  });
}

function updateTocActive() {
  const headings = Array.from(
    document.querySelectorAll('.prose h2, .prose h3, .prose h4'),
  ) as HTMLElement[];
  if (headings.length === 0) return;

  const scrollY = window.scrollY;
  const offset = 120;
  let activeId: string | null = null;

  for (const h of headings) {
    if (h.offsetTop - offset <= scrollY) activeId = h.id;
    else break;
  }
  if (activeId === null) activeId = headings[0].id;

  document.querySelectorAll('.toc a').forEach((a) => a.classList.remove('toc-active'));
  if (activeId) {
    document.querySelector(`.toc a[href="#${activeId}"]`)?.classList.add('toc-active');
  }
}

function updateBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  btn.hidden = winScroll <= 300;
}

function onScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    updateBackToTop();
    updateTocActive();
    scrollTicking = false;
  });
}

function getOrCreateCodeWrapper(block: HTMLElement): HTMLElement {
  const figure = block.closest('figure[data-rehype-pretty-code-figure]');
  if (figure instanceof HTMLElement) return figure;

  const parent = block.parentElement;
  if (parent?.classList.contains('code-block-wrapper')) return parent;

  const wrapper = document.createElement('div');
  wrapper.className = 'code-block-wrapper';
  block.parentNode?.insertBefore(wrapper, block);
  wrapper.appendChild(block);
  return wrapper;
}

function setupCodeCopy() {
  document.querySelectorAll('pre').forEach((block) => {
    // Mermaid 块会被客户端渲染成 SVG，不添加复制按钮（避免渲染后遗留空按钮）
    if (block.getAttribute('data-language') === 'mermaid') return;

    const wrapper = getOrCreateCodeWrapper(block as HTMLElement);
    wrapper.classList.add('code-block-wrapper');

    const language = block.getAttribute('data-language');
    const hasTitle = Boolean(wrapper.querySelector('figcaption'));
    if (language && !hasTitle) {
      wrapper.setAttribute('data-code-language', language);
    } else {
      wrapper.removeAttribute('data-code-language');
    }

    if (wrapper.querySelector(':scope > .copy-button')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className =
      'copy-button absolute top-2 right-2 z-10 w-6 h-6 p-0 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer opacity-0 transition-opacity duration-200 flex items-center justify-center';
    button.setAttribute('aria-label', 'Copy code');
    button.innerHTML = `
      <svg class="copy-icon w-3.5 h-3.5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
      </svg>
      <svg class="check-icon w-3.5 h-3.5 text-green-500 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    wrapper.addEventListener('mouseenter', () => {
      button.style.opacity = '1';
    });
    wrapper.addEventListener('mouseleave', () => {
      button.style.opacity = '0';
    });

    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      const code = block.querySelector('code');
      if (!code) return;
      await navigator.clipboard.writeText(code.innerText);
      const copyIcon = button.querySelector('.copy-icon') as HTMLElement;
      const checkIcon = button.querySelector('.check-icon') as HTMLElement;
      copyIcon.classList.add('hidden');
      checkIcon.classList.remove('hidden');
      setTimeout(() => {
        copyIcon.classList.remove('hidden');
        checkIcon.classList.add('hidden');
      }, 2000);
    });

    wrapper.appendChild(button);
  });
}

function onPageLoad() {
  const btn = document.getElementById('back-to-top');
  if (btn && btn.dataset.bound !== '1') {
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  bindLightboxImages();
  setupCodeCopy();
  updateTocActive();
  updateBackToTop();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox();
}

function init() {
  if (bound) return;
  bound = true;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('astro:page-load', onPageLoad);
  onPageLoad();
}

init();
