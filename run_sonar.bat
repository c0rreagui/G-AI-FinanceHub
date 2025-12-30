@echo off
:: Wrapper script to run SonarQube MCP via Docker cleanly
:: Redirects stderr to a log file to prevent JSON-RPC corruption
docker run -i --rm -e SONARQUBE_TOKEN -e SONARQUBE_ORG -e SONARQUBE_URL mcp/sonarqube stdio 2> "c:\APPS - ANTIGRAVITY\FinanceHub\G-AI-FinanceHub\sonar_mcp.log"
