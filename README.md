# Impact Navigator — Monorepo

Backend in `backend/`, frontend in `frontend/`.

## Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python seed.py
python app.py
```
Runs at http://127.0.0.1:5000

## Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173
