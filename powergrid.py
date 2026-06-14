#power-grid efficiency:
import math

n = int(input("Enter value for N: "))
print()

#1. average voltage and current:

#array of voltage and current input:
voltages = []
current = []

#input range of loop to function as per entries
for i in range(n):
    
    #entries of array elements(volatge) 
    raw_volt_values = input("Enter Voltage: ")
    print()
    voltage_values = [float(x) for x in raw_volt_values.split()]
    
    #using .append() to add all elements in array
    voltages.append(voltage_values[0])
    
for j in range(n):
    
    #entries of array elements(current)
    raw_current_values = input("Enter Current Value: ")
    print()
    current_values = [float(x) for x in raw_current_values.split()]

    #using .append() to add all elements in array 
    current.append(current_values[0])

    #defining volatge an current
    def voltage_average(voltages):
       return sum(voltages)/len(voltages)
    
    def current_average(current):
        return sum(current)/len(current)

#defining parameter and arguements      
avg_voltage = voltage_average(voltages)
avg_current = current_average(current)

#output print value(avg_voltage, avg_current):
print("Average voltage and current(V/A): ", avg_voltage , avg_current, sep="\n")
print()

#2. average input-power:

#defining average_power function
def average_power(avg_voltage, avg_current):
    return avg_voltage*avg_current
    
#efining average power parameter and arguement     
avg_power = average_power(avg_voltage, avg_current)

#output print value(avg_power):    
print("Average input-power(Watts): ", avg_power, sep="\n")
print()

#3. Average power-input (DC/AC):

#angle specification in degrees
angle_degree = int(input("Enter Pf angle: "))
     
#defining angle radian
def angle_radian(angle_degree):
        return angle_degree*(3.14/180)

#defining parameter and arguement:        
angle_radian = angle_radian(angle_degree)

#output print value(power_factor angle):
print("Power factor angle(rad): ", angle_radian, sep="\n")
print()

#4. Calculating input_power average(Pint(avg)):
#defining Power Factor:
def power_factor(angle_radian):
    return math.cos(angle_radian)    
    
print(f"Power factor: {power_factor(angle_radian)}", sep="\n")
pf = power_factor(angle_radian)
print()

#defining Irms Value:
def Irms(avg_current):
    return (math.pi/(2 * math.sqrt(2))) * avg_current

print(f"Irms Value: {Irms(avg_current)}")
print()

#Defining Vrms Value:
def Vrms(avg_voltage):
    return (math.pi/(2 * math.sqrt(2))) * avg_voltage

print(f"Vrms Value: {Vrms(avg_voltage)}", sep="\n")
print()

#Defining AC input Power:
def AC_power_module(irms, vrms, power_factor):
    return (irms * vrms * power_factor)

print(f"AC Input Power: {AC_power_module(Irms(avg_current), Vrms(avg_voltage), power_factor(angle_radian))}", sep="\n")
print()

#Defining Reactive Power:
def reactive_power(vrms, irms, angle_radian):
    return vrms * irms * math.sin(angle_radian)

Q = reactive_power(
    Vrms(avg_voltage),
    Irms(avg_current),
    angle_radian
)

print(f"Reactive Power(VAR): {Q}")
print()

#Defining Active Power:
def apparent_power(vrms, irms):
    return vrms * irms

S = apparent_power(
    Vrms(avg_voltage),
    Irms(avg_current)
)

print(f"Apparent Power(VA): {S}")
print()

line_resistance = float(
    input("Enter Transmission Line Resistance(Ohms): ")
)
print()

#Defining Voltage Drop:
def voltage_drop(current, resistance):
    return current * resistance

Vdrop = voltage_drop(
    avg_current,
    line_resistance
)

print(f"Voltage Drop(V): {Vdrop}")
print()

#Defining Transmission Loss:
def transmission_loss(current, resistance):
    return current**2 * resistance

Ploss = transmission_loss(
    avg_current,
    line_resistance
)

print(f"Transmission Loss(W): {Ploss}")
print()

Pout = avg_power - Ploss

print(f"Output Power(W): {Pout}")
print()

#Defining Efficiency:
def efficiency(pin, pout):
    return (pout / pin) * 100

eta = efficiency(avg_power, Pout)

print(f"Efficiency(%): {eta}")
print()

#Calculate Temprature:
temperature = float(
    input("Enter Equipment Temperature(C): ")
)

#Calculate Ambient Temprature:
ambient_temperature = float(
    input("Enter Ambient Temperature(C): ")
)

