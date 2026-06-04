
请你在本项目中实现一个文档渲染与编辑框架，以下是具体要求：

## 实现的功能
1. 定义一种markdown的文件组织形式，以下称作ProDoc
2. 实现一个渲染器将ProDoc渲染为web页面
3. 实现一个编辑器将ProDoc渲染为web页面的同时可以在web页面进行编辑从而修改ProDoc

## cli 
* 拥有命令 echo-prodoc
    * echo-prodoc view <document-path> 
    * echo-prodoc edit <document-path>

## 部署层面:
1. 支持从源代码安装
2. 本项目支持集成发布到npm源

## 渲染支持：
* 支持一般的markdown渲染
    * 实现左侧栏的树状文档index排布
    * 右侧实现markdown渲染
* 支持特殊约定的流程图渲染
    * 定义一个用于表示流程图的特殊的markdown写法
    * 流程中的每一个节点都可以点击进入节点下属的文档
    * 流程图的排布在类似无边画板的ui中

## UI 设计要求
* 整体色调以**黑色**为主
* 卡片呈现**平面上内凹**的样式
* 卡片伴有**柔和的阴影**

## demo/example 设计

* 安排一个按照ProDoc标准组织的document文件夹
* 使用echo-prodoc view可以启动渲染