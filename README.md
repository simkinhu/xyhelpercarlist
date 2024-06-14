## 属Xyhelper下项目ChatGPT-Share-Server前端主题 
项目地址：[chatgpt-share-server](https://github.com/xyhelper/chatgpt-share-server) 感谢xyhelper大佬的辛勤付出，敬礼！！！

## 基于Naiveui制作的ChatGPT-share 前端界面，代码全开源

开源不易，如果可以的话请给个Star小星星，感激不尽！
无需编译，在 "chatgpt-share" 目录下执行以下脚本即可，源码已开源可随意更改。
默认加载48条数据，下拉滚动加载，/src/components/index.vue 第45行可自行更改加载条数。
提示：执行过后list目录下都会删除，请做好备份，docker有无映射目录都不影响。

# ShareFlow Admin（付费版本）

## 技术架构
- **后端**：JAVA （JDK17）
- **前端**：VUE3

## 部署方式
- **后端**：通过Docker拉取镜像
- **前端**：一键脚本替换list

## 付费版介绍
详细介绍请参阅 [ShareFlow Admin 付费版介绍](https://mxlizdp0t8q.feishu.cn/docx/NjBZdHwr9ocMJMxOmXlcVxCqn0f?from=from_copylink)

## 演示站
- **前端**： [演示站前端](https://swg.3377ai.com/list)
- **后端**： [演示站后端](https://sadmin.3377ai.com/shareadmin)
  - **演示后台账户**：`admin`
  - **演示后台密码**：`admin123`

- 

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
