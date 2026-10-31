
require("dotenv").config();

const http = require("node:http");

// Start your existing BullMQ worker
require("./audit.worker");

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
    if (req.url === "/health" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "application/json",
        });

        res.end(JSON.stringify({
            status: "ok",
            service: "edgelink-bullmq-worker",
        }));

        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Health server listening on port ${PORT}`);
});
