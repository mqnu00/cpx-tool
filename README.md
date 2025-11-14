# Tool Suite

一个基于 Vue 3 + TypeScript 的模块化工具套件平台，支持插件化扩展和用户权限管理。

## 📑 目录

- [技术栈](#技术栈)
- [项目特性](#项目特性)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [插件系统](#插件系统)
- [用户权限](#用户权限)
- [开发指南](#开发指南)

## 🛠️ 技术栈

### 核心框架
- **[Vue 3](https://vuejs.org/)** `^3.3.13` - 渐进式 JavaScript 框架
- **[TypeScript](https://www.typescriptlang.org/)** `~5.3.3` - JavaScript 的超集，提供类型安全
- **[Vite](https://vitejs.dev/)** `^5.0.12` - 下一代前端构建工具

### 状态管理与路由
- **[Pinia](https://pinia.vuejs.org/)** `^2.1.7` - Vue 官方推荐的状态管理库
- **[Vue Router](https://router.vuejs.org/)** `^4.3.3` - Vue.js 官方路由管理器

### UI 组件库
- **[Naive UI](https://www.naiveui.com/)** `^2.38.1` - 一个 Vue 3 组件库

### 开发工具
- **[vue-tsc](https://github.com/vuejs/language-tools)** `^1.8.27` - Vue 的 TypeScript 类型检查工具
- **[ESLint](https://eslint.org/)** `^8.56.0` - JavaScript/TypeScript 代码检查工具
  - `@typescript-eslint/eslint-plugin` - TypeScript ESLint 插件
  - `eslint-plugin-vue` - Vue.js ESLint 插件
  - `@vue/eslint-config-typescript` - Vue TypeScript ESLint 配置

## ✨ 项目特性

### 🔌 插件化架构
- **动态插件系统**：支持插件的注册、启用和禁用
- **模块化设计**：每个插件作为独立模块开发，互不干扰
- **热插拔支持**：可在运行时动态加载和卸载插件

### 👥 用户权限管理
- **角色系统**：支持 `admin`（管理员）和 `user`（普通用户）两种角色
- **权限控制**：基于角色的路由访问控制
- **管理后台**：管理员可访问专属的管理页面

### 🧩 内置插件

#### 1. 用户管理插件 (User Admin)
- 管理用户账户和权限
- 配置用户访问级别
- 用户信息的增删改查

#### 2. 焦距裁切插件 (Focal Crop)
- 读取 JPEG 图片的 EXIF 元数据
- 提取焦距、ISO、光圈等摄影参数
- 根据焦距模拟图像裁切效果

## 📁 项目结构

```
tool-suite/
├── src/
│   ├── plugins/              # 插件系统
│   │   ├── types.ts          # 插件类型定义
│   │   ├── index.ts          # 插件初始化和注册
│   │   ├── user-admin/       # 用户管理插件
│   │   │   ├── index.ts      # 插件配置
│   │   │   └── UserAdmin.vue # 插件组件
│   │   └── focal-crop/       # 焦距裁切插件
│   │       ├── index.ts      # 插件配置
│   │       └── FocalCrop.vue # 插件组件
│   ├── stores/               # Pinia 状态管理
│   │   ├── user.ts           # 用户状态管理
│   │   └── plugin.ts         # 插件状态管理
│   ├── router/               # Vue Router 路由配置
│   │   └── index.ts          # 路由定义和导航守卫
│   ├── views/                # 页面组件
│   │   ├── Home.vue          # 首页
│   │   ├── Admin.vue         # 管理页面
│   │   └── PluginDetail.vue  # 插件详情页
│   ├── App.vue               # 根组件
│   ├── main.ts               # 应用入口
│   └── style.css             # 全局样式
├── index.html                # HTML 模板
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
├── .eslintrc.cjs             # ESLint 配置
└── package.json              # 项目依赖配置
```

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

启动开发服务器，支持热模块替换 (HMR)：

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 生产构建

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

### 代码检查

#### TypeScript 类型检查

```bash
npm run type-check
```

#### ESLint 代码检查

```bash
npm run lint
```

## 🔌 插件系统

### 插件结构

每个插件都是一个独立的模块，包含以下文件：

```
plugin-name/
├── index.ts          # 插件配置导出
└── PluginName.vue    # 插件 UI 组件
```

### 插件配置接口

```typescript
interface PluginModule {
  id: string              // 插件唯一标识
  name: string            // 插件名称
  title: string           // 插件标题
  description: string     // 插件描述
  icon?: string           // 插件图标（Emoji）
  component: any          // 插件 Vue 组件
  version: string         // 插件版本
}
```

### 创建新插件

1. **创建插件目录**

```bash
mkdir -p src/plugins/my-plugin
```

2. **创建插件配置** (`src/plugins/my-plugin/index.ts`)

```typescript
import type { PluginModule } from '../types'
import MyPlugin from './MyPlugin.vue'

const myPlugin: PluginModule = {
  id: 'my-plugin',
  name: 'My Plugin',
  title: '我的插件',
  description: '这是一个示例插件',
  icon: '🔧',
  component: MyPlugin,
  version: '1.0.0'
}

export default myPlugin
```

3. **创建插件组件** (`src/plugins/my-plugin/MyPlugin.vue`)

```vue
<script setup lang="ts">
// 插件逻辑
</script>

<template>
  <div>
    <h2>我的插件</h2>
    <!-- 插件内容 -->
  </div>
</template>
```

4. **注册插件** (`src/plugins/index.ts`)

```typescript
import myPlugin from './my-plugin'

export function initializePlugins() {
  const pluginStore = usePluginStore()
  
  pluginStore.registerPlugin({
    ...myPlugin,
    enabled: true
  })
}
```

### 插件 API

```typescript
import { usePluginStore } from '@/stores/plugin'

const pluginStore = usePluginStore()

// 注册插件
pluginStore.registerPlugin(pluginConfig)

// 启用插件
pluginStore.enablePlugin('plugin-id')

// 禁用插件
pluginStore.disablePlugin('plugin-id')

// 获取所有启用的插件
const enabledPlugins = pluginStore.getEnabledPlugins()

// 获取所有插件
const allPlugins = pluginStore.getAllPlugins()
```

## 👥 用户权限

### 角色类型

```typescript
type Role = 'user' | 'admin'
```

- **admin**: 管理员，可访问所有页面和功能
- **user**: 普通用户，访问受限

### 用户 Store API

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 获取当前用户
const currentUser = userStore.currentUser

// 检查是否为管理员
const isAdmin = userStore.isAdmin

// 登录
userStore.login({ id: '1', name: 'Admin', role: 'admin' })

// 退出登录
userStore.logout()
```

### 路由权限控制

在路由配置中使用 `meta.requiresAdmin` 标记需要管理员权限的路由：

```typescript
{
  path: '/admin',
  component: () => import('@/views/Admin.vue'),
  meta: { requiresAdmin: true }
}
```

路由守卫会自动拦截未授权的访问。

## 📝 开发指南

### 代码规范

- 使用 **TypeScript** 编写所有源代码
- 遵循 **ESLint** 配置的代码规范
- Vue 组件使用 **`<script setup>`** 语法
- 使用 **Pinia** 组合式 API 编写状态管理

### 导入别名

项目配置了 `@` 别名指向 `src` 目录：

```typescript
import { useUserStore } from '@/stores/user'
import MyComponent from '@/components/MyComponent.vue'
```

### 组件开发

推荐使用 Vue 3 的组合式 API 和 `<script setup>` 语法：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### 样式开发

- 全局样式在 `src/style.css`
- 组件样式使用 `<style scoped>`
- 支持 CSS 预处理器（需安装相应依赖）

## 📄 许可证

本项目为私有项目 (private: true)。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**Tool Suite** - 让工具开发更简单 🚀
