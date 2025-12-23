// Tiny local proxy to avoid CORS when calling TfNSW API from the browser.
// Usage:
//   TFNSW_KEY=your_key node server.js
// Then load tfnsw.html (it will call http://localhost:3000).

const http = require("http");

const PORT = process.env.PORT || 3000;

const setCors = (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-api-key");
};

const handler = async (req, res) => {
    setCors(res);
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, "http://localhost");
    const key = req.headers["x-api-key"] || process.env.TFNSW_KEY;
    if (!key) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing x-api-key header or TFNSW_KEY env" }));
        return;
    }

    try {
        if (url.pathname === "/stop_finder") {
            const name = url.searchParams.get("name") || "";
            const upstream = new URL("https://api.transport.nsw.gov.au/v1/tp/stop_finder");
            upstream.searchParams.set("outputFormat", "rapidJSON");
            upstream.searchParams.set("type_sf", "any");
            upstream.searchParams.set("name_sf", name);
            await forward(upstream, key, res);
            return;
        }

        if (url.pathname === "/departures") {
            const stopId = url.searchParams.get("stopId") || "";
            const upstream = new URL("https://api.transport.nsw.gov.au/v1/tp/departure_mon");
            upstream.searchParams.set("outputFormat", "rapidJSON");
            upstream.searchParams.set("type_dm", "stop");
            upstream.searchParams.set("name_dm", stopId);
            upstream.searchParams.set("mode", "direct");
            upstream.searchParams.set("depArrMacro", "dep");
            upstream.searchParams.set("TfNSWSF", "true");
            upstream.searchParams.set("limit", "30");
            await forward(upstream, key, res);
            return;
        }

        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message || String(err) }));
    }
};

const forward = async (url, key, res) => {
    const upstreamResp = await fetch(url, { headers: { Authorization: "apikey " + key } });
    const text = await upstreamResp.text();
    res.writeHead(upstreamResp.status, { "Content-Type": "application/json" });
    res.end(text);
};

http.createServer(handler).listen(PORT, () => {
    console.log(`Proxy listening on http://localhost:${PORT}`);
});

