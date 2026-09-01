import { applySafetyRules } from "../rules/safetyRules";

const tests = [
  {
    input: "There is a fire near the hostel.",
    expected: "FIRE",
  },
  {
    input: "A student is unconscious near the academic block.",
    expected: "MEDICAL",
  },
  {
    input: "Someone is attacking another student with a weapon.",
    expected: "PERSONAL_SAFETY",
  },
];

for (const test of tests) {
  const result = applySafetyRules(test.input);

  if (!result) {
    throw new Error(`No rule matched: ${test.input}`);
  }

  if (result.category !== test.expected) {
    throw new Error(
      `Expected ${test.expected}, got ${result.category}`
    );
  }

  console.log(
    `PASS: ${test.input} → ${result.category} / ${result.severity}`
  );
}

console.log("All safety rule tests passed.");
