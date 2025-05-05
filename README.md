# AItheris

A Node.js app with CI/CD, self-healing, and AI-driven log analysis.

## Setup
1. Clone: `git clone https://github.com/LakshayPuhal/Altheris.git`.
2. Install dependencies: `cd app && npm install`.
3. Run: `docker-compose up -d`.
4. AI log analysis setup:
   ```bash
   cd log-analyzer
   python3 -m venv venv
   source venv/bin/activate
   pip install pandas scikit-learn
   ```
5. Email alerts (optional):
   ```bash
   export SMTP_EMAIL='your_email@gmail.com'
   export SMTP_PASSWORD='your_app_password'
   export ALERT_EMAIL='recipient_email@gmail.com'
   ```
   Generate an App Password at myaccount.google.com/security.
6. Run analysis: `python analyze_logs.py`.

## Monitoring
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (login: admin/admin, set new password)
  - Data source: Prometheus, URL: http://prometheus:9090
  - Dashboard: Query `http_requests_total` for HTTP request metrics.

## Self-Healing
- Monitor service checks /health and rolls back to stable if unhealthy.
