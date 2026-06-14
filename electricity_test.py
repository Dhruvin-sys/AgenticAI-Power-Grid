import requests

API_KEY = "YKACWfzSB82T46fdKjGN"

url = "https://api.electricitymap.org/v3/zones"

headers = {
    "auth-token": API_KEY
}

response = requests.get(url, headers=headers)

print("Status Code:", response.status_code)
print(response.json())