#Define Temp rise:
def temperature_rise(temp, ambient):
    return temp - ambient

deltaT = temperature_rise(
    temperature,
    ambient_temperature
)

print(f"Temperature Rise(C): {deltaT}")
print()

#Calculate demad:
demand = float(
    input("Enter Grid Demand(MW): ")
)

#Calculate generation:
generation = float(
    input("Enter Grid Generation(MW): ")
)

#Defining Supply margin:
def supply_margin(gen, dem):
    return gen - dem

margin = supply_margin(
    generation,
    demand
)

print(f"Supply Margin(MW): {margin}")
print()

#Define Grid Utilization:
def grid_utilization(demand, generation):
    return (demand / generation) * 100

utilization = grid_utilization(
    demand,
    generation
)

print(f"Grid Utilization(%): {utilization}")
print()

#Fequncy Calculation:
frequency = float(
    input("Enter Grid Frequency(Hz): ")
)

print()

#KPI HEALTH ENGINE:
#Health Score:
def health_score(efficiency, pf, temp_rise):
    score = 100

    if efficiency < 90:
        score -= (90 - efficiency)

    if pf < 0.9:
        score -= (0.9 - pf) * 50

    if temp_rise > 15:
        score -= (temp_rise - 15)

    return max(0, min(100, score))

#THermal Risk:
def thermal_risk(temp_rise):

    if temp_rise < 10:
        return "LOW"

    elif temp_rise < 20:
        return "MEDIUM"

    else:
        return "HIGH"
    
#GRID stress:
def grid_stress(freq, utilization):

    stress = 0

    if freq < 49.5:
        stress += 50

    if utilization > 90:
        stress += 50

    return stress

#BUILD FAILURE PROB:
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

#BUILD ROOT CAUSE ENGINE:
if deltaT > 20:
    root_cause = "Transformer Overheating"

elif pf < 0.8:
    root_cause = "Poor Power Factor"

elif eta < 85:
    root_cause = "Transmission Loss"

elif utilization > 90:
    root_cause = "Grid Overload"

else:
    root_cause = "Normal Operation"

#BUILD RECOMMENDATION ENGINE:
if root_cause == "Transformer Overheating":
    recommendation = "Inspect cooling system"

elif root_cause == "Poor Power Factor":
    recommendation = "Install capacitor bank"

elif root_cause == "Transmission Loss":
    recommendation = "Inspect transmission line"

elif root_cause == "Grid Overload":
    recommendation = "Redistribute load"

else:
    recommendation = "No action required"

#Health Check:
health = health_score(
    eta,
    pf,
    deltaT
)

risk_level = thermal_risk(
    deltaT
)

frequency = float(
    input("Enter Grid Frequency(Hz): ")
)

stress = grid_stress(
    frequency,
    utilization
)

failure_prob = failure_probability(
    eta,
    pf,
    deltaT,
    utilization
)

print()
print("="*50)
print("GRID HEALTH REPORT")
print("="*50)

print(f"Health Score: {health}")
print(f"Thermal Risk: {risk_level}")
print(f"Grid Stress: {stress}")
print(f"Failure Probability: {failure_prob}%")

print()
print(f"Root Cause: {root_cause}")
print(f"Recommendation: {recommendation}")

print("="*50)

#TIME-DEPENDENCY:
efficiency_history = []
temperature_history = []
failure_history = []

efficiency_history.append(eta)
temperature_history.append(deltaT)
failure_history.append(failure_prob)

if len(efficiency_history) >= 3:

    if efficiency_history[-1] < efficiency_history[-2]:

        print("Efficiency Trend: Decreasing")

if len(temperature_history) >= 3:

    if temperature_history[-1] > temperature_history[-2]:

        print("Warning: Temperature Rising")

if health >= 90:
    health_status = "HEALTHY"

elif health >= 70:
    health_status = "WARNING"

else:
    health_status = "CRITICAL"

grid_report = {

    "efficiency": eta,

    "power_loss": Ploss,

    "temperature_rise": deltaT,

    "health_score": health,

    "thermal_risk": risk_level,

    "grid_stress": stress,

    "failure_probability": failure_prob,

    "root_cause": root_cause,

    "recommendation": recommendation

}

print(grid_report)

def get_grid_report():

    report = {

        "efficiency": eta,

        "power_loss": Ploss,

        "temperature_rise": deltaT,

        "health_score": health,

        "thermal_risk": risk_level,

        "grid_stress": stress,

        "failure_probability": failure_prob,

        "root_cause": root_cause,

        "recommendation": recommendation

    }

    return report