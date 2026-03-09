# 清新新标签页

一个简洁美观的 Chrome 新标签页扩展，替换浏览器默认新标签页为清新风格的自定义页面。

![Preview](preview.png)

## 功能特性

### 核心功能

- **数字时钟** - 超大响应式字体，支持 12/24 小时制切换
- **时段问候语** - 根据时间显示问候语，支持中英文
- **壁纸切换** - 基于 Picsum 的随机壁纸，点击风车图标切换
- **多引擎搜索** - 支持 百度/Google/Bing，可设置默认引擎
- **快捷链接** - 常用网站快捷入口，支持添加/编辑/删除/拖拽排序

### 个性化设置

- **默认搜索引擎** - 设置默认使用的搜索引擎
- **搜索框大小** - 小/中/大 三档可选
- **图标大小** - 快捷链接图标尺寸调整
- **时间格式** - 12 小时制或 24 小时制
- **主题色** - 橙色主题 (#F97D1C)，应用于图标、搜索框聚焦态等

### 交互特性

- **设置抽屉** - 右下角齿轮图标打开设置面板
- **右键菜单** - 右键点击快捷链接可编辑或删除
- **拖拽排序** - 编辑模式下可拖拽调整快捷链接顺序
- **国际化** - 支持中文/英文切换，默认中文
- **毛玻璃效果** - 现代化的磨砂玻璃 UI 设计
- **文字阴影** - 自动添加阴影确保在任意背景下清晰可见
- **自动保存** - 设置实时保存，无需手动确认

## 技术栈

- **构建工具**: Vite 6
- **前端框架**: React 19 + TypeScript
- **样式方案**: TailwindCSS 3
- **拖拽功能**: @dnd-kit/core + @dnd-kit/sortable
- **图标库**: @iconify/react
- **Chrome 扩展**: Manifest V3 + @crxjs/vite-plugin
- **代码规范**: ESLint 9 (flat config) + Prettier 3
- **包管理器**: pnpm
- **图标生成**: Node.js 原生 Canvas (PNG)

## 项目结构

```
chrome-ext/
├── public/
│   └── icons/                    # 扩展图标 (自动生成)
├── scripts/
│   └── generate-icons.ts         # 扩展图标生成脚本
├── src/
│   ├── components/
│   │   ├── Clock.tsx             # 数字时钟
│   │   ├── SearchBar.tsx         # 搜索栏
│   │   ├── QuickLinks.tsx        # 快捷链接
│   │   ├── WallpaperButton.tsx   # 壁纸切换按钮
│   │   ├── LanguageSwitcher.tsx   # 语言切换按钮
│   │   └── SettingsDrawer.tsx     # 设置抽屉
│   ├── context/
│   │   └── SettingsContext.tsx   # 设置状态管理
│   ├── hooks/
│   │   ├── useBackground.ts       # 渐变背景
│   │   ├── useGreeting.ts         # 时段问候
│   │   ├── useWallpaper.ts        # 壁纸管理
│   │   ├── useQuickLinks.ts       # 快捷链接管理
│   │   └── useSettings.ts         # 设置管理
│   ├── i18n/
│   │   ├── context.tsx           # 国际化 Context
│   │   └── translations.ts        # 翻译文件
│   ├── utils/
│   │   ├── storage.ts            # 存储兼容层
│   │   └── favicon.tsx           # 网站图标组件
│   ├── types/
│   │   ├── index.ts              # 类型定义
│   │   └── settings.ts           # 设置类型定义
│   ├── App.tsx                   # 根组件
│   ├── main.tsx                  # 入口文件
│   └── index.css                 # 全局样式
├── manifest.json                 # Chrome 扩展配置
├── vite.config.ts                # Vite 配置
├── tailwind.config.ts            # TailwindCSS 配置
└── package.json
```

## 安装使用

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 开发模式

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

开发模式下，在 Chrome 浏览器中：

1. 打开 `chrome://extensions/`
2. 开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择项目的 `dist/` 目录

修改代码后会自动热更新。

### 生产构建

```bash
# 构建生产版本
pnpm build
```

构建产物位于 `dist/` 目录，可直接加载到 Chrome。

## 开发命令

| 命令                  | 说明                       |
| --------------------- | -------------------------- |
| `pnpm dev`            | 启动开发服务器，支持热更新 |
| `pnpm build`          | 构建生产版本               |
| `pnpm lint`           | 运行 ESLint 检查           |
| `pnpm format`         | 使用 Prettier 格式化代码   |
| `pnpm preview`        | 预览生产构建               |
| `pnpm generate-icons` | 重新生成扩展图标           |

## 使用说明

### 快捷链接管理

- **添加**: 点击「+」按钮添加新链接
- **编辑**: 右键点击链接选择「编辑」，或进入编辑模式
- **删除**: 右键点击链接选择「删除」，或在编辑模式下点击「×」
- **排序**: 点击「编辑」进入编辑模式，拖拽调整顺序

### 设置面板

点击右下角的齿轮图标打开设置抽屉，可配置：

- 默认搜索引擎
- 搜索框大小
- 快捷链接图标大小
- 时间显示格式

### 搜索引擎切换

点击搜索框左侧的图标，可在 百度/Google/Bing 之间临时切换，默认引擎可在设置中配置。

### 壁纸切换

点击右上角的风车图标，随机切换壁纸。

### 语言切换

点击右上角的翻译图标，在中英文之间切换。

## 自定义配置

### 修改默认快捷链接

编辑 `src/hooks/useQuickLinks.ts` 中的 `defaultLinks` 数组：

```typescript
const defaultLinks: QuickLink[] = [
  { id: '1', title: 'Google', url: 'https://www.google.com' },
  // 添加更多...
]
```

### 修改默认设置

编辑 `src/types/settings.ts` 中的 `defaultSettings` 对象：

```typescript
export const defaultSettings: Settings = {
  defaultSearchEngine: 'baidu',
  searchBarSize: 'md',
  linkIconSize: 'md',
  timeFormat: '24',
}
```

### 修改主题色

编辑 `tailwind.config.ts` 中的 `colors.primary`：

```typescript
colors: {
  primary: {
    DEFAULT: '#F97D1C',  // 修改主题色
    // ...其他色阶会自动调整
  },
},
```

修改后运行以下命令重新生成扩展图标：

```bash
pnpm generate-icons
```

### 修改问候语

编辑 `src/i18n/translations.ts` 中的翻译文本。

### 添加搜索引擎

编辑 `src/components/SearchBar.tsx` 中的 `searchEngines` 对象。

## 数据存储

所有用户数据存储在 Chrome 扩展的本地存储中：

- `quick_links` - 快捷链接数据
- `wallpaper` - 当前壁纸 URL
- `language` - 语言设置
- `settings` - 用户设置（搜索引擎、大小、时间格式等）

## 发布流程

本项目使用 GitHub Actions 自动发布。当你推送一个新的 git tag 时，会自动构建并发布到 GitHub Releases。

### 发布步骤

1. 更新 `package.json` 中的版本号
2. 创建并推送 tag：
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. GitHub Actions 会自动构建并创建 Release，包含：
   - `chrome-extension-v1.0.0.zip` - 扩展打包文件，可解压后加载到 Chrome

### CRX 文件（可选）

如需生成 CRX 文件，需要在仓库的 Settings -> Secrets and variables -> Actions 中添加：

- `CRX_PRIVATE_KEY`: PEM 格式的私钥（用于签名 CRX 文件）

生成私钥：

```bash
openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out private_key.pem
```

## 许可证

MIT
