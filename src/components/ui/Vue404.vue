<template>
  <div class="flex items-center justify-center p-4" style="min-height: calc(100vh - 16rem);">
    <div class="w-full transition-all duration-300" :class="maximized ? 'max-w-4xl' : 'max-w-2xl'">
      <!-- Terminal window -->
      <div class="rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
        <div class="group flex items-center gap-2 px-4 py-2.5 bg-gray-800 dark:bg-gray-900">
          <button type="button" @click="closeTerminal" class="flex w-3.5 h-3.5 items-center justify-center rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" aria-label="关闭">
            <svg class="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M3,3 L9,9 M9,3 L3,9" />
            </svg>
          </button>
          <button type="button" @click="toggleMinimize" class="flex w-3.5 h-3.5 items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" aria-label="最小化">
            <svg class="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M3,6 L9,6" />
            </svg>
          </button>
          <button type="button" @click="toggleMaximize" class="flex w-3.5 h-3.5 items-center justify-center rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" aria-label="最大化">
            <svg class="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2,2 L8,2 L2,8 Z" />
              <path d="M10,10 L4,10 L10,4 Z" />
            </svg>
          </button>
          <span class="ml-2 text-xs text-gray-400 font-mono">bash - dongfang@blog</span>
        </div>
        <div
          ref="terminalBody"
          class="terminal-scroll bg-gray-900 dark:bg-black p-4 font-mono text-sm overflow-y-auto transition-[max-height,opacity,padding] duration-300 ease-in-out"
          :class="minimized ? 'max-h-0 min-h-0 opacity-0 py-0 overflow-hidden' : maximized ? 'max-h-[calc(100vh-20.5rem)] opacity-100 min-h-[200px]' : 'max-h-[calc(100vh-21rem)] opacity-100 min-h-[150px]'"
          @click="focusInput"
        >
          <div
            v-for="(line, i) in visibleLines"
            :key="i"
            class="whitespace-pre-wrap leading-relaxed"
            :class="line.class"
          >
            <span v-if="line.prompt" class="text-green-400">guest@blog</span><span v-if="line.prompt" class="text-gray-500">:</span><span v-if="line.prompt" class="text-blue-400">~</span><span v-if="line.prompt" class="text-gray-500">$ </span>{{ line.text }}
          </div>
          <span v-if="!allTyped" class="inline-block w-2 h-4 bg-green-400 animate-pulse"></span>
          <!-- Interactive prompt -->
          <div v-if="allTyped && !minimized" class="flex items-center">
            <span class="text-green-400">guest@blog</span><span class="text-gray-500">:</span><span class="text-blue-400">~</span><span class="text-gray-500">$&nbsp;</span>
            <input
              ref="inputRef"
              v-model="currentInput"
              type="text"
              class="flex-1 bg-transparent outline-none text-gray-200 caret-green-400"
              @keydown.enter="executeCommand"
              @keydown.tab.prevent="handleTab"
              @keydown.arrow-up.prevent="historyPrev"
              @keydown.arrow-down.prevent="historyNext"
              @keydown.ctrl.l.prevent="clearScreen"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

interface TerminalLine {
  text: string;
  class: string;
  prompt?: boolean;
}

const terminalBody = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const visibleLines = ref<TerminalLine[]>([]);
const allTyped = ref(false);
const minimized = ref(false);
const maximized = ref(false);
const currentInput = ref('');

function closeTerminal() {
  window.location.href = '/';
}

function toggleMinimize() {
  minimized.value = !minimized.value;
}

function toggleMaximize() {
  maximized.value = !maximized.value;
}

function focusInput() {
  inputRef.value?.focus();
}

function scrollToBottom() {
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight;
    }
  });
}

// 命令历史
const commandHistory = ref<string[]>([]);
let historyIndex = -1;

function historyPrev() {
  if (commandHistory.value.length === 0) return;
  if (historyIndex === -1) {
    historyIndex = commandHistory.value.length - 1;
  } else if (historyIndex > 0) {
    historyIndex--;
  }
  currentInput.value = commandHistory.value[historyIndex];
}

function historyNext() {
  if (historyIndex === -1) return;
  if (historyIndex < commandHistory.value.length - 1) {
    historyIndex++;
    currentInput.value = commandHistory.value[historyIndex];
  } else {
    historyIndex = -1;
    currentInput.value = '';
  }
}

function clearScreen() {
  visibleLines.value = [];
}

