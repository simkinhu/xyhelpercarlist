## 属Xyhelper下项目ChatGPT-Share-Server前端主题 
项目地址：[chatgpt-share-server](https://github.com/xyhelper/chatgpt-share-server) 感谢xyhelper大佬的辛勤付出，敬礼！！！


## 基于Naiveui制作的ChatGPT-share 前端界面，代码全开源

开源不易，如果可以的话请给个Star小星星，感激不尽！
无需编译，在 "chatgpt-share" 目录下执行以下脚本即可，源码已开源可随意更改。
默认加载48条数据，下拉滚动加载，/src/components/index.vue 第45行可自行更改加载条数。
提示：执行过后list目录下都会删除，请做好备份，docker有无映射目录都不影响。

## Update

2024-01-22 更新横排五个，避免显示时长的时候穿模！
2024-03-24 更新简单UI，仿伊利斯UI（虽然不像）！

2024-03-26 更新宽度为1280,调整横向排列个数为6，容纳更多，更新车辆排序（3.5在前,Plus再后)，更新提示字符：去除"TEAM/plus/停运｜"等字符，使提示文字一行显示，圆点显示更明显！

2024-03-27 增加进度条与颜色修改！

2024-03-28 修改UI颜色，增加自动深浅模式，修改进度条；

2024-03-29 添加骨架屏，修改4.0提示颜色更显眼黄色；

2024-04-19 高仿伊利斯，伊利斯UI，行业设计标杆哇！


## 一键快速替换前端页面(需要进入到share的根目录执行）：
```shell
curl -sSfL https://raw.githubusercontent.com/simkinhu/xyhelpercarlist/master/quick-install/quick-list.sh | bash
```

## 公告配置
在管理后台-系统设置-参数配置-参数列表中新增参数notice，值为公告内容，支持 html 标签

![Image text](https://chatgpt-share-server.xyhelper.cn/assets/notice1-U7IuKWIa.png)
![Image text](https://chatgpt-share-server.xyhelper.cn/assets/notice2-umTyfMe7.png)

### 使用前端框架
```html
https://www.naiveui.com/
```
### 编译项目
```sh
npm install
```

### 运行项目

```sh
npm run dev
```

### 项目打包

```sh
npm run build
```
