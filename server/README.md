# Server  

## Running:  

- `pip install -r requirements.txt`  
- `psql -LoginFlags < sql_gen.sql`  
- `uvicorn app.py --reload --workers 1 --host 0.0.0.0 --port 8000`
