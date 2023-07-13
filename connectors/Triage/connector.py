import hashlib
import os.path
from typing import List, Optional

import requests

from connectors.Triage.const import TRIAGE_URL, TRIAGE_LAST_100_RESULTS_FROM_NOW, TRIAGE_HEADER, OUTPUT_FOLDER
from connectors.utils import upload_file_to_malstream


def get_last_100_analysis() -> List:
    r = requests.get(f"{TRIAGE_URL}{TRIAGE_LAST_100_RESULTS_FROM_NOW}", headers=TRIAGE_HEADER)

    if r.status_code != 200:
        return []

    return r.json()['data']


def download_file(_id: str) -> Optional[str]:
    r = requests.get(f"{TRIAGE_URL}/samples/{_id}/sample", headers=TRIAGE_HEADER)
    if r.status_code != 200:
        return None

    file_path = os.path.join(OUTPUT_FOLDER, hashlib.sha256(r.content).hexdigest())

    with open(file_path, 'wb') as f:
        f.write(r.content)

    return file_path


def main():
    res = get_last_100_analysis()

    for r in res:
        file_path = download_file(r['id'])
        if not file_path:
            print(f'Error while download sample {r["id"]}')
            continue

        status_code = upload_file_to_malstream(file_path)

        if status_code != 200 and status_code != 409:
            print(f'Error on upload {file_path}')

    print(f"Cleaning extracted file {OUTPUT_FOLDER}")
    for f in os.listdir(OUTPUT_FOLDER):
        os.remove(os.path.join(OUTPUT_FOLDER, f))


if __name__ == '__main__':
    main()
