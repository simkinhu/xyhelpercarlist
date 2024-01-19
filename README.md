## 基于Naiveui制作的ChatGPT-share 前端界面

无需编译，在 "chatgpt-share" 目录下执行以下脚本即可，源码已开源可随意更改。

默认加载48条数据，下拉滚动加载，/src/components/index.vue 第45行可自行更改加载条数。

提示：执行前过后list目录下都会删除，请做好备份，docker有无映射目录都不影响。


## 一键快速替换前端页面：
```shell
curl -sSfL https://raw.githubusercontent.com/simkinhu/xyhelpercarlist/master/quick-install/quick-list.sh | bash
```

![Image text](https://github.com/simkinhu/xyhelpercarlist/blob/master/quick-install/home.jpg?raw=true)



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
