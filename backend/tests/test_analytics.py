def add_transaction(client, **changes):
    payload = {
        "name": "默认流水",
        "transaction_type": "expense",
        "category": "餐饮",
        "account": "现金",
        "amount": "100.00",
        "occurred_at": "2026-06-10T12:00:00",
        "icon": "🍜",
        "color": "#fae5dd",
    }
    payload.update(changes)
    response = client.post("/api/v1/transactions", json=payload)
    assert response.status_code == 201


def test_summary_categories_and_budget(client):
    add_transaction(client, amount="100.00")
    add_transaction(
        client,
        name="地铁",
        category="交通",
        amount="50.00",
        color="#e4eee9",
        occurred_at="2026-06-11T08:00:00",
    )
    add_transaction(
        client,
        name="工资",
        transaction_type="income",
        category="工资",
        amount="1000.00",
        occurred_at="2026-06-15T09:00:00",
    )

    budget = client.put("/api/v1/budgets/2026-06", json={"amount": "500"})
    assert budget.status_code == 200

    summary = client.get("/api/v1/analytics/summary?period=2026-06").json()
    assert summary["income"] == "1000.00"
    assert summary["expense"] == "150.00"
    assert summary["balance"] == "850.00"
    assert summary["active_days"] == 3
    assert summary["budget_remaining"] == "350.00"
    assert summary["budget_percentage"] == 30.0

    categories = client.get(
        "/api/v1/analytics/categories?period=2026-06"
    ).json()
    assert [item["category"] for item in categories] == ["餐饮", "交通"]
    assert categories[0]["percentage"] == 66.67

    trend = client.get(
        "/api/v1/analytics/trend?period=2026-06&range_name=month"
    ).json()
    assert trend["range"] == "month"
    assert len(trend["points"]) == 5


def test_default_budget_and_period_validation(client):
    budget = client.get("/api/v1/budgets/2026-06")
    assert budget.status_code == 200
    assert budget.json()["amount"] == "10000.00"

    assert client.get("/api/v1/budgets/2026-13").status_code == 422
    assert client.get(
        "/api/v1/analytics/summary?period=wrong"
    ).status_code == 422
