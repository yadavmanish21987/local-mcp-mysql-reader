# local-mcp-mysql-reader

[![npm version](https://img.shields.io/npm/v/local-mcp-mysql-reader.svg)](https://www.npmjs.com/package/local-mcp-mysql-reader)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An open-source [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that allows AI assistants (Cursor, Claude Desktop, Windsurf, Antigravity, etc.) to safely read schemas and execute `SELECT` queries on your local MySQL databases.

---

## 🌟 Features

* **Safe & Read-Only:** Enforces query restrictions to strictly allow `SELECT` statements, preventing accidental `UPDATE`, `INSERT`, `DELETE`, or `DROP` execution.
* **Environment Variable Configuration:** Credentials are kept secure and passed dynamically via environment variables.
* **Formatted JSON Output:** Formats raw database output as clean, structured JSON so AI models can easily parse, analyze, and synthesize query results.
* **Plug-and-Play:** Zero manual schema boilerplate needed—just plug it into your MCP-compatible IDE or assistant and start asking questions.

---

## 📋 Prerequisites

* **Node.js**: `v18.0.0` or higher
* **MySQL Server**: Accessible local database

---

## ⚙️ Environment Variables

The server uses standard database environment variables to establish a connection:

| Variable | Description | Default Value | Required |
| :--- | :--- | :--- | :--- |
| `DB_USER` | MySQL database username | - | **Yes** |
| `DB_PASSWORD` | MySQL database password | - | No (if empty) |
| `DB_NAME` | Database name to query | - | **Yes** |
| `DB_HOST` | Host address of the database | `localhost` | No |
| `DB_PORT` | Port of the database | `3306` | No |

---

## 🚀 Quick Setup Guide

### 1. Cursor IDE

Go to **Cursor Settings** > **Features** > **MCP Servers** > **+ Add New MCP Server**.

* **Name:** `local-mcp-mysql-reader`
* **Type:** `command`
* **Command:**

  * **macOS / Linux:**
    ```bash
    npx -y local-mcp-mysql-reader
    ```
  * **Windows:**
    ```cmd
    npx.cmd -y local-mcp-mysql-reader
    ```

* **Environment Variables:**
  ```env
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  DB_NAME=your_db_name
  DB_HOST=localhost
  DB_PORT=3306