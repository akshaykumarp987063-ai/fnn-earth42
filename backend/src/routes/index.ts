import { Router } from "express";
import { creditsRouter } from "./credits";
import { healthRouter } from "./health";
import { heroesRouter } from "./heroes";
import { meRouter } from "./me";
import { privacyRouter } from "./privacy";
import { servicesRouter } from "./services";
import { signalsRouter } from "./signals";
import { sosRouter } from "./sos";
import { tasksRouter } from "./tasks";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/me", meRouter);
apiRouter.use("/credits", creditsRouter);
apiRouter.use("/signals", signalsRouter);
apiRouter.use("/heroes", heroesRouter);
apiRouter.use("/tasks", tasksRouter);
apiRouter.use("/challenges", privacyRouter);
apiRouter.use("/sos", sosRouter);
apiRouter.use("/services", servicesRouter);

