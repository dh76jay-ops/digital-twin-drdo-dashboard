
import streamlit as st
import pandas as pd
import numpy as np
import joblib
import time
import plotly.graph_objects as go

st.set_page_config(page_title="Aero Piston Engine Digital Twin", layout="wide", page_icon="⚙️")

# ---- Minimal Research-Grade Theme ----
st.markdown("""
<style>
    .stApp {
        background-color: #FAFAFA;
        color: #1A1A1A;
        font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
    }
    section[data-testid="stSidebar"] {
        background-color: #F0F2F5;
        border-right: 1px solid #D0D5DB;
    }
    section[data-testid="stSidebar"] * {
        color: #1A1A1A !important;
    }
    section[data-testid="stSidebar"] h1,
    section[data-testid="stSidebar"] h3 {
        color: #1B2A4A !important;
    }
    h1 {
        color: #1B2A4A;
        font-weight: 600;
        font-size: 26px;
        margin-bottom: 0px;
    }
    .subtitle {
        color: #5A6472;
        font-size: 14px;
        margin-bottom: 24px;
    }
    h2, h3 {
        color: #1B2A4A;
        font-weight: 600;
    }
    div[data-testid="stMetric"] {
        background-color: #FFFFFF;
        border: 1px solid #E0E3E8;
        border-radius: 4px;
        padding: 14px;
    }
    div[data-testid="stMetricLabel"] {
        color: #5A6472 !important;
        font-size: 12px !important;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    div[data-testid="stMetricValue"] {
        color: #1B2A4A !important;
        font-weight: 600 !important;
    }
    .status-badge {
        display: inline-block;
        padding: 6px 16px;
        border-radius: 3px;
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }
    .stSlider label { color: #3A4250 !important; font-weight: 500; font-size: 13px; }
    div[role="radiogroup"] label { color: #1A1A1A !important; }
    .info-box {
        background-color: #FFFFFF;
        border: 1px solid #E0E3E8;
        border-left: 3px solid #1B2A4A;
        border-radius: 3px;
        padding: 12px 16px;
        font-size: 12.5px;
        color: #3A4250;
        margin-bottom: 12px;
    }
</style>
""", unsafe_allow_html=True)

# ---- Grade colors (muted, professional) ----
GRADE_COLORS = {
    "NORMAL": "#2E7D32",
    "WARNING": "#B8860B",
    "ALARM": "#D2691E",
    "EMERGENCY": "#B71C1C"
}
GRADE_RANK = {"NORMAL": 0, "WARNING": 1, "ALARM": 2, "EMERGENCY": 3}

# ---- Load Models & Data ----
@st.cache_resource
def load_models():
    fault_model = joblib.load('fault_model.pkl')
    anomaly_model = joblib.load('anomaly_model.pkl')
    rul_model = joblib.load('rul_model.pkl')
    return fault_model, anomaly_model, rul_model

@st.cache_data
def load_data():
    return pd.read_csv('digital_twin_dataset.csv')

fault_model, anomaly_model, rul_model = load_models()
dataset = load_data()
sensor_cols = ['RPM', 'CHT', 'EGT', 'Oil_Pressure', 'Vibration']
RUL_MAX = 500

def compute_health_index(rul_value, rul_max=RUL_MAX):
    hi = float(np.clip(rul_value / rul_max, 0, 1))
    if hi >= 0.60:
        grade = "NORMAL"
    elif hi >= 0.35:
        grade = "WARNING"
    elif hi >= 0.15:
        grade = "ALARM"
    else:
        grade = "EMERGENCY"
    return round(hi, 3), grade

def assess(sensor_reading: dict):
    start = time.time()
    row_df = pd.DataFrame([sensor_reading])[sensor_cols]
    row_arr = row_df.values

    fault_pred = fault_model.predict(row_df)[0]
    fault_prob = fault_model.predict_proba(row_df)[0][1]
    anomaly_flag = anomaly_model.predict(row_df)[0]

    tree_preds = np.array([t.predict(row_arr)[0] for t in rul_model.estimators_])
    rul_mean, rul_std = tree_preds.mean(), tree_preds.std()

    hi_value, hi_grade = compute_health_index(rul_mean)
    signal_grade = "ALARM" if (fault_pred == 1 or anomaly_flag == -1) else "NORMAL"
    final_grade = max(hi_grade, signal_grade, key=lambda g: GRADE_RANK[g])

    latency_ms = round((time.time() - start) * 1000, 2)

    return {
        'health_status': final_grade,
        'health_index': hi_value,
        'fault_detected': bool(fault_pred),
        'fault_probability': round(fault_prob, 3),
        'anomaly_flag': 'Anomaly' if anomaly_flag == -1 else 'Normal',
        'estimated_RUL': round(rul_mean, 1),
        'RUL_uncertainty': round(rul_std, 1),
        'response_time_ms': latency_ms
    }

def status_badge_html(grade):
    color = GRADE_COLORS[grade]
    return f'<span class="status-badge" style="background-color:{color}22; color:{color}; border:1px solid {color}55;">● {grade}</span>'

def plotly_light_theme(fig, height=420):
    fig.update_layout(
        template="plotly_white",
        paper_bgcolor="#FFFFFF",
        plot_bgcolor="#FFFFFF",
        font=dict(color="#1A1A1A", size=12),
        height=height,
        margin=dict(l=40, r=20, t=40, b=40),
        legend=dict(bgcolor="rgba(0,0,0,0)")
    )
    fig.update_xaxes(gridcolor="#EEF0F2", linecolor="#D0D5DB")
    fig.update_yaxes(gridcolor="#EEF0F2", linecolor="#D0D5DB")
    return fig

