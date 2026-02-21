/**
 * Offline Store
 *
 * IndexedDB wrapper for persisting triage sessions offline.
 * Uses the `idb` library for a clean Promise-based API.
 */

import { openDB, type IDBPDatabase } from "idb";
import type { TriageResultData } from "@/lib/ai/inferenceEngine";

const DB_NAME = "cavista-triage";
const DB_VERSION = 1;
const STORE_NAME = "sessions";

interface OfflineSession {
    id: string;
    timestamp: number;
    symptoms: string;
    source: "TEXT" | "IMAGE" | "MULTIMODAL";
    result: TriageResultData | null;
    synced: boolean;
    imageDataUrl?: string;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                    store.createIndex("timestamp", "timestamp");
                    store.createIndex("synced", "synced");
                }
            },
        });
    }
    return dbPromise;
}

export const offlineStore = {
    /**
     * Save a triage session to IndexedDB.
     */
    async saveSession(
        id: string,
        symptoms: string,
        source: "TEXT" | "IMAGE" | "MULTIMODAL",
        result: TriageResultData | null = null,
        imageDataUrl?: string
    ): Promise<void> {
        const db = await getDB();
        const session: OfflineSession = {
            id,
            timestamp: Date.now(),
            symptoms,
            source,
            result,
            synced: result !== null,
            imageDataUrl,
        };
        await db.put(STORE_NAME, session);
    },

    /**
     * Update a session's result after inference completes.
     */
    async updateResult(
        id: string,
        result: TriageResultData
    ): Promise<void> {
        const db = await getDB();
        const session = await db.get(STORE_NAME, id);
        if (session) {
            session.result = result;
            session.synced = true;
            await db.put(STORE_NAME, session);
        }
    },

    /**
     * Get all sessions, newest first.
     */
    async getHistory(limit: number = 50): Promise<OfflineSession[]> {
        const db = await getDB();
        const all = await db.getAll(STORE_NAME);
        return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
    },

    /**
     * Get unsynced sessions for when connectivity returns.
     */
    async getUnsynced(): Promise<OfflineSession[]> {
        const db = await getDB();
        const all = await db.getAllFromIndex(STORE_NAME, "synced", IDBKeyRange.only(0));
        return all;
    },

    /**
     * Mark a session as synced.
     */
    async markSynced(id: string): Promise<void> {
        const db = await getDB();
        const session = await db.get(STORE_NAME, id);
        if (session) {
            session.synced = true;
            await db.put(STORE_NAME, session);
        }
    },

    /**
     * Clear all offline data.
     */
    async clear(): Promise<void> {
        const db = await getDB();
        await db.clear(STORE_NAME);
    },
};
