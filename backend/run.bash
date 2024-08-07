lsof -ti :5000 | xargs kill -9
lsof -ti :5001 | xargs kill -9
python3 api.py & python3 fileAnalyze.py