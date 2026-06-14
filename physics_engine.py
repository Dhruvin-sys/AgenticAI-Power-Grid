import math
def voltage_average(voltages):
    return sum(voltages) / len(voltages)

def current_average(current):
    return sum(current) / len(current)

def average_power(avg_voltage, avg_current):
    return avg_voltage * avg_current

def power_factor(angle_radian):
    return math.cos(angle_radian)

def Irms(avg_current):
    return (math.pi / (2 * math.sqrt(2))) * avg_current

def Vrms(avg_voltage):
    return (math.pi / (2 * math.sqrt(2))) * avg_voltage

def reactive_power(vrms, irms, angle_radian):
    return vrms * irms * math.sin(angle_radian)

def apparent_power(vrms, irms):
    return vrms * irms

def voltage_drop(current, resistance):
    return current * resistance

def transmission_loss(current, resistance):
    return current**2 * resistance

def efficiency(pin, pout):
    if pin == 0:
        return 0
     
    return (pout / pin) * 100

def temperature_rise(temp, ambient):
    return temp - ambient

def supply_margin(gen, dem):
    return gen - dem

def grid_utilization(demand, generation):

    if generation == 0:
        return 0

    return (demand / generation) * 100

def health_score(efficiency, pf, temp_rise):

    score = 100

    if efficiency < 90:
        score -= (90 - efficiency)

    if pf < 0.9:
        score -= (0.9 - pf) * 50

    if temp_rise > 15:
        score -= (temp_rise - 15)

    return max(0, min(100, score))

def thermal_risk(temp_rise):

    if temp_rise < 10:
        return "LOW"

    elif temp_rise < 20:
        return "MEDIUM"

    else:
        return "HIGH"

def grid_stress(freq, utilization):

    stress = 0

    if freq < 49.5:
        stress += 50

    if utilization > 90:
        stress += 50

    return stress

def failure_probability(
    efficiency,
    pf,
    temp_rise,
    utilization
):

    risk = 0

    if efficiency < 85:
        risk += 30

    if pf < 0.8:
        risk += 20

    if temp_rise > 20:
        risk += 30

    if utilization > 90:
        risk += 20

    return min(100, risk)
def analyze_grid(
    voltages,
    currents,
    pf_angle,
    resistance,
    equipment_temp,
    ambient_temp,
    demand,
    generation,
    frequency,
    renewable_percentage,
    carbon_intensity,
):
    avg_voltage = voltage_average(voltages)

    avg_current = current_average(currents)

    angle_radian = pf_angle * (3.14 / 180)

    pf = power_factor(angle_radian)

    pin = average_power(
        avg_voltage,
        avg_current
    )

    vrms = Vrms(avg_voltage)

    irms = Irms(avg_current)

    reactive = reactive_power(
        vrms,
        irms,
        angle_radian
    )

    apparent = apparent_power(
        vrms,
        irms
    )

    vdrop = voltage_drop(
        avg_current,
        resistance
    )

    ploss = transmission_loss(
        avg_current,
        resistance
    )

    pout = pin - ploss

    eta = efficiency(
        pin,
        pout
    )

    deltaT = temperature_rise(
        equipment_temp,
        ambient_temp
    )

    margin = supply_margin(
        generation,
        demand
    )

    utilization = grid_utilization(
        demand,
        generation
    )

    health = health_score(
        eta,
        pf,
        deltaT
    )

    thermal = thermal_risk(
        deltaT
    )

    stress = grid_stress(
        frequency,
        utilization
    )

    failure = failure_probability(
        eta,
        pf,
        deltaT,
        utilization
    )

    predicted_failure_1h = min(failure * 1.1, 100)
    predicted_failure_24h = min(failure * 1.5, 100)

    predicted_health_1h = max(0, health - 3)

    predicted_health_24h = max(0, health - 8)

    if margin < 0:
        root_cause = "Generation Deficit"

    elif utilization > 95:
        root_cause = "High Grid Stress"

    elif carbon_intensity > 500:
        root_cause = "High Carbon Emissions"

    elif renewable_percentage < 30:
        root_cause = "Low Renewable Contribution"

    elif deltaT > 20:
        root_cause = "Transformer Overheating"

    elif pf < 0.8:
        root_cause = "Poor Power Factor"

    elif eta < 85:
        root_cause = "Transmission Loss"

    else:
        root_cause = "Normal Operation"

    if root_cause == "Generation Deficit":
        recommendation = "Increase generation capacity"

    elif root_cause == "High Grid Stress":
        recommendation = "Perform load balancing"

    elif root_cause == "High Carbon Emissions":
        recommendation = "Reduce coal generation"

    elif root_cause == "Low Renewable Contribution":
        recommendation = "Increase renewable dispatch"

    elif root_cause == "Transformer Overheating":
        recommendation = "Inspect cooling system"

    elif root_cause == "Poor Power Factor":
        recommendation = "Install capacitor bank"

    elif root_cause == "Transmission Loss":
        recommendation = "Inspect transmission line"

    else:
        recommendation = "Grid operating normally"

    sustainability_score = renewable_percentage - (carbon_intensity / 20)
    sustainability_score = max(0, min(100, sustainability_score))
    priority_score = (
    failure * 0.4 +
    stress * 0.3 +
    (100 - sustainability_score) * 0.3
)

    priority_score = round(priority_score, 1)

    if failure > 70:
        alert_level = "CRITICAL"

    elif stress > 80:
        alert_level = "CRITICAL"

    elif carbon_intensity > 550:
        alert_level = "WARNING"

    elif failure > 40:
        alert_level = "WARNING"

    elif stress > 50:
        alert_level = "WARNING"

    else:
        alert_level = "NORMAL"

    return {


        "frequency": frequency,

        "demand": demand,

        "generation": generation,

        "carbon_intensity": carbon_intensity,
        
        "renewable_percentage": renewable_percentage,

        "sustainability_score": sustainability_score,

        "priority_score": priority_score,

        "avg_voltage": avg_voltage,

        "avg_current": avg_current,

        "power_factor": pf,

        "reactive_power": reactive,

        "apparent_power": apparent,

        "power_loss": ploss,

        "efficiency": eta,

        "temperature_rise": deltaT,

        "supply_margin": margin,

        "grid_utilization": utilization,

        "health_score": health,

        "thermal_risk": thermal,

        "grid_stress": stress,

        "alert_level": alert_level,

        "failure_probability": failure,

        "predicted_health_1h": predicted_health_1h,

        "predicted_health_24h": predicted_health_24h,

        "predicted_failure_1h": predicted_failure_1h,

        "predicted_failure_24h": predicted_failure_24h,

        "root_cause": root_cause,

        "recommendation": recommendation

    }

if __name__ == "__main__":

    result = analyze_grid(
        voltages=[220,225,230],
        currents=[10,11,12],
        pf_angle=30,
        resistance=0.5,
        equipment_temp=55,
        ambient_temp=30,
        demand=900,
        generation=1000,
        frequency=49.8,
    )

    print(result)