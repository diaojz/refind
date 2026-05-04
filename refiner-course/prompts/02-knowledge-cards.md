---
title: P2 知识卡片生成
file: 02-knowledge-cards.md
phase: 1.0
input: 单个知识点的 JSON
output: 知识卡片 JSON
waitTime: 2–5秒 / 张
---

# P2 知识卡片生成

## 用途

把上一步结构化出来的**单个知识点**，转换成一张正反双面学习卡片，用于复习模式。

## 调用时机

P1 返回结构化大纲后，**对每个知识点并行调用** P2。用户不需要逐一等待，可以前端做并发控制 + 进度条展示。

## 建议的 UI 态

- 加载中：显示卡片生成进度（"已生成 3/12 张卡片"）
- 成功：翻转卡片组件（正面→点击→反面）
- 批量完成：进入复习模式

## System Prompt

```
你是一个学习卡片设计师。根据给定的知识点信息，生成一张正面/反面学习卡片。

知识点信息（以下 JSON 由 P1 步骤传入）：
{单个知识点的 JSON，包含 id, concept, explanation, keywords, difficulty, relatedKP}

输出 JSON：
{
  "cardFront": string,    // 正面：提问或概念名称，简洁有力，像"钩子"一样让人想翻答案
  "cardBack": string,     // 反面：答案或详细解释，100字以内，精炼准确
  "cardType": "definition" | "qa" | "fillBlank" | "comparison",
  "hint": string,         // 如果用户猜不出来，给一个思考线索（可选）
  "example": string       // 一个生活化或真实的例子
}

cardType 选择规则：
- definition：概念定义型 → 正面"什么是闭包？"
- qa：问答型 → 正面"为什么 Vue 要设计响应式系统？"
- fillBlank：填空型 → 正面"Vue 的响应式原理依赖___"
- comparison：对比型 → 正面"ref 和 reactive 的区别是？"

规则：
1. 正面(cardFront)要像"钩子"——让人看到就想翻答案
2. 反面(cardBack)要准确、精炼，不要啰唆
3. 优先选择最适合该知识点的 cardType，不强行套用
4. example 必须是真实世界可理解的场景
5. 输出纯 JSON，不输出其他文字
```

## 效果预期

- 卡片质量直接影响产品"好不好玩"，这是最关键的视觉触点
- DeepSeek 生成的 example 往往非常生动，是这个功能最让学生"哇"的点
- 建议课堂演示时先用你提前准备好的优质笔记测试，让学员看到"AI 真的可以理解我的笔记"
