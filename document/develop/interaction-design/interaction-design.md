---
id: interaction-design
title: "交互设计"
x: 675
y: 508
---

# 交互设计

查看器（DocGraphViewer）的完整交互逻辑，全部以流程图展示。

核心原则：**文档文件是画布状态的唯一事实来源**。画布上的一切修改（拖框、增删连线、编辑正文）都走同一个闭环——保存 API 写回源文件，目录监听捕获变更，热更新回推客户端，画布随之重建。图编辑模式下的修改先**暂存为本地覆盖**（画布即时反映），「💾 保存」统一写回，「↩ 放弃更改」整批丢弃。

## 一、视图状态机

查看器有三个稳定状态，地址栏 hash 始终同步当前文档路径：

```prodoc-flow
graph LR
  Canvas[图画布视图] -->|单击框| Doc[正文视图]
  Canvas -->|🛠 编辑图| GraphEdit[图编辑模式]
  GraphEdit -->|✓ 完成 或 ↩ 放弃更改| Canvas
  GraphEdit -->|💾 保存| Persist[写回源文件]
  Persist -->|热更新回推| GraphEdit
  Doc -->|🗺 返回图| Canvas
  Doc -->|✏️ 编辑| Editing[编辑状态]
  Editing -->|👁 预览| Doc
  Editing -->|💾 保存| Persist
GraphEdit @ 227, 135
```

图编辑模式是画布视图的子模式：其中有暂存修改时只能经「💾 保存」（留在编辑模式继续）或「↩ 放弃更改」（丢弃并退出）离开，无暂存时「✓ 完成」退出——未保存的修改不会被悄悄带走。

## 二、图编辑模式

浏览是默认状态；「🛠 编辑图」开启编辑模式后，画布才开放框与连线的编辑能力（此时单击框不再打开文档，避免拖拽误触；分块面板与框上的编辑入口也一并隐藏）。**修改不即时写文件**——所有编辑先暂存为本地覆盖，画布即时反映暂存结果：

```prodoc-flow
graph TB
  Toggle[点 🛠 编辑图] --> Mode[进入图编辑模式]
  Mode --> Drag[拖拽框调整位置]
  Mode --> Handle[连接点拖出创建连线]
  Mode --> Pick[单击连线选中]
  Pick --> SideDrag[拖动端点手柄到目标边，实时预览]
  Pick --> Del[中点 ✕ 或 Delete 删除]
  Drag --> Stage[暂存为本地覆盖，画布即时反映]
  Handle --> Stage
  SideDrag --> Stage
  Del --> Stage
  Stage --> Save[💾 保存：逐文件批量写回，热更新回推]
  Stage --> Abort[↩ 放弃更改：整批丢弃，退出编辑模式]
```

保存以客户端已知的磁盘内容为基准做冲突检测（409 拒绝）；暂存在热更新回推后按内容比对逐项修剪，保存前后画布无闪烁。

## 三、单击与拖拽的判定

框上的指针按下不立即定性，按位移分流——单击打开文档，拖拽修改坐标（拖拽仅在图编辑模式下可用）：

```prodoc-flow
graph TB
  Down[指针按下框] --> Judge{位移达到 3px}
  Judge -->|否| Open[单击：打开文档正文]
  Judge -->|是| Drag[拖拽：按缩放折算位移，实时更新覆盖坐标]
  Drag --> Drop[松手]
  Drop --> Stage[暂存坐标修改（含 writeFramePosition 后的完整内容）]
  Stage --> Save[💾 保存：POST 保存 API]
  Save --> Loop[热更新回推，图重建固定新坐标]
```

拖拽中连线实时跟随（几何基于覆盖坐标计算）；松手瞬间的 click 事件被抑制，不会误打开文档；松手后修改进入暂存，「💾 保存」才写回文件，「↩ 放弃更改」连同位置覆盖一并还原。拖动接近其他框的**左/中/右、上/中/下**特征线时自动吸附并显示对齐参考线。跟手性的三个要点：位置更新收敛到**每帧一次**（rAF 节流）、拖拽期间**禁用框的过渡动画**（过渡只为分层重排服务）、缩放在按下时缓存（避免逐帧强制布局）。

## 四、创建连线

```prodoc-flow
graph TB
  Start[按下框右边中点的连接点] --> Draft[草稿曲线跟随光标]
  Draft --> Up[松手]
  Up --> Hit{命中目标框}
  Hit -->|否| Discard[丢弃草稿]
  Hit -->|是| Valid{非自连且不重复}
  Valid -->|否| Discard
  Valid -->|是| Append[暂存：源文档 link 追加目标 id]
  Append --> Save[💾 保存，热更新回推]
```

连接点仅在图编辑模式下出现。草稿曲线复用边缘中点几何：起点就带法线切向，落点处即最终形态。

## 五、选中与删除连线

```prodoc-flow
graph TB
  Click[单击连线] --> Selected[选中：主色加粗，端点出手柄，中点出 ✕]
  Selected --> How{后续操作}
  How -->|拖动端点手柄| SidePrev[按光标方位实时预览目标边]
  SidePrev -->|松手| Rewrite[暂存：条目第三段更新]
  How -->|点 ✕ 或 Delete| Remove[暂存：从源文档 link 移除匹配条目]
  Rewrite --> Save[💾 保存，热更新回推]
  Remove --> Save
```

连线有一条 14px 宽的透明命中路径，让点选不需要精确命中 2px 的可见曲线；点选仅在图编辑模式下可用。

## 六、编辑与热更新闭环

内置编辑与外部编辑器殊途同归，都汇入目录监听的回推回路：

```prodoc-flow
graph LR
  Inner[内置编辑：Ctrl+S 保存] --> API[POST 保存 API]
  Ext[外部编辑器直接改文件] --> Watch[chokidar 目录监听]
  API --> File[写回源文件]
  File --> Watch
  Watch --> Reload[重载文档，新文件补写自动布局坐标]
  Reload --> Push[WS 推送最新 files]
  Push --> Swap[客户端原地替换，不刷新页面]
  Swap --> Fresh[画布与正文即时更新]
```

## 七、悬停探索

```prodoc-flow
graph LR
  Hover[悬停框] --> HL[上下游链路高亮，其余淡出]
  Hover --> Judge{H2 分块达到 2 个}
  Judge -->|是| Pop[展开分块面板]
  Judge -->|否| Skip[仅高亮]
  Pop --> Jump[点击条目：打开正文并滚动到锚点]
```

## 八、分层重排

```prodoc-flow
graph LR
  Btn[点 🧭 分层重排] --> Calc[computeLayeredLayout 忽略文件坐标]
  Calc --> Cover[全量覆盖坐标，平滑动画移动]
  Cover --> Back[点 ↩ 恢复坐标，还原文件坐标]
  Cover --> Drag[再拖拽单框：只写回该框，其余覆盖保留]
```

重排是纯视图层操作，不写文件；与拖拽编辑可叠加——保存时只写回被拖框的坐标，其余框的覆盖坐标保留在视图层。

## 深入

- [ProDoc 规则定义](../prodoc-rule/prodoc.md) — 文档图模型与参数区语法
- [命令行参考](../../user/cli.md) — 保存 API 与热更新的服务端行为
