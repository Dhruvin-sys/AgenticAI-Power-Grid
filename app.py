from flask import Flask, jsonify, request, render_template
from physics_engine import analyze_grid

from api_connector import get_grid_data
from api_connector import get_zone_info

from data_logger import log_analysis_data, log_raw_data

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyze")
def analyze():

    grid_data = get_grid_data()
    #log_raw_data(grid_data)

    print("LIVE GRID DATA:", grid_data)

    voltage = float(request.args.get("voltage", 225))
    current = float(request.args.get("current", 11))
    pf_angle = float(request.args.get("pf", 30))
    resistance = float(request.args.get("resistance", 0.5))
    equipment_temp = float(request.args.get("equip_temp", 55))
    ambient_temp = float(request.args.get("ambient_temp", 30))
    demand = float(request.args.get("demand", grid_data["demand"]))
    generation = float(request.args.get("generation", grid_data["generation"]))
    frequency = float(request.args.get("frequency", grid_data["frequency"]))

    report = analyze_grid(
    voltages=[voltage],
    currents=[current],
    pf_angle=pf_angle,
    resistance=resistance,
    equipment_temp=equipment_temp,
    ambient_temp=ambient_temp,
    demand=demand,
    generation=generation,
    frequency=frequency,
    renewable_percentage=grid_data["renewable_percentage"],
    carbon_intensity=grid_data["carbon_intensity"]
)
    
    log_analysis_data(report)
    return jsonify(report)

@app.route("/zones")
def zones():

    return jsonify(
        get_zone_info()
    )

@app.route("/grid-info")
def grid_info():

    return jsonify({
        "zone": "Western India",
        "country": "India",
        "zoneKey": "IN-WE"
    })

if __name__ == "__main__":
    app.run(debug=True)