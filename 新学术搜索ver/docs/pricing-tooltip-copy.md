# Pricing tooltip 文案规则 / Pricing Tooltip Copy Rules

本文档用于约定 pricing 页 tooltip 的写法，方便后续开发和产品维护。

This document defines the copy rules for pricing-page tooltips so developers and product owners can maintain them consistently.

对应组件 / Source component: `src/components/PricingPage.tsx`

## 使用目的 / Purpose

Tooltip 只用于解释用户不容易从标签和值里直接理解的计费、额度或到期规则。它应该降低理解成本，不应该重复页面上已经可见的信息。

Tooltips should explain billing, quota, expiration, or clearing rules that are not obvious from the label and value alone. They should reduce ambiguity, not repeat visible UI content.

## 通用规则 / General Rules

- 尽量控制在一句话内。
- Keep each tooltip to one sentence when possible.
- 用用户能理解的产品语言，不使用内部术语。
- Use user-facing product language. Avoid internal terminology.
- 周期性发放的量用“额度”，登录或任务获得的量用“奖励”。
- Use “allowance” for recurring quota and “reward” for login or task-based additions.
- 涉及到期、清零、失效的规则必须明确写出来。
- State expiration, clearing, or invalidation rules explicitly.
- 标签和值已经足够清楚时，不加 tooltip。
- Do not add a tooltip when the label and value are already self-explanatory.
- 不写营销语，不解释功能价值，只解释规则。
- Avoid marketing copy. Explain rules, not feature value.
- 中文 tooltip 统一以 `。` 结尾；英文 tooltip 统一以 `.` 结尾。
- Chinese tooltips should end with `。`; English tooltips should end with `.`.

## 当前标准文案 / Current Standard Copy

### 可用积分 / Available Credits

适用场景：一次性初始积分、新手任务奖励。

Use for one-time starting credits or onboarding task rewards.

中文：

`注册赠送 + 新手任务奖励。`

English:

`Signup bonus + onboarding task rewards.`

### 每月积分 / Monthly Credits

适用场景：订阅周期内发放的月度积分。

Use for credits granted per subscription cycle.

中文：

`按订阅周期发放，到期后未使用余额将清零。`

English:

`Granted per subscription cycle. Unused balance is cleared when the cycle ends.`

说明 / Notes:

- 必须说明“到期清零”，因为这会影响用户购买决策。
- Mention balance clearing because it affects purchase decisions.
- 使用“订阅周期”而不是只写“每月”，这样在年付展示下也成立。
- Use “subscription cycle” instead of only “monthly” so the copy also works for annual billing views.

### 每日积分 / Daily Credits

适用场景：每日发放积分，包含单一数值或 `200 + 200` 这类组合数值。

Use for daily credits, including single values or combined values such as `200 + 200`.

Free 中文：

`每日登录后发放，用于当天基础体验。`

Free English:

`Granted after daily login for basic same-day usage.`

Plus 中文：

`由基础每日额度和登录奖励组成。`

Plus English:

`Includes a base daily allowance and a login reward.`

Pro 中文：

`Pro 基础每日额度更高，登录奖励另计。`

Pro English:

`Pro includes a higher base daily allowance. Login rewards are counted separately.`

Max 中文：

`基础每日额度随档位提升，登录奖励另计。`

Max English:

`The base daily allowance increases by tier. Login rewards are counted separately.`

说明 / Notes:

- 优先使用“基础每日额度”和“登录奖励”。
- Prefer “base daily allowance” and “login reward”.
- 不使用“被动积分 + 登录积分”这类偏内部的表达。
- Avoid internal phrasing such as “passive credits + login credits”.
- 只有当套餐差异确实需要解释时，才写套餐名称，例如 `Pro`。
- Mention a plan name, such as `Pro`, only when the plan-specific difference needs clarification.

### 存储 / Storage

Pricing 卡片里的“存储”不加 tooltip。

Do not add a tooltip for storage rows in pricing cards.

原因 / Reason:

`10GB`、`50GB`、`50GB + 400GB` 这类值已经足够用于卡片对比。更细的存储规则应放在 FAQ 或正式套餐说明里，不放在卡片 tooltip。

Values such as `10GB`, `50GB`, or `50GB + 400GB` are enough for card-level comparison. Detailed storage rules should live in FAQ or formal plan documentation instead of card tooltips.

## 新增 tooltip 前检查 / Checklist Before Adding a Tooltip

新增 tooltip 前先确认：

Before adding a tooltip, check:

1. 这个规则是否会影响用户选择套餐？
   Does this rule affect plan selection?
2. 标签和值是否无法直接说明这个规则？
   Is the rule not obvious from the label and value?
3. 是否能用一句话说清楚？
   Can it be explained in one sentence?

如果任一答案是否定的，不要新增 tooltip。

If the answer to any question is no, do not add a tooltip.
