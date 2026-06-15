import pandas as pd
import os
from datetime import datetime

def log_raw_data(data):

    filename = "grid_raw_data.xlsx"

    row = {
        "Timestamp": datetime.now(),
        **data
    }

    df = pd.DataFrame([row])

    if os.path.exists(filename):
        try:
            old = pd.read_excel(filename)
        except:
            old = pd.DataFrame()

    df = pd.concat([old, df], ignore_index=True)

    df.to_excel(filename, index=False)

def log_analysis_data(data):

    filename = "grid_analysis_log.xlsx"

    current_hour = datetime.now().strftime("%Y-%m-%d %H")

    row = {
        "Timestamp": current_hour,
        **data
    }

    df = pd.DataFrame([row])

    if os.path.exists(filename):

        try:
            old = pd.read_excel(filename)
        except:
            old = pd.DataFrame()


        if not old.empty:

            last_hour = str(old.iloc[-1]["Timestamp"])[:13]

            if last_hour == current_hour:
                return

        df = pd.concat([old, df], ignore_index=True)

    df.to_excel(filename, index=False)