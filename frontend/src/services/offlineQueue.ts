import type { OfflineSignal } from "../types/fnn";

export function queueOfflineSignal(queue: OfflineSignal[], item: OfflineSignal): OfflineSignal[] {
  return [item, ...queue];
}

export function getOfflineQueue(queue: OfflineSignal[]): OfflineSignal[] {
  return queue.filter((q) => q.status !== "SYNCED");
}

export function markQueueSyncing(queue: OfflineSignal[]): OfflineSignal[] {
  return queue.map((q) => (q.status === "QUEUED" ? { ...q, status: "SYNCING" } : q));
}

export function markQueueSynced(queue: OfflineSignal[]): OfflineSignal[] {
  return queue.map((q) => (q.status === "SYNCING" || q.status === "QUEUED" ? { ...q, status: "SYNCED" } : q));
}