# ---- Sidebar ----
st.sidebar.markdown("### Digital Twin — Aero Piston Engine")
st.sidebar.caption("MALE UAV Health Monitoring System")
st.sidebar.markdown("---")
mode = st.sidebar.radio("Mode", ["Live Sensor Input", "Mission Replay"])

st.sidebar.markdown("---")
st.sidebar.markdown("**System Specifications**")
st.sidebar.caption("Fault Classifier: Random Forest — 96% accuracy")
st.sidebar.caption("RUL Estimator: RF Regressor — MAE 12.76 (LSTM-validated)")
st.sidebar.caption("Anomaly Detector: Isolation Forest")
st.sidebar.caption("Latency: 77ms avg — real-time compliant")

# ---- Header ----
st.markdown("<h1>AI-Driven Digital Twin — Aero Piston Engine</h1>", unsafe_allow_html=True)
st.markdown('<div class="subtitle">MALE UAV Predictive Maintenance Prototype &nbsp;|&nbsp; DRDO / IDEX &nbsp;|&nbsp; Category: Software, Theme: Robotics & Drones</div>', unsafe_allow_html=True)

# ============ MODE 1 ============
if mode == "Live Sensor Input":
    st.markdown("#### Real-Time Sensor Assessment")
    st.markdown('<div class="info-box">Adjust telemetry values below to simulate a live sensor reading. The Digital Twin Core evaluates fault probability, anomaly status, and remaining useful life (RUL) in real time.</div>', unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    with col1:
        rpm = st.slider("RPM", 2000, 2600, 2300)
        cht = st.slider("Cylinder Head Temp — CHT (°C)", 170, 240, 195)
        egt = st.slider("Exhaust Gas Temp — EGT (°C)", 700, 900, 800)
    with col2:
        oil_pressure = st.slider("Oil Pressure (PSI)", 30, 70, 60)
        vibration = st.slider("Vibration (g)", 0.4, 1.5, 0.8, step=0.01)

    sample = {'RPM': rpm, 'CHT': cht, 'EGT': egt, 'Oil_Pressure': oil_pressure, 'Vibration': vibration}
    result = assess(sample)

    st.markdown("---")
    st.markdown("#### Digital Twin Assessment")

    c0, c1, c2, c3 = st.columns([1.3, 1, 1, 1])
    with c0:
        st.markdown("**Health Status**")
        st.markdown(status_badge_html(result['health_status']), unsafe_allow_html=True)
        st.progress(result['health_index'])
        st.caption(f"Health Index: {result['health_index']}")
    c1.metric("Fault Probability", f"{result['fault_probability']*100:.1f}%")
    c2.metric("Estimated RUL", f"{result['estimated_RUL']} cyc", delta=f"± {result['RUL_uncertainty']} cyc", delta_color="off")
    c3.metric("Response Time", f"{result['response_time_ms']} ms")

    st.caption(f"Anomaly Detection: {result['anomaly_flag']}  |  Fault Classifier: {'Fault Detected' if result['fault_detected'] else 'No Fault Detected'}")

# ============ MODE 2 ============
else:
    st.markdown("#### Mission Replay — Historical Telemetry")
    st.markdown('<div class="info-box">Replay a completed simulated mission cycle-by-cycle. The health assessment updates dynamically as the mission progresses, replicating post-flight analysis capability.</div>', unsafe_allow_html=True)

    col_a, col_b = st.columns([1, 3])
    with col_a:
        engine_ids = sorted(dataset['engine_id'].unique())
        selected_engine = st.selectbox("Engine ID", engine_ids)
        engine_data = dataset[dataset['engine_id'] == selected_engine].reset_index(drop=True)
        time_step = st.slider("Time Cycle", 0, len(engine_data)-1, 0)

    current_row = engine_data.iloc[time_step]
    sample = {col: current_row[col] for col in sensor_cols}
    result = assess(sample)

    st.markdown("---")
    c0, c1, c2, c3 = st.columns([1.3, 1, 1, 1])
    with c0:
        st.markdown("**Health Status**")
        st.markdown(status_badge_html(result['health_status']), unsafe_allow_html=True)
        st.progress(result['health_index'])
        st.caption(f"Health Index: {result['health_index']}")
    c1.metric("Fault Probability", f"{result['fault_probability']*100:.1f}%")
    c2.metric("Estimated RUL", f"{result['estimated_RUL']} cyc", delta=f"± {result['RUL_uncertainty']} cyc", delta_color="off")
    c3.metric("Response Time", f"{result['response_time_ms']} ms")

    st.markdown("---")
    st.markdown("#### Sensor Telemetry — Full Mission")

    fig = go.Figure()
    colors = {'RPM': '#1B2A4A', 'CHT': '#B71C1C', 'EGT': '#D2691E', 'Oil_Pressure': '#2E7D32', 'Vibration': '#5A6472'}
    for col in sensor_cols:
        fig.add_trace(go.Scatter(
            x=engine_data['time'], y=engine_data[col], mode='lines',
            name=col, line=dict(color=colors[col], width=1.6)
        ))
    fig.add_vline(x=time_step, line_dash="dash", line_color="#B71C1C", line_width=1.5)
    fig = plotly_light_theme(fig)
    fig.update_layout(xaxis_title="Time Cycle", legend=dict(orientation="h", y=-0.2))
    st.plotly_chart(fig, use_container_width=True)

    st.caption("Dashed line indicates the currently selected time cycle. Sensor scales are shown in native units.")
