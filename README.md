```markdown
# 📌 PositionManagementAPI

PositionManagementAPI is a **.NET 10 Web API** project that manages trades and positions.  
It enforces strict business rules around **INSERT**, **UPDATE**, and **CANCEL** transactions, and exposes endpoints to query net positions.  
Swagger UI is enabled for interactive documentation and testing.

---

## 🚀 Features
- **Transaction Processing**
  - `INSERT` → only accepted if version = 1
  - `UPDATE` → applied only if newer version than stored
  - `CANCEL` → removes the last stored trade and reverses its effect
- **Position Management**
  - Maintains net positions per security code
  - Supports Buy (+) and Sell (–) transactions
- **Swagger Integration**
  - Interactive API documentation
  - Try out endpoints directly from the browser

---

## 🛠️ Tech Stack
- **Backend:** .NET 10 Web API  
- **Testing:** xUnit  
- **Documentation:** Swagger / Swashbuckle  
- **Data Store:** In-memory repository  

---

## 📂 Project Structure
```plaintext
PositionManagementAPI/
├── Controllers/
│   └── TransactionsController.cs
├── Models/
│   ├── Transaction.cs
│   └── Position.cs
├── Services/
│   └── PositionService.cs
├── Repositories/
│   └── InMemoryStore.cs
├── Program.cs
└── README.md
```

---

## ▶️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/PositionManagementAPI.git
cd PositionManagementAPI
```

### 2. Build the Project
```bash
dotnet build
```

### 3. Run the API
```bash
dotnet run
```

By default, the API runs on:
- `http://localhost:5130`
- `https://localhost:7130`

---

## 📖 Swagger Documentation

Swagger UI is enabled by default.  
Once the API is running, open:

- **Swagger UI:**  
  - `http://localhost:5130/swagger/index.html`  
  - `https://localhost:7130/swagger/index.html`

You’ll see:
- Endpoints for processing transactions → `POST /api/transactions`
- Endpoints for retrieving positions → `GET /api/positions`
- Ability to execute requests directly from the browser

---

## 📜 Example Request (Swagger)

```json
{
  "transactionId": 1,
  "tradeId": 100,
  "version": 1,
  "securityCode": "REL",
  "quantity": 50,
  "action": "INSERT",
  "buySell": "Buy"
}
```

---

## 🧪 Running Tests

Navigate to the test project and run:
```bash
dotnet test PositionManagementAPI.Tests
```

This executes all xUnit tests verifying business rules:
- ✅ INSERT v1 accepted  
- ✅ INSERT with version ≠ 1 ignored  
- ✅ UPDATE only if newer version  
- ✅ UPDATE before INSERT ignored  
- ✅ CANCEL removes trade effect  

---

## 📊 Code Coverage

To collect coverage:
```bash
dotnet tool install --global dotnet-coverage
dotnet tool install --global dotnet-reportgenerator-globaltool

dotnet-coverage collect 'dotnet test PositionManagementAPI.Tests' -f cobertura -o coverage.cobertura.xml
reportgenerator -reports:coverage.cobertura.xml -targetdir:coverage-report
```

Open `coverage-report/index.html` in your browser for a detailed report.

---

## 📜 License
This project is for **interview/demo purposes**.  
Feel free to modify and extend as needed.
```
