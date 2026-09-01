import "dotenv/config";
import { analyzeIncident } from "../classifier/analyzeIncident";

async function run() {

  console.log("\nTEST 1 — Emergency rule");

  const fire = await analyzeIncident(
    "There is a fire near the hostel."
  );

  console.log(fire);

  if (
    fire.category !== "FIRE" ||
    fire.severity !== "CRITICAL"
  ) {
    throw new Error("Fire test failed");
  }

  console.log("PASS");


  console.log("\nTEST 2 — Medical emergency");

  const medical = await analyzeIncident(
    "A student is unconscious near the academic block."
  );

  console.log(medical);

  if (
    medical.category !== "MEDICAL" ||
    medical.severity !== "CRITICAL"
  ) {
    throw new Error("Medical test failed");
  }

  console.log("PASS");


  console.log("\nTEST 3 — Normal incident");

  const normal = await analyzeIncident(
    "There is a broken water pipe near the academic block."
  );

  console.log(normal);

  if (!normal.category) {
    throw new Error("Normal incident test failed");
  }

  console.log("PASS");


  console.log("\nALL ANALYZER TESTS PASSED");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
