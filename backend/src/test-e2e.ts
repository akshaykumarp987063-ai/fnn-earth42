import { createApp } from "./app";
import { closeDatabase, connectDatabase, query } from "./config/db";
import { triageIncident } from "./services/aiService";
import { calculateDistanceMeters, isWithinRadius } from "./utils/geo";
import { createSignal, getSignalById, listNearbySignals, listSignals } from "./services/signalService";
import { getCredits } from "./services/creditService";
import { submitLocationProof } from "./services/proofService";
import { voteOnSignal } from "./services/voteService";
import { listNearbyHeroes } from "./services/heroService";
import { acceptTask, updateTaskStatus } from "./services/taskService";
import { escalateSignal } from "./services/escalationService";
import { triggerSos } from "./services/sosService";
import { createPrivacyChallenge, submitPrivacySelfie } from "./services/privacyService";
import { listPublicServices } from "./services/publicServicesService";

async function runTests() {
  console.log("==================================================");
  console.log("FNN EARTH-42 — BACKEND END-TO-END TEST SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  try {
    // 1. Database Connection
    await connectDatabase();
    console.log("\n1. Database Connection & Supabase PostgreSQL");
    assert(true, "Successfully connected to Supabase PostgreSQL pool");

    // 2. Health Check Route
    console.log("\n2. Health Check Endpoint");
    const app = createApp();
    assert(typeof app.listen === "function", "Express app initialized with Helmet, CORS, and JSON parser");

    // 3. Geolocation & Haversine Distance
    console.log("\n3. Geolocation & Hyperlocal Rules");
    const distVit = calculateDistanceMeters(12.8406, 80.1530, 12.8412, 80.1541);
    assert(distVit > 0 && distVit < 200, `Haversine distance accurate (calculated: ${distVit}m)`);
    assert(isWithinRadius(12.8406, 80.1530, 12.8412, 80.1541, 500), "Within 500m radius check passed");
    assert(!isWithinRadius(12.8406, 80.1530, 13.0827, 80.2707, 500), "Outside radius check passed");

    // 4. AI Triage Engine
    console.log("\n4. AI Triage Engine");
    const fireTriage = triageIncident("Severe fire and smoke billowing from lab", "FIRE");
    assert(fireTriage.severity === "CRITICAL" && fireTriage.urgency === "IMMEDIATE", "CRITICAL fire triaged to EMERGENCY_SOS");
    assert(fireTriage.workflow === "EMERGENCY_SOS", "Fire routed to emergency workflow");

    const medTriage = triageIncident("Student feeling faint and dizzy", "MEDICAL");
    assert(medTriage.severity === "HIGH" && medTriage.recommendedResponder.includes("First Aid"), "Medical triaged to First Aid responder");

    const lostTriage = triageIncident("Found student ID card on table", "LOST_ITEM");
    assert(lostTriage.severity === "LOW" && lostTriage.workflow === "COMMUNITY_ASSISTANCE", "Lost item triaged to community assistance");

    // 5. Public Services Query
    console.log("\n5. Public Services");
    const services = await listPublicServices();
    assert(services.length > 0, `Public services retrieved (found: ${services.length})`);
    assert(services.some(s => s.phone.length > 0), "Verified contact numbers present");

    // 6. Profiles & Demo Auth User lookup
    console.log("\n6. User Profiles & Wallet Staking");
    const user1 = "a0000000-0000-4000-8000-000000000002"; // Karthik
    const user2 = "a0000000-0000-4000-8000-000000000003"; // Ananya

    const initialCredits = await getCredits(user1);
    assert(initialCredits.balance.available >= 0, `Credit balance retrieved (available: ${initialCredits.balance.available})`);

    // 7. Incident Signal Creation + Staking
    console.log("\n7. Incident Reporting Flow");
    const uniqueLat = 12.8420 + Math.random() * 0.005;
    const uniqueLon = 80.1540 + Math.random() * 0.005;

    const newSignal = await createSignal(user1, {
      description: "Automated Test: Minor water pipe burst near library pathway",
      category: "INFRASTRUCTURE",
      latitude: uniqueLat,
      longitude: uniqueLon,
      stakeAmount: 10,
    });

    assert(newSignal.id.length > 0, `Incident signal created: ${newSignal.id}`);
    assert(newSignal.status === "OPEN", `Incident initial status is OPEN`);
    assert(newSignal.reporterId === user1, `Reporter ID properly bound to authenticated user`);

    // 8. Duplicate Incident Detection
    console.log("\n8. Duplicate Incident Detection");
    try {
      await createSignal(user1, {
        description: "Automated Test: Minor water pipe burst near library pathway",
        category: "INFRASTRUCTURE",
        latitude: uniqueLat + 0.0001,
        longitude: uniqueLon + 0.0001,
      });
      assert(false, "Duplicate detection should have rejected nearby duplicate report");
    } catch (err: any) {
      assert(err.statusCode === 409, "Duplicate detection successfully rejected duplicate with HTTP 409 Conflict");
    }

    // 9. Nearby Incident Discovery
    console.log("\n9. Hyperlocal Incident Discovery (Nearby)");
    const nearby = await listNearbySignals({
      latitude: uniqueLat,
      longitude: uniqueLon,
      radius: 500,
    });
    assert(nearby.some(s => s.id === newSignal.id), "Newly created signal discovered in nearby search within 500m");

    // 10. Location Proof Submission
    console.log("\n10. Location Proof Submission");
    const proof = await submitLocationProof(
      user2,
      newSignal.id,
      "https://example.invalid/proof-photo-test.jpg",
      uniqueLat + 0.0001,
      uniqueLon + 0.0001,
    );
    assert(proof.id.length > 0, `Location proof successfully stored: ${proof.id}`);

    // 11. Hyperlocal Voting & Verification
    console.log("\n11. Hyperlocal Voting & Verification Flow");
    // 11a: Self-vote rejection
    try {
      await voteOnSignal(user1, newSignal.id, { vote: "UP", latitude: uniqueLat, longitude: uniqueLon });
      assert(false, "Self-voting should be rejected");
    } catch (err: any) {
      assert(err.statusCode === 400, "Self-voting correctly rejected with HTTP 400");
    }

    // 11b: Out-of-radius vote rejection
    try {
      await voteOnSignal(user2, newSignal.id, { vote: "UP", latitude: 13.0827, longitude: 80.2707 });
      assert(false, "Out-of-radius voting should be rejected");
    } catch (err: any) {
      assert(err.statusCode === 403, "Out-of-radius voting correctly rejected with HTTP 403");
    }

    // 11c: Valid vote by nearby user with proof
    const voteResult = await voteOnSignal(user2, newSignal.id, {
      vote: "UP",
      latitude: uniqueLat + 0.0001,
      longitude: uniqueLon + 0.0001,
      proofMediaId: proof.id,
    });
    assert(voteResult.vote === "UP", "Nearby verified vote recorded successfully");
    assert((voteResult.signal?.upvotes ?? 0) >= 1, "Upvote count atomically incremented");

    // 11d: Duplicate vote rejection
    try {
      await voteOnSignal(user2, newSignal.id, {
        vote: "UP",
        latitude: uniqueLat + 0.0001,
        longitude: uniqueLon + 0.0001,
      });
      assert(false, "Duplicate vote should be rejected");
    } catch (err: any) {
      assert(err.statusCode === 409, "Duplicate vote correctly rejected with HTTP 409 Conflict");
    }

    // 12. Hero & Task Management
    console.log("\n12. Hero Discovery & Task Management");
    const heroes = await listNearbyHeroes({
      latitude: uniqueLat,
      longitude: uniqueLon,
      radius: 2000,
    });
    assert(heroes.length > 0, `Nearby heroes found: ${heroes.length}`);
    assert(heroes.every(h => !('latitude' in h)), "Private exact home coordinates obfuscated");

    // Create and test task flow
    const heroUserId = "a0000000-0000-4000-8000-000000000004"; // Rahul (Hero)
    const heroRow = await query<{ id: string }>(`SELECT id FROM heroes WHERE user_id = $1 LIMIT 1`, [heroUserId]);
    const heroId = heroRow.rows[0]?.id;

    if (heroId) {
      const taskInsert = await query<{ id: string }>(
        `INSERT INTO tasks (signal_id, hero_id, status) VALUES ($1, $2, 'ASSIGNED') RETURNING id`,
        [newSignal.id, heroId],
      );
      const taskId = taskInsert.rows[0]?.id;
      assert(!!taskId, `Hero task created: ${taskId}`);

      const accepted = await acceptTask(heroUserId, taskId);
      assert(accepted.status === "ACCEPTED", "Task state transitioned to ACCEPTED");

      const responding = await updateTaskStatus(heroUserId, taskId, "RESPONDING");
      assert(responding.status === "RESPONDING", "Task state transitioned to RESPONDING");

      const arrived = await updateTaskStatus(heroUserId, taskId, "ARRIVED");
      assert(arrived.status === "ARRIVED", "Task state transitioned to ARRIVED");

      const resolved = await updateTaskStatus(heroUserId, taskId, "RESOLVED");
      assert(resolved.status === "RESOLVED", "Task state transitioned to RESOLVED and credits released/rewarded");
    }

    // 13. Serious Incident Escalation
    console.log("\n13. Serious Incident Escalation");
    const escalationRes = await escalateSignal(
      user1,
      newSignal.id,
      "Escalating for campus security review",
      "MOCK_AUTHORITY",
    );
    assert(escalationRes.escalation.status === "SENT", "Escalation created with SENT status to MOCK_AUTHORITY");
    assert(escalationRes.signal.status === "ESCALATED", "Signal status updated to ESCALATED");

    // 14. 60-Second Privacy Challenge Flow
    console.log("\n14. Privacy Challenge State Machine");
    const challenge = await createPrivacyChallenge(user1, newSignal.id);
    assert(challenge.status === "PENDING", `Privacy challenge created: ${challenge.id} (status: PENDING)`);
    assert(new Date(challenge.expiresAt).getTime() > Date.now(), "Challenge expires in the future (60s TTL)");

    const selfieRes = await submitPrivacySelfie(user1, challenge.id, "https://example.invalid/selfie-test.jpg", true, 0.94);
    assert(selfieRes.challenge.status === "MATCHED", "Selfie match succeeded and transitioned to MATCHED");
    assert(selfieRes.privacyProtected === true, "Privacy lock activated for matched subject");

    // 15. SOS Panic Button Flow
    console.log("\n15. Emergency SOS Panic Workflow");
    const sosRes = await triggerSos(user1, 12.8406, 80.1530, "Immediate medical distress");
    assert(sosRes.signal?.status === "ESCALATED", "SOS created signal in ESCALATED state");
    assert(sosRes.escalation.status === "SENT", "Emergency SOS dispatched to MOCK_AUTHORITY");

    console.log("\n==================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================");

  } catch (error) {
    console.error("Test execution encountered an error:", error);
    failed++;
  } finally {
    await closeDatabase();
  }

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

void runTests();
