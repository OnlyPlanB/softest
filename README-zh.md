# softest

![build status](https://travis-ci.org/prprprus/softest.svg?branch=master)
[![Known Vulnerabilities](https://snyk.io//test/github/prprprus/softest/badge.svg?targetFile=package.json)](https://snyk.io//test/github/prprprus/softest?targetFile=package.json)
[![](https://img.shields.io/badge/npm-6.10.2-orange)]()
[![license](https://img.shields.io/badge/license-license-yellow.svg)](./LICENSE)
[![](https://img.shields.io/badge/EN-%E8%8B%B1%E6%96%87-%09%236495ED.svg)](./README.md)

softest 是用于录制浏览器交互并生成测试脚本的测试工具，简单实用。让你不用写一行代码就可以得到测试脚本。

[![Watch the video](https://raw.githubusercontent.com/prprprus/picture/master/softest2.png)](https://www.bilibili.com/video/av64092242/)

## 项目来由

当我需要一个能够根据浏览器交互操作自动生成对应代码的工具时，找到了 [puppeteer-recorder](https://github.com/checkly/puppeteer-recorder) 和 [Selenium IDE](https://www.seleniumhq.org/selenium-ide/)，他们当然都是非常优秀的项目。但是在实际的使用中发现它们只能单 tab 录制，不支持多 tab，也不支持截图等功能，而且 Selenium IDE 在回放脚本时总是报错（应该是对滚动操作支持的问题），所以就自己造了个轮子。

## 功能

#### 支持的功能

- 单标签页录制
- 多标签页录制
- 屏幕截图
- 生成测试脚本
- 下载测试报告（包括截图和测试脚本）

#### 支持的浏览器交互

- 点击
- 新建标签页
- 关闭标签页
- 修改地址栏
- 输入
- 滚动页面

标签页切换规则：暂时不支持用户手动的跨标签页切换操作。例如，现在打开了 3 个标签页，当前所在第三个标签页 tab3，此时就不可以手动地切换到 tab2 或者 tab1，因为这样会造成录制的不一致。但是你可以通过关闭 tab3 的方式回到 tab2，再关闭 tab2 回到 tab1。

## 安装

#### 依赖

- Node >= v10.16.3 (推荐 v12.8.0)
- Npm (推荐 6.10.2)

```
$ npm i -g softest
```

softest 是基于 Puppeteer 构建的，而下载 Puppeteer 的时候会默认安装 Chromium。如果你在执行上面命令的时候看到下图，并且由于各种原因无法下载到 Chromium 的话，可以到[这里](https://pan.baidu.com/s/1-ejd6EsOrcYGNCrzbj1hYw)下载，提取码 4vxu。

![](https://raw.githubusercontent.com/prprprus/picture/master/softest3.png)

## 使用

为了方便命令的执行，建议添加环境变量：

```
$ export PATH=$PATH:$HOME/.npm-global/bin
```

`softest` 只有少量的参数：

```
$ softest --help
Usage: index [options]

Options:
  -h, --host <hostname>  Server hostname, optional. (default: "127.0.0.1")
  -p, --port <port>      Server port, optional. (default: 2333)
  -c, --chromium <path>  The absolute path of the chromium execution file, necessary.
  -r, --report <path>    The absolute path of the test report, necessary.
  -h, --help             output usage information
```

运行 `softest` 需要指定 Chromium 所在的目录，并且指定保存测试报告的目录（绝对路径）。

```
$ soft -c PATH_CHROMIUM -r PATH_REPORT
```

> 如果你不清楚 Chromium 在哪个目录，可以启动 Chromium，在地址栏处输入 `chrome://version/` 就可以找到它的可执行文件所在的目录。

如果你看到类似如下的输出，那么恭喜你成功了 🎉🎉🎉👏

```
 _______  _______  _______  _______  _______  _______  _______
|       ||       ||       ||       ||       ||       ||       |     status: running
|  _____||   _   ||    ___||_     _||    ___||  _____||_     _|     host: 127.0.0.1
| |_____ |  | |  ||   |___   |   |  |   |___ | |_____   |   |       port: 2333
|_____  ||  |_|  ||    ___|  |   |  |    ___||_____  |  |   |
 _____| ||       ||   |      |   |  |   |___  _____| |  |   |
|_______||_______||___|      |___|  |_______||_______|  |___|

🎉 Running WebSocket server successfully

🎉 Running HTTP server successfully
```

打开浏览器，输入 `host` 和 `port`，你会看到如下的 web 界面：

![](https://raw.githubusercontent.com/prprprus/picture/master/softest1.png)

## 贡献

非常感谢你对 softest 的关注，你的帮助对我来说非常重要，欢迎 Star ⭐、Fork、提交 Issue 或者 PR，谢谢！😁😘🎁🎉

## License

详细信息请参考 [LICENSE](./LICENSE)。
