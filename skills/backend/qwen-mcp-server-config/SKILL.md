---
name: qwen-mcp-server-config
description: How to install, configure, and verify MCP servers for Qwen CLI, including troubleshooting auth token delivery methods
source: auto-skill
extracted_at: '2026-05-28T04:38:31.119Z'
---

## Configuring MCP Servers for Qwen CLI

### Location
Settings file: `%USERPROFILE%\.qwen\settings.json`

### Steps

1. **Install the MCP server package globally**
   ```bash
   npm install -g <package-name>
   ```

2. **Test the server starts and lists tools**
   ```bash
   echo {"method":"tools/list","id":1,"jsonrpc":"2.0"} | npx -y <package-name>
   ```
   If the server supports an `--access-token` or `--token` CLI flag, test that first — it's more reliable than env vars.

3. **If CLI flag fails, try env var approach**
   ```bash
   set "ENV_VAR_NAME=your-token" && echo {"method":"tools/list","id":1,"jsonrpc":"2.0"} | npx -y <package-name>
   ```

4. **Add to settings.json** under the `mcpServers` key:

   **Preferred: CLI flag approach** (more reliable across platforms)
   ```json
   "mcpServers": {
     "server-name": {
       "command": "npx",
       "args": ["-y", "package-name", "--access-token", "your-token-here"]
     }
   }
   ```

   **Alternative: env var approach** (use if CLI flag not supported)
   ```json
   "mcpServers": {
     "server-name": {
       "command": "npx",
       "args": ["-y", "package-name"],
       "env": {
         "ENV_VAR_NAME": "your-token-here"
       }
     }
   }
   ```

5. **Validate JSON**
   ```bash
   node -e "try { require('%USERPROFILE%\\.qwen\\settings.json'); console.log('Valid JSON'); } catch(e) { console.log('INVALID JSON: ' + e.message); }"
   ```

### Known Patterns by Server

| Server | Package | Auth Method | Token Prefix | Notes |
|---|---|---|---|---|
| GitHub | `@modelcontextprotocol/server-github` | Env var `GITHUB_PERSONAL_ACCESS_TOKEN` | `ghp_` or `github_pat_` | ⚠️ Deprecated on npm but still functional. No official replacement yet. |
| Supabase | `@supabase/mcp-server-supabase` | CLI `--access-token` flag | `sbp_` | Official, actively maintained (v0.8+). |

### Troubleshooting

- **"Please provide a personal access token" error**: The server didn't receive the token. Switch from env var to CLI `--access-token` flag (or vice versa).
- **npm package not found**: Try `npx -y` directly in args instead of `npm install -g`.
- **Server starts but tools fail**: Token may be expired or lack required scopes. Regenerate the token.
- **Always test with `echo {"method":"tools/list"...}` before editing settings.json** to avoid restarting Qwen CLI with a broken config.
