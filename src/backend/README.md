# Backend - AI CFO Agent

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn app:app --reload
```

## API Endpoints

- `GET /` - Welcome message
- More endpoints will be added as development progresses

## Development

The backend is built with FastAPI and provides RESTful APIs for the frontend to consume.