// 命令处理
const commands: Record<string, (args: string[]) => TerminalLine[]> = {
  help: () => [
    { text: '可用命令:', class: 'text-gray-300' },
    { text: '  help       显示帮助信息', class: 'text-gray-400' },
    { text: '  ls         列出文件', class: 'text-gray-400' },
    { text: '  cat <file> 查看文件内容', class: 'text-gray-400' },
    { text: '  pwd        显示当前路径', class: 'text-gray-400' },
    { text: '  whoami     显示当前用户', class: 'text-gray-400' },
    { text: '  date       显示当前时间', class: 'text-gray-400' },
    { text: '  echo <txt> 回显文本', class: 'text-gray-400' },
    { text: '  history    查看历史命令', class: 'text-gray-400' },
    { text: '  clear      清空终端', class: 'text-gray-400' },
    { text: '  neofetch   系统信息', class: 'text-gray-400' },
    { text: '  home       返回首页', class: 'text-gray-400' },
    { text: '  exit       退出终端', class: 'text-gray-400' },
  ],
  ls: () => [
    { text: 'readme.md   404.txt   home/', class: 'text-gray-300' },
  ],
  cat: (args) => {
    if (!args[0]) return [{ text: 'cat: 缺少文件参数', class: 'text-red-400' }];
    if (args[0] === 'readme.md') return [
      { text: '# 404 Terminal - Easter Eggs', class: 'text-green-400' },
      { text: '# Try these commands:', class: 'text-gray-500' },
      { text: '#   sl', class: 'text-gray-400' },
      { text: '#   cowsay <text>', class: 'text-gray-400' },
      { text: '#   fortune', class: 'text-gray-400' },
      { text: '#   matrix', class: 'text-gray-400' },
      { text: '#   sudo rm -rf /', class: 'text-gray-400' },
      { text: '#   ...can you figure out what they do?', class: 'text-cyan-400' },
    ];
    if (args[0] === '404.txt') return [
      { text: 'Error 404: Page Not Found', class: 'text-red-400' },
      { text: 'The requested page does not exist.', class: 'text-gray-400' },
    ];
    if (args[0] === 'home') return [
      { text: 'home 是一个链接，指向 /', class: 'text-blue-400' },
      { text: '输入 home 命令返回首页', class: 'text-gray-400' },
    ];
    return [{ text: `cat: ${args[0]}: 文件不存在`, class: 'text-red-400' }];
  },
  pwd: () => [{ text: '/lost+found', class: 'text-gray-300' }],
  whoami: () => [{ text: 'guest', class: 'text-gray-300' }],
  date: () => [{ text: new Date().toLocaleString('zh-CN'), class: 'text-gray-300' }],
  echo: (args) => [{ text: args.join(' ') || '', class: 'text-gray-300' }],
  clear: () => { visibleLines.value = []; return []; },
  history: () => commandHistory.value.length > 0
    ? commandHistory.value.map((cmd, i) => ({ text: `  ${i + 1}  ${cmd}`, class: 'text-gray-400' }))
    : [{ text: '没有历史命令', class: 'text-gray-500' }],
  neofetch: () => [
    { text: '  ╭─────────╮   guest@blog', class: 'text-green-400' },
    { text: '  │  4 0 4  │   ──────────', class: 'text-green-400' },
    { text: '  ╰─────────╯   OS: BlogOS 1.0', class: 'text-green-400' },
    { text: '                Host: dongfang-blog.pages.dev', class: 'text-gray-400' },
    { text: '                Shell: bash 5.2', class: 'text-gray-400' },
    { text: '                Resolution: Lost in 404', class: 'text-gray-400' },
    { text: '                Uptime: 404 days', class: 'text-gray-400' },
  ],
  home: () => { window.location.href = '/'; return []; },
  exit: () => { window.location.href = '/'; return []; },
  sudo: (args) => {
    const fullCmd = args.join(' ');
    const lines: TerminalLine[] = [
      { text: 'guest is not in the sudoers file. This incident will be reported.', class: 'text-red-400' },
    ];
    if (fullCmd.includes('rm') && fullCmd.includes('-rf') && fullCmd.includes('/')) {
      lines.push({ text: '', class: 'text-gray-500' });
      lines.push({ text: "但我看到了你想 'rm -rf /' 的小心思。", class: 'text-yellow-400' });
      lines.push({ text: '这是 404 页面，没有文件可删。', class: 'text-gray-500' });
      lines.push({ text: '连 root 都不敢这么干。', class: 'text-gray-500' });
    }
    return lines;
  },
  vim: () => [{ text: '请使用网页编辑器，这不是真正的终端。', class: 'text-yellow-400' }],
  nano: () => [{ text: '请使用网页编辑器，这不是真正的终端。', class: 'text-yellow-400' }],
  sl: () => [
    { text: '       ====           ____', class: 'text-gray-300' },
    { text: '      |    |         |    |', class: 'text-gray-300' },
    { text: '  ____|____|_________|____|__', class: 'text-gray-300' },
    { text: ' |  S  T  E  A  M    L  O  C  O  |', class: 'text-yellow-400' },
    { text: ' |_______________________________|', class: 'text-gray-300' },
    { text: '  O   O   O   O   O   O   O   O', class: 'text-gray-300' },
    { text: '', class: 'text-gray-500' },
    { text: 'CHOO CHOO!', class: 'text-yellow-400' },
  ],
  cowsay: (args) => {
    const text = args.join(' ') || 'Moo!';
    const len = text.length;
    const border = '_'.repeat(len + 2);
    const dash = '-'.repeat(len + 2);
    return [
      { text: ` ${border}`, class: 'text-gray-300' },
      { text: `< ${text} >`, class: 'text-gray-300' },
      { text: ` ${dash}`, class: 'text-gray-300' },
      { text: '        \\   ^__^', class: 'text-gray-300' },
      { text: '         \\  (oo)\\_______', class: 'text-gray-300' },
      { text: '            (__)\\       )\\/\\', class: 'text-gray-300' },
      { text: '                ||----w |', class: 'text-gray-300' },
      { text: '                ||     ||', class: 'text-gray-300' },
    ];
  },
  fortune: () => {
    const quotes = [
      '代码就像幽默。当你需要解释它时，它就很糟糕了。',
      '世上有 10 种人：懂二进制的和不懂的。',
      '为什么程序员喜欢暗色模式？因为光会吸引虫子。',
      '一个 SQL 查询走进酒吧，走到两张桌子前问：我能 JOIN 你们吗？',
      '调试代码比写代码难一倍。如果你写得尽可能聪明，你就没能力调试它。',
      '最好的错误信息是永远不会出现的那个。',
      '代码不撒谎，注释有时会。',
      '修复一个 bug 引入两个新 bug，这就是软件工程。',
      '如果调试是消除 bug 的过程，那编程就是引入 bug 的过程。',
      '我不是懒，我是在节能模式。',
    ];
    return [{ text: quotes[Math.floor(Math.random() * quotes.length)], class: 'text-yellow-400' }];
  },
  matrix: () => {
    const chars = '0101010123456789ABCDEF';
    let frame = 0;
    function rainFrame() {
      if (frame >= 4) {
        visibleLines.value.push({ text: 'Wake up, Neo... The 404 has you.', class: 'text-green-400' });
        scrollToBottom();
        return;
      }
      for (let i = 0; i < 2; i++) {
        let line = '';
        for (let j = 0; j < 36; j++) {
          line += chars[Math.floor(Math.random() * chars.length)];
        }
        visibleLines.value.push({ text: line, class: 'text-green-400' });
      }
      scrollToBottom();
      frame++;
      setTimeout(rainFrame, 150);
    }
    rainFrame();
    return [{ text: 'Entering the Matrix...', class: 'text-green-400' }];
  },
};

