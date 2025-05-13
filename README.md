# AItheris

A Node.js app with CI/CD, self-healing, and AI-driven log analysis.

## Setup
1. Clone: `git clone https://github.com/LakshayPuhal/Altheris.git`.
2. Install dependencies: `cd app && npm install`.
3. Run: `docker-compose up -d`.

## Monitoring
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (login: admin/admin, set new password)
  - Add Prometheus data source:
    - Name: AItheris Prometheus
    - URL: http://prometheus:9090
    - Save & Test
  - Import dashboard (recommended):
    - Go to Dashboards > New > Import
    - Upload `grafana-dashboard.json` or paste its contents
    - Select AItheris Prometheus data source
    - Import to view HTTP request metrics
  - Or create dashboard manually:
    - New Dashboard > Add visualization
    - Query: `http_requests_total`
    - Legend: `{{method}} {{path}} {{status}}`
    - Add overrides (e.g., red for status=500)
    - Save as 'AItheris Metrics'
  - Generate metrics: `curl http://localhost:3000/health; curl http://localhost:3000/crash`

## AI Log Analysis
1. Setup: `cd log-analyzer; python3 -m venv venv; source venv/bin/activate; pip install pandas scikit-learn`.
2. Email alerts (optional):
   ```bash
   export SMTP_EMAIL='your_email@gmail.com'
   export SMTP_PASSWORD='your_app_password'
   export ALERT_EMAIL='recipient_email@gmail.com'
   ```
   Generate an App Password at myaccount.google.com/security.
3. Run: `python analyze_logs.py`.

## Self-Healing
- Monitor checks /health and rolls back to `lakshaypuhal/app:stable` if unhealthy.

## CI/CD
- GitHub Actions builds and deploys to Docker Hub (`lakshaypuhal/app:latest`).
