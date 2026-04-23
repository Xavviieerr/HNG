````markdown
# 🔍 Profile Intelligence API

A powerful backend API that enriches names with demographic data (Gender, Age, Nationality) and provides advanced filtering and natural language search capabilities.

---

## 🚀 What it does

Given a name, this API:

- **Enriches Data** — Consults Genderize, Agify, and Nationalize APIs to build a full demographic profile
- **Classifies** — Categorizes age into groups (Child, Teenager, Adult, Senior)
- **Normalizes** — Maps ISO country codes to full human-readable names using `i18n-iso-countries`
- **Search** — Parses plain English queries into complex database filters
- **Filters** — Supports multi-parameter filtering, sorting, and pagination

---

## 📡 Key Endpoints

### 1. Create / Retrieve Profile

```http
POST /api/profiles
Content-Type: application/json

{ "name": "emmanuel" }
```

### 2. Get All Profiles (Advanced)

```http
GET /api/profiles?gender=male&min_age=20&sort_by=age&order=desc
```

| Parameter                 | Description                                      |
| :------------------------ | :----------------------------------------------- |
| `gender`                  | Filter by `male` or `female`                     |
| `age_group`               | Filter by `child`, `teenager`, `adult`, `senior` |
| `country_id`              | Filter by ISO Alpha-2 code (e.g. `NG`)           |
| `min_age` / `max_age`     | Age range filters                                |
| `min_gender_probability`  | Minimum gender confidence threshold              |
| `min_country_probability` | Minimum nationality confidence threshold         |
| `sort_by`                 | `age`, `created_at`, or `gender_probability`     |
| `order`                   | `asc` or `desc`                                  |
| `page`                    | Page number (default: `1`)                       |
| `limit`                   | Results per page (default: `10`, max: `50`)      |

### 3. Natural Language Search

```http
GET /api/profiles/search?q=young males from nigeria
```

---

## ✅ Success Response

```json
{
	"status": "success",
	"page": 1,
	"limit": 10,
	"total": 1,
	"data": [
		{
			"id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
			"name": "emmanuel",
			"gender": "male",
			"gender_probability": 0.99,
			"age": 34,
			"age_group": "adult",
			"country_id": "NG",
			"country_name": "Nigeria",
			"country_probability": 0.85,
			"created_at": "2026-04-01T12:00:00Z"
		}
	]
}
```

---

## ❌ Error Responses

All errors follow a consistent structure:

```json
{ "status": "error", "message": "<error message>" }
```

| Status Code                | Meaning                        |
| :------------------------- | :----------------------------- |
| `400 Bad Request`          | Missing or empty parameter     |
| `422 Unprocessable Entity` | Invalid parameter type         |
| `404 Not Found`            | Profile not found              |
| `500 / 502`                | Server or upstream API failure |

---

## 🧠 Natural Language Parsing

The `/search` endpoint uses a **Rule-Based Tokenization Strategy** to convert plain English into MongoDB queries — no AI, no LLMs, just high-performance string analysis.

### Keyword Mapping

| Keyword                                   | Filter Mapping                | Example               |
| :---------------------------------------- | :---------------------------- | :-------------------- |
| `male` / `female`                         | `gender`                      | `"females in Kenya"`  |
| `young`                                   | `age: { $gte: 16, $lte: 24 }` | `"young males"`       |
| `above [X]`                               | `age: { $gt: X }`             | `"people above 30"`   |
| `child` / `teenager` / `adult` / `senior` | `age_group`                   | `"adults from Italy"` |
| Country names                             | `country_id` via ISO-3166-1   | `"people from Ghana"` |

### Example Query Mappings

```
"young males"                        →  gender=male + min_age=16 + max_age=24
"females above 30"                   →  gender=female + min_age=30
"people from angola"                 →  country_id=AO
"adult males from kenya"             →  gender=male + age_group=adult + country_id=KE
"male and female teenagers above 17" →  age_group=teenager + min_age=17
```

### How it works

1. **Normalization** — Query is lowercased and trimmed
2. **Entity Recognition** — Parser scans for reserved keywords (gender, age groups)
3. **Regex Extraction** — Pattern `above\s+(\d+)` identifies numeric age thresholds
4. **Geo-Mapping** — Tokens are cross-referenced against `i18n-iso-countries` to resolve country names to ISO Alpha-2 codes
5. **Query Assembly** — All identified entities are merged into a single MongoDB `filter` object

---

## ⚠️ Limitations & Edge Cases

- **Boolean Ambiguity** — No `OR` logic. A query for `"males and females"` will prioritize the last detected gender rather than returning both
- **Negation** — The parser does not understand `"not"`. A query like `"people not from Nigeria"` will filter _for_ Nigeria
- **Compound Locations** — Only single-country entities are supported. Regional queries like `"West Africa"` or `"Scandinavia"` are not handled
- **Non-Numerical Age** — Requires digits for threshold logic (`"above 30"` ✅, `"above thirty"` ❌)
- **Misspelling** — Requires exact keyword and country name matches; no fuzzy matching

---

## 🛠 Tech Stack

| Technology             | Role                                     |
| :--------------------- | :--------------------------------------- |
| **Node.js & Express**  | Core API framework                       |
| **MongoDB & Mongoose** | Data persistence and querying            |
| **Axios**              | External API communication               |
| **i18n-iso-countries** | Geographical data mapping                |
| **UUID v7**            | Time-sortable unique profile identifiers |

---

## ⚙️ Setup & Installation

```bash
# Clone the repository
git clone https://github.com/your-username/profile-intelligence-api.git
cd profile-intelligence-api

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your MONGODB_URI and PORT

# Start the server
npm start

# Development mode (with hot reload)
npm run dev
```

### Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/profiles
```

---

## 💡 Purpose

This project demonstrates professional-grade backend engineering including:

- High-performance **pagination and sorting** patterns
- **Data normalization** from multiple external sources
- Custom **Rule-Based NLP** without the overhead of external LLM services
- Strict **response structuring** for frontend predictability
````
