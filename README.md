# Lucky Draw Kit

一个轻量、无依赖的抽奖核心库，适合 Web、小程序、Node.js 后端使用。

项目目标是给中小团队提供一个可复现、可审计、容易二次开发的抽奖基础能力，减少每个活动项目重复手写抽奖逻辑带来的公平性、库存和记录问题。

它可以帮助你实现：

- 按权重抽奖
- 奖品库存控制
- 用户中奖次数限制
- 可复现的种子随机
- 可落库的抽奖记录
- 抽奖审计快照
- TypeScript 类型声明

> 这个项目只提供抽奖核心逻辑。真实上线时，请按业务所在地要求处理活动规则公示、奖品发放、用户隐私、反作弊和合规审查。

## 安装

```bash
npm install lucky-draw-kit
```

本地开发也可以直接克隆后运行：

```bash
npm test
```

## 快速使用

```js
import { createAuditSnapshot, drawBatch } from "lucky-draw-kit";

const result = drawBatch({
  seed: "2026-summer-event",
  prizes: [
    { id: "phone", name: "手机", weight: 1, stock: 1 },
    { id: "coupon", name: "优惠券", weight: 99, stock: 100 }
  ],
  participants: [
    { id: "user_001" },
    { id: "user_002" },
    { id: "user_003" }
  ],
  maxWinsPerUser: 1
});

console.log(result.records);

const audit = createAuditSnapshot(result, {
  eventId: "summer_2026",
  operator: "official"
});

console.log(audit.fingerprint);
```

## API

### `drawOne(prizes, options)`

从奖品列表中抽取一个奖品。库存为 `0` 的奖品不会被抽中。

### `drawBatch(options)`

按参与用户列表批量抽奖，并返回抽奖记录和剩余库存。

参数：

- `prizes`: 奖品列表
- `participants`: 参与用户列表
- `seed`: 随机种子，用于复现结果
- `maxWinsPerUser`: 每个用户最多中奖次数，默认 `1`

### `createSeededRandom(seed)`

创建一个可复现的伪随机函数，方便测试和审计。

### `createAuditSnapshot(drawResult, metadata)`

根据批量抽奖结果生成审计快照，包含记录数量、剩余库存和稳定指纹。适合落库、导出或和活动公告一起归档。

### `createFingerprint(value)`

为任意 JSON 兼容数据生成稳定指纹。这个指纹用于快速比对配置和结果是否被修改，不等同于加密签名。

### `stableStringify(value)`

按 key 排序后序列化 JSON 兼容数据，方便审计和测试。

### `validatePrizes(prizes)`

校验并标准化奖品配置。

## 奖品格式

```js
{
  id: "coupon",
  name: "优惠券",
  weight: 100,
  stock: 50
}
```

## 适合场景

- 电商抽奖活动
- 小程序抽奖
- 会员福利活动
- 内部年会抽奖
- 营销活动原型

## 项目文档

- [合规和公平性清单](./docs/compliance-checklist.md)
- [项目影响说明](./docs/project-impact.md)
- [维护路线图](./ROADMAP.md)
- [贡献指南](./CONTRIBUTING.md)
- [安全政策](./SECURITY.md)

## 开源协议

MIT
