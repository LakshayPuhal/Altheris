import pandas as pd
import json
import os
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import IsolationForest
import smtplib
from email.mime.text import MIMEText
from email.mime.text import MIMEText
msg = MIMEText('Anomaly detected in logs')
msg['Subject'] = 'AItheris Log Anomaly Alert'
msg['From'] = os.getenv('SMTP_EMAIL')
msg['To'] = os.getenv('ALERT_EMAIL')
with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
    server.login(os.getenv('SMTP_EMAIL'), os.getenv('SMTP_PASSWORD'))
    server.sendmail(msg['From'], msg['To'], msg.as_string())

def send_alert(anomalies):
    msg = MIMEText(f"Detected anomalies:\n{anomalies.to_string()}")
    msg['Subject'] = 'AItheris Log Anomaly Alert'
    msg['From'] = os.getenv('SMTP_EMAIL')
    msg['To'] = os.getenv('ALERT_EMAIL')

    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(os.getenv('SMTP_EMAIL'), os.getenv('SMTP_PASSWORD'))
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

    if not anomalies.empty and os.getenv('SMTP_EMAIL') and os.getenv('SMTP_PASSWORD') and os.getenv('ALERT_EMAIL'):
        try:
            send_alert(anomalies)
            print("Alert email sent to", os.getenv('ALERT_EMAIL'))
        except Exception as e:
            print("Failed to send alert email:", str(e))
    else:
        print("SMTP_EMAIL, SMTP_PASSWORD, or ALERT_EMAIL not set, skipping alert")

if __name__ == "__main__":
    analyze_logs('../logs/app.log')