# api_connector.py

import requests

# Replace with your NEW regenerated API key
API_KEY = "UteHa6W7Rc4d2N8jVR6g"


def get_grid_data():

    url = "https://api.electricitymaps.com/v3/carbon-intensity/latest?zone=IN-WE"

    headers = {
        "auth-token": API_KEY
    }

    try:

        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )

        print("GRID STATUS:", response.status_code)

        if response.status_code == 200:

            data = response.json()

            print("GRID DATA:", data)

            carbon = data.get("carbonIntensity", 0)

            total_load = get_total_load()

            return {
            "frequency": 49.8,
            "demand": total_load,
            "generation": round(total_load * 1.05, 2),
            "carbon_intensity": carbon,
            "renewable_percentage": 33,
            "updated_at": data.get("datetime", "")
            }

        return {
                "frequency": 49.8,
                "demand": 900,
                "generation": 1000,
                "carbon_intensity": 0,
                "renewable_percentage": 0,
                "updated_at": "API Error"
            }
    except Exception as e:
        print("GRID ERROR:", e)
        return {
            "frequency": 49.8,
            "demand": 900,
            "generation": 1000,
            "carbon_intensity": 0,
            "renewable_percentage": 0,
            "updated_at": str(e)
        }
    
def get_zone_info():
    """
    Fetch available Electricity Maps zones
    """

    url = "https://api.electricitymaps.com/v3/zones"

    headers = {
        "auth-token": API_KEY
    }

    try:

        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )

        print("ZONE STATUS:", response.status_code)
        print("ZONE RESPONSE:", response.text)

        if response.status_code == 200:

            return response.json()

        else:

            return {
                "error": f"API Error {response.status_code}"
            }

    except Exception as e:

        return {
            "error": str(e)
        }
    
def get_total_load():

    url = "https://api.electricitymaps.com/v3/total-load/latest?zone=IN-WE"

    headers = {
        "auth-token": API_KEY
    }

    try:

        response = requests.get(url, headers=headers, timeout=10)

        print("LOAD STATUS:", response.status_code)
        print("LOAD JSON:", response.text)

        if response.status_code == 200:

            data = response.json()

            return data.get("value", 0)

        return 0

    except Exception as e:

        print("LOAD ERROR:", e)

        return 0
    
#def get_renewable_percentage():

    #url = "YOUR_RENEWABLE_API_URL"

    #response = requests.get(
    #    url,
    #    headers={"auth-token": API_KEY},
    #    timeout=10
    #)

    #if response.status_code == 200:

    #    data = response.json()

    #    print("RENEWABLE JSON:", data)

    #    return {
    #        "renewable_percentage": data.get("renewablePercentage", 0),
    #        "demand": data.get("powerConsumptionTotal", 0),
    #        "generation": data.get("powerProductionTotal", 0)
    #    }

    #return {
    #    "renewable_percentage": 0,
    #    "demand": 0,
    #    "generation": 0
    #}