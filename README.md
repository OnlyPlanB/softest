### 功能介绍

- 录制并自动生成测试脚本
- 支持单 tab、多 tab 录制
- 支持浏览器前进后退操作(todo)
- 播放测试脚本
- 查看测试报告（可配置发邮箱）
- 保存脚本、上传脚本

---

### 数据源

监听 --> 坐标 --> 元素 --> xpath

---

### UI

- 按钮

  - target url
  - 开始录制
  - 截图
  - 结束录制
  - 重播
  - 查看报告
  - 保存脚本
  - 上传脚本

- 脚本编辑区

---

### 流程-迭代 1

#### 录制

启动录制器 --> web 界面打开 --> 点击「target url」--> 输入 url, 点击确认 --> 点击「开始录制」--> chromium 启动, 用户操作 --> （点击「截图」）--> 翻译用户操作 --> 实时显示 --> 点击「结束录制」

#### 播放

点击「播放」--> 执行录制脚本 --> chromium 启动, 开始自动测试 --> 用户观看操作 --> 结束

#### 查看测试报告

点击「查看报告」--> web 界面打开 --> （显示截图结果）

#### 保存脚本

点击「保存脚本」--> 录制脚本被下载到本地

#### 上传脚本

- todo

---

### 技术细节

#### 架构组成

- N1: 用户行为捕获服务 demo.js、WebSocket client
- N2: WebSocket proxy server
- N3: HTTP server
- N4: 页面中的 WebSocket client

数据的流向：N1 --> N2 --> N4

#### 启动录制器

- 以一条命令的方式启动录制器
- 启动 N2
- 启动 N3

#### web 界面打开

- 自动打开，渲染页面和启动 N4

#### 点击「target url」--> 输入 url, 点击确认

- url 写入文件保存

#### 点击「开始录制」

- 生成新的代码模版到脚本编辑区
- 从文件中读取 url 并启动 N1

#### chromium 启动, 用户操作

- N1 捕获用户行为 --> 翻译成代码 --> N2 --> N4 --> 操作页面实时显示到脚本编辑区
- 监听事件：click（过滤无效的点击）、keyboard up（对同一个控件的输入要覆盖）、前进/后退(todo)、关闭/打开页面
- 翻译时需要注意跳转之间的区别
  - target self: url change（单纯的 click）
  - target blank: targetcreated + popup（单纯的 click）
  - 手动 new tab, 输入网址: targetcreated（newPage(url)）
- 过滤无效点击
- 将用户行为翻译成脚本

#### 点击「结束录制」

- N1 退出
