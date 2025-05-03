import pandas as pd
import json
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import IsolationForest
import smtplib
from email.mime.text import MIMEText

def send_alert(anomalies):
    msg = MIMEText(f"Detected anomalies:\n{anomalies.to_string()}")
    msg['Subject'] = 'AItheris Log Anomaly Alert'
    msg['From'] = 'your_email@example.com'
    msg['To'] = 'your_email@example.com'

    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login('your_email@example.com', 'your_app_password')
        server.send_message(msg)

def load_logs(log_file):
    logs = []
    with open(log_file, 'r') as f:
        for line in f:
            try:
                log = json.loads(line)
                logs.append(log)
            except json.JSONDecodeError:
                continue
    return pd.DataFrame(logs)

def analyze_logs(log_file):
    df = load_logs(log_file)
    if df.empty:
        print("No logs to analyze")
        return

    df['message'] = df['message'].astype(str)
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(df['message'])

    model = IsolationForest(contamination=0.1, random_state=42)
    df['anomaly'] = model.fit_predict(X)

    anomalies = df[df['anomaly'] == -1]
    print("Detected anomalies:")
    print(anomalies[['timestamp', 'message', 'status', 'duration']])

    if not anomalies.empty:
        send_alert(anomalies)

if __name__ == "__main__":
    analyze_logs('../logs/app.log')