from copy import deepcopy


BASE_TRANSACTION = {
    "name": "午餐",
    "transaction_type": "expense",
    "category": "餐饮",
    "account": "微信支付",
    "amount": "42.50",
    "occurred_at": "2026-06-12T12:30:00",
    "icon": "🍜",
    "color": "#fae5dd",
}


def test_transaction_crud_flow(client):
    created = client.post("/api/v1/transactions", json=BASE_TRANSACTION)
    assert created.status_code == 201
    transaction_id = created.json()["id"]

    listed = client.get("/api/v1/transactions?year=2026&month=6")
    assert listed.status_code == 200
    assert [item["id"] for item in listed.json()] == [transaction_id]

    searched = client.get(
        "/api/v1/transactions?year=2026&month=6&search=午餐"
    )
    assert len(searched.json()) == 1

    updated = client.patch(
        f"/api/v1/transactions/{transaction_id}",
        json={"amount": "58.80", "name": "工作午餐"},
    )
    assert updated.status_code == 200
    assert updated.json()["name"] == "工作午餐"
    assert updated.json()["amount"] == "58.80"

    deleted = client.delete(f"/api/v1/transactions/{transaction_id}")
    assert deleted.status_code == 204
    assert client.get(f"/api/v1/transactions/{transaction_id}").status_code == 404


def test_transaction_validation(client):
    invalid = deepcopy(BASE_TRANSACTION)
    invalid["amount"] = "-1"

    assert client.post("/api/v1/transactions", json=invalid).status_code == 422

    created = client.post("/api/v1/transactions", json=BASE_TRANSACTION)
    transaction_id = created.json()["id"]
    assert client.patch(
        f"/api/v1/transactions/{transaction_id}", json={}
    ).status_code == 422


def test_month_and_type_filters(client):
    client.post("/api/v1/transactions", json=BASE_TRANSACTION)
    income = deepcopy(BASE_TRANSACTION)
    income.update(
        {
            "name": "工资",
            "transaction_type": "income",
            "category": "工资",
            "amount": "12000",
            "occurred_at": "2026-07-01T09:00:00",
        }
    )
    client.post("/api/v1/transactions", json=income)

    june_expenses = client.get(
        "/api/v1/transactions?year=2026&month=6&transaction_type=expense"
    ).json()
    july_income = client.get(
        "/api/v1/transactions?year=2026&month=7&transaction_type=income"
    ).json()

    assert len(june_expenses) == 1
    assert len(july_income) == 1
