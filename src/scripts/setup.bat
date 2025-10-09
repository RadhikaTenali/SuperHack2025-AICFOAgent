@echo off
echo Setting up AI CFO Agent...

echo Setting up the backend...
cd src\backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
echo Backend setup complete.

echo Setting up the frontend...
cd ..\frontend
npm install
echo Frontend setup complete.

cd ..\..

echo Setup completed successfully! You can now run the backend and frontend servers.
echo To run the backend: cd src\backend ^&^& venv\Scripts\activate ^&^& uvicorn app:app --reload
echo To run the frontend: cd src\frontend ^&^& npm start