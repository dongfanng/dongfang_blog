# ui-collapse-panel Specification

## Purpose

定义全站可复用的流式折叠面板组件类（`.collapse-panel`）的展开/收起状态约定、自适应高度过渡、减少动效降级以及无障碍交互规范，便于导航抽屉、目录折叠、归档分组等多处 UI 统一复用。

## Requirements

### Requirement: 折叠面板通过统一状态属性控制展开与收起

全站流式折叠面板 SHALL 通过统一组件类（`.collapse-panel`）与 `data-open` 状态属性控制展开与收起：当未设置 `data-open="true"` 时，面板 SHALL 折叠至高度 `0`、呈透明不可见状态且不响应指针事件；当设置 `data-open="true"` 时，面板 SHALL 平滑展开至内容的自然高度、完全不透明且恢复交互，无需硬编码最大高度。

#### Scenario: 默认收起状态下内容不占位且不可点击

- **WHEN** 使用 `.collapse-panel` 的面板处于默认收起状态（`data-open="false"` 或未设置 `data-open="true"`）
- **THEN** 面板垂直高度收缩为 `0`，内容被裁切且不可见，也不拦截下方页面元素的点击或触摸事件

#### Scenario: 切换为展开状态时自适应内容高度平滑展开

- **WHEN** 面板状态切换为 `data-open="true"`（包括内部嵌套另一层折叠面板继续展开的场景）
- **THEN** 面板平滑过渡至实际内容的自然高度并淡入显示，内容不被截断，也不依赖固定的 `max-height` 数值

### Requirement: 折叠面板遵循减少动效偏好并支持工具类覆写

折叠面板的默认过渡时长与缓动节奏 SHALL 保持轻快克制（约 `150ms–200ms`），并 SHALL 在组件样式层中声明以允许调用方使用原子样式类按需覆写时长、响应断点或边框过渡；当用户系统开启 `prefers-reduced-motion: reduce` 时，面板 SHALL 禁用过渡动画并即时切换状态。

#### Scenario: 系统开启减少动效时即时切换

- **WHEN** 用户设备或浏览器启用了 `prefers-reduced-motion: reduce` 并触发折叠面板展开或收起
- **THEN** 面板状态立即切换完成，不播放高度与透明度过渡动画

#### Scenario: 调用方按需覆写时长与附加过渡属性

- **WHEN** 调用方在 `.collapse-panel` 元素上附加自定义时长类（如 `duration-200`）或断点显隐类（如 `sm:hidden`）
- **THEN** 调用方附加的样式正常生效且不与 `.collapse-panel` 产生优先级冲突

### Requirement: 折叠面板收起时阻止键盘聚焦与读屏误读

当使用 `.collapse-panel` 的交互面板处于收起状态时，控制逻辑 SHALL 同步维护 `aria-hidden="true"` 与 `inert` 属性；展开时 SHALL 同步切换为 `aria-hidden="false"` 并移除 `inert`，确保收起状态下的内部链接或按钮无法被键盘 `Tab` 键误聚焦。

#### Scenario: 收起状态下键盘焦点跳过隐藏链接

- **WHEN** 折叠面板处于收起状态，用户通过键盘 `Tab` 键顺序浏览页面
- **THEN** 焦点不会落入已收起面板内部的任何链接或按钮；面板展开后内部交互元素恢复正常键盘可达性
