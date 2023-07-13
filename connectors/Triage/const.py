from datetime import datetime

TRIAGE_URL = 'https://api.tria.ge/v0'
OUTPUT_FOLDER = '/tmp/triage'
TRIAGE_API = ''
TRIAGE_HEADER = {'Authorization': f'Bearer {TRIAGE_API}'}
TRIAGE_LAST_100_RESULTS_FROM_NOW = f'/search?query=to:{datetime.now().isoformat()}&limit=100'
