import { createApp } from "./createApp";
import { config } from "./config";

const app = createApp();
const port = config.server.port;

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
