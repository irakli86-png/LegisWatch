import requests

url = "https://info.parliament.ge/law/1/bill"


def get_bills(): 

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    params = {
        "start": 0,
        "limit": 20
    }

    response = requests.get(
        url,
        headers=headers,
        params=params
    )


    if response.status_code == 200:

        data = response.json()
        return data["list"]
    else:
        return []

        