function executeCommand() {
  const input = currentInput.value.trim();
  if (!input) return;

  visibleLines.value.push({ text: input, prompt: true, class: 'text-gray-200' });
  commandHistory.value.push(input);
  historyIndex = -1;
  currentInput.value = '';

  const [cmd, ...args] = input.split(/\s+/);
  const handler = commands[cmd.toLowerCase()];

  if (handler) {
    const output = handler(args);
    visibleLines.value.push(...output);
  } else {
    visibleLines.value.push({ text: `${cmd}: command not found. 输入 help 查看可用命令。`, class: 'text-red-400' });
  }

  scrollToBottom();
}

// Tab 补全
const availableFiles = ['readme.md', '404.txt', 'home'];

function handleTab() {
  const input = currentInput.value;
  const parts = input.split(/\s+/);

  if (parts.length === 1) {
    const partial = parts[0].toLowerCase();
    if (!partial) return;
    const matches = Object.keys(commands).filter(cmd => cmd.startsWith(partial));
    if (matches.length === 1) {
      currentInput.value = matches[0] + ' ';
    } else if (matches.length > 1) {
      visibleLines.value.push({ text: matches.join('  '), class: 'text-gray-400' });
      scrollToBottom();
    }
  } else {
    const partial = parts[parts.length - 1];
    const matches = availableFiles.filter(f => f.startsWith(partial));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      currentInput.value = parts.join(' ') + ' ';
    } else if (matches.length > 1) {
      visibleLines.value.push({ text: matches.join('  '), class: 'text-gray-400' });
      scrollToBottom();
    }
  }
}

// 初始 404 错误信息
const terminalLines: TerminalLine[] = [
  { text: 'ls /requested/page', prompt: true, class: 'text-gray-300' },
  { text: "ls: cannot access '/requested/page': No such file or directory", class: 'text-red-400' },
  { text: '', class: 'text-gray-500' },
  { text: '# 404 - 页面不存在或已被移除', class: 'text-gray-500' },
  { text: '# 输入 help 查看可用命令', class: 'text-cyan-400' },
];

function startTyping() {
  let lineIndex = 0;
  let charIndex = 0;

  function typeNext() {
    if (lineIndex >= terminalLines.length) {
      allTyped.value = true;
      nextTick(() => focusInput());
      return;
    }

    const line = terminalLines[lineIndex];

    if (charIndex === 0) {
      visibleLines.value.push({ ...line, text: '' });
      scrollToBottom();
    }

    if (charIndex < line.text.length) {
      visibleLines.value[lineIndex].text = line.text.slice(0, charIndex + 1);
      charIndex++;
      setTimeout(typeNext, 3 + Math.random() * 7);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNext, 30);
    }
  }

  typeNext();
}

onMounted(() => {
  startTyping();
});
</script>

<style scoped>
.terminal-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}
.terminal-scroll::-webkit-scrollbar {
  width: 6px;
}
.terminal-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.terminal-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}
.terminal-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
