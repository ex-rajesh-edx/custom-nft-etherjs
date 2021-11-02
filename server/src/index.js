import app from "./config/express";
import { logger } from "./config/logger";
import { env, port } from "./config/variables";


// listen to requests
app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

// export express app
module.exports = app;




