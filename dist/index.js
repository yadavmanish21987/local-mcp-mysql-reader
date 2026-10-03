#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import mysql from "mysql2/promise";
// 1. Initialize the MySQL Connection Pool
// It will look for standard database environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    port: parseInt(process.env.DB_PORT || "3306"), // MySQL default port is 3306
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// 2. Initialize the MCP Server
const server = new Server({ name: "local-mcp-mysql-reader", version: "1.0.3" }, { capabilities: { tools: {} } });
// 3. Describe the tool to the AI
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "run_select_query",
                description: "Executes a SELECT query on the local MySQL database to read data or inspect schemas. Only SELECT queries are permitted.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "The raw SQL SELECT query to execute."
                        }
                    },
                    required: ["query"]
                }
            }
        ]
    };
});
// 4. Handle the query execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "run_select_query") {
        const sqlQuery = request.params.arguments?.query;
        if (!sqlQuery) {
            throw new Error("A SQL query must be provided.");
        }
        // Safety constraint: Prevent destructive operations
        const upperQuery = sqlQuery.toUpperCase().trim();
        if (upperQuery.includes("INSERT") || upperQuery.includes("UPDATE") || upperQuery.includes("DELETE") || upperQuery.includes("DROP") || upperQuery.includes("ALTER")) {
            return {
                content: [{ type: "text", text: "Error: This MCP server is in read-only mode. Only SELECT queries are allowed." }]
            };
        }
        try {
            // Execute the query. mysql2 returns an array where the first element contains the rows.
            const [rows] = await pool.query(sqlQuery);
            // Format the output to nicely structured JSON
            const formattedResult = JSON.stringify(rows, null, 2);
            return {
                content: [{ type: "text", text: `Query executed successfully.\n\n${formattedResult}` }]
            };
        }
        catch (error) {
            // Catch SQL syntax errors or connection issues
            return {
                content: [{ type: "text", text: `Database Error: ${error.message}` }]
            };
        }
    }
    throw new Error("Tool not found");
});
// 5. Start the server using stdio transport
async function run() {
    // Verify credentials are provided before starting
    if (!process.env.DB_USER || !process.env.DB_NAME) {
        console.error("Missing required environment variables. Please provide DB_USER and DB_NAME.");
        process.exit(1);
    }
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Local MySQL Reader MCP Server running on stdio");
}
run().catch(console.error);
//# sourceMappingURL=index.js.map