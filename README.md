# 今日记账

一款专注于日常收支记录、预算管理与消费回顾的记账应用。产品主张是：**看见每一笔，也看见生活。**

## 动态版本

项目使用浏览器原生 ES Modules，需要通过本地静态服务器预览，无需安装项目依赖：

```bash
python3 -m http.server 8080
```

然后访问 `http://localhost:8080`。

浏览器业务测试位于 `http://localhost:8080/tests/dynamic-ledger.test.html`，覆盖流水增删改、月份筛选、预算计算、本地持久化与远程网关同步。

当前版本已包含：

- 流水新增、编辑、删除与服务端持久化
- 按月份查看真实收支汇总和流水搜索
- 由账目实时计算的趋势、分类占比与预算进度
- 可编辑月度预算与金额隐私开关
- 后端不可用时自动切换到浏览器本地模式
- 桌面端、平板与移动端响应式布局

## 后续规划

- 账户、分类、预算和周期账单管理
- 登录、用户数据隔离与多设备同步
- 账单导入导出、统计报表与智能消费洞察
- 提醒、主题设置和隐私保护

## 项目结构

```text
.
├── index.html                    # 页面语义结构
└── assets/
    ├── styles/
    │   ├── main.css              # 样式入口
    │   ├── tokens.css            # 颜色、阴影等设计令牌
    │   ├── base.css              # 全局基础规则
    │   ├── layout.css            # 页面布局骨架
    │   ├── navigation.css        # 桌面与移动导航
    │   ├── dashboard.css         # 看板与数据组件
    │   ├── forms.css             # 表单、按钮、弹窗与提示
    │   └── responsive.css        # 响应式规则
    └── scripts/
        ├── app.js                # 应用装配入口
        ├── core/                 # 状态、格式化和通用反馈
        ├── data/                 # 静态模拟数据
        └── features/             # 按业务功能隔离的交互模块
```

开发时遵循单一职责：业务模块不直接管理其他模块的数据，由 `app.js` 通过明确接口进行组合。

## 后端 API

后端位于 `backend/`，采用 FastAPI、SQLAlchemy、Alembic 和 SQLite，并按 API、业务服务、数据仓库、模型、Schema 分层。

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
alembic upgrade head
uvicorn backend.app.main:app --reload --port 8000
```

也可以使用 `make setup` 一次完成环境安装和数据库迁移。之后分别在两个终端运行 `make backend` 与 `make frontend`，前端会自动连接 `http://127.0.0.1:8000/api/v1`。

启动后可访问：

- API 文档：`http://127.0.0.1:8000/docs`
- 健康检查：`http://127.0.0.1:8000/api/v1/health`
- 流水 API：`/api/v1/transactions`
- 预算 API：`/api/v1/budgets/{YYYY-MM}`
- 统计 API：`/api/v1/analytics/*`

运行后端测试：

```bash
pytest
```

数据库结构变更必须创建 Alembic revision，应用启动过程不会擅自修改数据库表结构。
