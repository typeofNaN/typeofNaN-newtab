# 清新新标签页

一个简洁美观的 Chrome 新标签页扩展，替换浏览器默认新标签页为清新风格的自定义页面。

## 功能特性

- **数字时钟** - 超大响应式字体，纤细优雅
- **时段问候语** - 根据时间显示中文问候
- **壁纸切换** - 基于 Picsum 的随机壁纸，点击风车图标切换
- **多引擎搜索** - 支持 百度/Google/Bing，点击图标切换
- **快捷链接** - 常用网站快捷入口，支持添加/删除
- **毛玻璃效果** - 现代化的 UI 设计

## 技术栈

- **构建工具**: Vite 6
- **前端框架**: React 19 + TypeScript
- **样式方案**: TailwindCSS 3
- **Chrome 扩展**: Manifest V3 + @crxjs/vite-plugin
- **代码规范**: ESLint 9 (flat config) + Prettier 3
- **包管理器**: pnpm

## 项目结构

```
chrome-ext/
├── public/
│   └── icons/                 # 扩展图标
├── src/
│   ├── components/
│   │   ├── Clock.tsx          # 数字时钟
│   │   ├── SearchBar.tsx      # 搜索栏
│   │   ├── QuickLinks.tsx     # 快捷链接
│   │   └── WallpaperButton.tsx# 壁纸切换按钮
│   ├── hooks/
│   │   ├── useBackground.ts   # 渐变背景
│   │   ├── useGreeting.ts     # 时段问候
│   │   ├── useWallpaper.ts    # 壁纸管理
│   │   └── useQuickLinks.ts   # 快捷链接管理
│   ├── utils/
│   │   ├── storage.ts         # 存储兼容层
│   │   └── favicon.tsx        # 网站图标组件
│   ├── types/
│   │   └── index.ts           # 类型定义
│   ├── App.tsx                # 根组件
│   ├── main.tsx               # 入口文件
│   └── index.css              # 全局样式
├── manifest.json              # Chrome 扩展配置
├── vite.config.ts             # Vite 配置
├── tailwind.config.ts         # TailwindCSS 配置
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

| 命令          | 说明                       |
| ------------- | -------------------------- |
| `pnpm dev`    | 启动开发服务器，支持热更新 |
| `pnpm build`  | 构建生产版本               |
| `pnpm lint`   | 运行 ESLint 检查           |
| `pnpm format` | 使用 Prettier 格式化代码   |

## 许可证

MIT
