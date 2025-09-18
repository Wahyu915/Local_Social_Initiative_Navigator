import requests

url = "http://127.0.0.1:5000/api/events"
payload = {
    "event_name": "Fundraising Marathon",
    "date": "2025-10-20",
    "time": "07:00",
    "location": "Bandar Seri Begawan",
    "organizer": "Youth for Change",
    "description": "Charity run to support education initiatives."
}

res = requests.post(url, json=payload)
print(res.json())
