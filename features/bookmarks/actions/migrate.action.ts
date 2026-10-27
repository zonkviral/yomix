"use server"

import { updateTag } from "next/cache"

import { toCanonical } from "@/features/manga/service/fetchCanonicalManga"
import { saveCanonicalManga } from "@/features/manga/service/saveCanonicalManga"

import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { getMangaBatch } from "@/lib/MangaDex/getMangaBatch"
import type { ReadStatus } from "@/lib/supabase/type"
import type { ChapterSource } from "@/lib/chapters/types"

import type { LocalBookmark } from "../services/local-storage"

const MAX_BOOKMARKS = 500
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const STATUSES: readonly ReadStatus[] = [
    "reading",
    "completed",
    "plan_to_read",
    "dropped",
    "on_hold",
]
const SOURCES: readonly ChapterSource[] = ["mangadex", "remanga", "mangalib", "senkuro"]

interface CleanBookmark {
    externalId: string
    read_status: ReadStatus
    score: number | null
    created_at: string
    updated_at: string
    progress: {
        source: ChapterSource
        chapter_id: string
        chapter_number: number
        page_number: number
    } | null
}

const toIso = (value: unknown, now: Date): string => {
    const d = new Date(typeof value === "string" ? value : NaN)
    return Number.isNaN(d.getTime()) || d > now ? now.toISOString() : d.toISOString()
}

function cleanBookmarks(input: LocalBookmark[]): CleanBookmark[] {
    const now = new Date()
    const seen = new Set<string>()
    const out: CleanBookmark[] = []

    for (const b of input.slice(0, MAX_BOOKMARKS)) {
        const externalId = b?.manga?.external_id
        if (typeof externalId !== "string" || !UUID.test(externalId) || seen.has(externalId))
            continue
        seen.add(externalId)

        const p = b.manga.reading_progress?.[0]
        const chapterNumber = Number(p?.chapter_number)
        const hasProgress =
            !!p &&
            typeof p.chapter_id === "string" &&
            p.chapter_id.length > 0 &&
            p.chapter_id.length <= 200 &&
            Number.isFinite(chapterNumber) &&
            chapterNumber >= 0 &&
            chapterNumber <= 100000

        const score = b.score
        out.push({
            externalId,
            read_status: STATUSES.includes(b.read_status) ? b.read_status : "plan_to_read",
            score:
                typeof score === "number" && Number.isInteger(score) && score >= 1 && score <= 10
                    ? score
                    : null,
            created_at: toIso(b.created_at, now),
            updated_at: toIso(b.updated_at, now),
            progress: hasProgress
                ? {
                      source: SOURCES.includes(p.source) ? p.source : "mangadex",
                      chapter_id: p.chapter_id,
                      chapter_number: chapterNumber,
                      page_number:
                          Number.isInteger(p.page_number) &&
                          p.page_number! >= 1 &&
                          p.page_number! <= 10000
                              ? p.page_number!
                              : 1,
                  }
                : null,
        })
    }
    return out
}

export const migrateLocalBookmarks = async (bookmarks: LocalBookmark[]) => {
    if (!Array.isArray(bookmarks) || bookmarks.length === 0)
        return { success: true, failed: [] as string[] }

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: "Not authenticated" }

    const clean = cleanBookmarks(bookmarks)
    if (clean.length === 0) return { success: true, failed: [] as string[] }

    const admin = createServiceClient()
    const externalIds = clean.map((b) => b.externalId)

    const { data: existing, error: existingError } = await admin
        .from("manga")
        .select("id, external_id, manga_titles(count)")
        .in("external_id", externalIds)
    if (existingError) return { error: existingError.message }

    const idMap = new Map<string, string>()
    for (const m of existing ?? []) {
        if ((m.manga_titles?.[0]?.count ?? 0) > 0) idMap.set(m.external_id, m.id)
    }

    const missing = externalIds.filter((id) => !idMap.has(id))
    if (missing.length > 0) {
        let found: Awaited<ReturnType<typeof getMangaBatch>> = []
        try {
            found = await getMangaBatch(missing)
        } catch (error) {
            console.error("migrate: MangaDex batch failed:", error)
        }

        const saved = await saveCanonicalManga(
            found.map((m) => {
                const last = Number.parseFloat(m.attributes.lastChapter ?? "")
                return toCanonical(m, {
                    totalChapters: Number.isFinite(last) && last > 0 ? last : null,
                })
            }),
        )
        if ("error" in saved) return { error: saved.error }
        for (const [externalId, id] of saved.ids) idMap.set(externalId, id)
    }

    const migrated = clean.filter((b) => idMap.has(b.externalId))
    const failed = clean.filter((b) => !idMap.has(b.externalId)).map((b) => b.externalId)

    if (migrated.length > 0) {
        const { error } = await supabase.from("bookmarks").upsert(
            migrated.map((b) => ({
                user_id: user.id,
                manga_id: idMap.get(b.externalId)!,
                read_status: b.read_status,
                score: b.score,
                created_at: b.created_at,
                updated_at: b.updated_at,
            })),
            { onConflict: "user_id,manga_id", ignoreDuplicates: true },
        )
        if (error) return { error: error.message }
    }

    const progressRows = migrated.flatMap((b) =>
        b.progress ? [{ user_id: user.id, manga_id: idMap.get(b.externalId)!, ...b.progress }] : [],
    )
    if (progressRows.length > 0) {
        const { error } = await supabase
            .from("reading_progress")
            .upsert(progressRows, { onConflict: "user_id,manga_id", ignoreDuplicates: true })
        if (error) return { error: error.message }
    }

    updateTag(`recently-added-${user.id}`)
    updateTag(`continue-reading-${user.id}`)
    updateTag(`status-counts-${user.id}`)

    return { success: true, failed }
}
