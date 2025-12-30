# Test MCP Integrations

# SonarQube token test
$sonarToken = "YOUR_SONAR_TOKEN_HERE"
$sonarOrg = "c0rreagui"
$sonarProjectKey = "c0rreagui_G-AI-FinanceHub"
$sonarUrl = "https://sonarcloud.io/api/project_analyses/search?project=$sonarProjectKey"
Write-Host "Testing SonarQube API..."
$sonarResponse = Invoke-RestMethod -Method Get -Uri $sonarUrl -Headers @{ "Authorization" = "Bearer $sonarToken" }
Write-Host "SonarQube response status: $($sonarResponse | ConvertTo-Json -Depth 2)"

# GitHub PAT test
$githubPat = "YOUR_GITHUB_PAT_HERE"
$githubUserUrl = "https://api.github.com/user"
Write-Host "Testing GitHub API..."
$githubResponse = Invoke-RestMethod -Method Get -Uri $githubUserUrl -Headers @{ "Authorization" = "token $githubPat"; "User-Agent" = "MCP-Test" }
Write-Host "GitHub user login: $($githubResponse.login)"

# Supabase DB access test (service_role)
$supabaseUrl = "https://nblzuljuuuvdzrqakccd.supabase.co"
$supabaseServiceRoleKey = "YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE"
Write-Host "Testing Supabase DB access (service_role)..."
$dbResponse = Invoke-RestMethod -Method GET -Uri "$supabaseUrl/rest/v1/" -Headers @{ "apikey" = $supabaseServiceRoleKey; "Authorization" = "Bearer $supabaseServiceRoleKey" }
Write-Host "Supabase DB response: $($dbResponse | ConvertTo-Json -Depth 2)"

# Supabase management API test (personal token)
$supabasePersonalToken = "YOUR_SUPABASE_PERSONAL_TOKEN_HERE"
Write-Host "Testing Supabase Management API..."
$mgmtResponse = Invoke-RestMethod -Method GET -Uri "https://api.supabase.com/v1/projects" -Headers @{ "Authorization" = "Bearer $supabasePersonalToken" }
Write-Host "Supabase Management response: $($mgmtResponse | ConvertTo-Json -Depth 2)"
