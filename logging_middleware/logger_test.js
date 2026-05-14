// Example usage in Backend
const { Log } = require('./logging_middleware/logger');

// In your handlers
async function someHandler(req, res) {
  try {
    Log("backend", "info", "handler", "Processing request for user");

    // ... your logic
    const data = await someDbOperation();

    Log("backend", "debug", "db", `Fetched ${data.length} records`);

  } catch (err) {
    Log("backend", "error", "handler", `Error: ${err.message}`);
    Log("backend", "fatal", "db", "Critical database failure");
  }
}