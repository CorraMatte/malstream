import os
from connectors.config import MALSTREAM_URL
import requests


def upload_file_to_malstream(file_path: str) -> int:
    files = {'file': (os.path.basename(file_path), open(file_path, 'rb'))}
    r = requests.post(f"{MALSTREAM_URL}/upload", files=files)

    return r.status_code
