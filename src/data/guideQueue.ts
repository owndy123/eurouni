/**
 * Guide Submission Queue
 * File-based queue for university guide submissions
 *
 * Submissions are stored in /data/guides/queue/
 * Approved guides are stored in /data/guides/approved/
 * Rejected guides are stored in /data/guides/rejected/
 */

import * as fs from 'fs/promises'
import * as path from 'path'

// Directory paths
const DATA_DIR = path.join(process.cwd(), 'data', 'guides')
const QUEUE_DIR = path.join(DATA_DIR, 'queue')
const APPROVED_DIR = path.join(DATA_DIR, 'approved')
const REJECTED_DIR = path.join(DATA_DIR, 'rejected')
const INDEX_FILE = path.join(DATA_DIR, 'index.json')

export interface GuideSubmission {
  id: string
  universityId: string
  submittedAt: string
  submitterEmail: string
  content: {
    requirements: string[]
    deadlines: {
      application: string | null
      results: string | null
    }
    links: {
      apply: string | null
      docs: string | null
    }
    tips: string | null
  }
  status: 'pending' | 'approved' | 'rejected'
  moderationNotes?: string
  moderatedAt?: string
}

export interface GuideModeration {
  submissionId: string
  decision: 'approve' | 'reject'
  notes?: string
  moderatedAt: string
}

interface GuideIndex {
  [universityId: string]: string // maps universityId to approved guide id
}

// Ensure directories exist
async function ensureDirectories(): Promise<void> {
  await fs.mkdir(QUEUE_DIR, { recursive: true })
  await fs.mkdir(APPROVED_DIR, { recursive: true })
  await fs.mkdir(REJECTED_DIR, { recursive: true })
}

// Read or create index file
async function getIndex(): Promise<GuideIndex> {
  try {
    const data = await fs.readFile(INDEX_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

// Save index file
async function saveIndex(index: GuideIndex): Promise<void> {
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2))
}

/**
 * Generate a unique ID from timestamp and university ID
 */
function generateId(universityId: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${universityId}-${random}`
}

/**
 * Submit a new guide for moderation
 */
export async function submitGuide(
  submission: Omit<GuideSubmission, 'id' | 'submittedAt' | 'status'>
): Promise<GuideSubmission> {
  await ensureDirectories()

  const now = new Date().toISOString()
  const id = generateId(submission.universityId)

  const fullSubmission: GuideSubmission = {
    ...submission,
    id,
    submittedAt: now,
    status: 'pending',
  }

  const filePath = path.join(QUEUE_DIR, `${id}.json`)
  await fs.writeFile(filePath, JSON.stringify(fullSubmission, null, 2))

  return fullSubmission
}

/**
 * Get all pending guide submissions
 */
export async function getPendingGuides(): Promise<GuideSubmission[]> {
  await ensureDirectories()

  try {
    const files = await fs.readdir(QUEUE_DIR)
    const jsonFiles = files.filter((f) => f.endsWith('.json'))

    const guides: GuideSubmission[] = []
    for (const file of jsonFiles) {
      const content = await fs.readFile(path.join(QUEUE_DIR, file), 'utf-8')
      const guide = JSON.parse(content) as GuideSubmission
      guides.push(guide)
    }

    // Sort by submittedAt, newest first
    return guides.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
  } catch {
    return []
  }
}

/**
 * Get all approved guides, optionally filtered by university
 */
export async function getApprovedGuides(
  universityId?: string
): Promise<GuideSubmission[]> {
  await ensureDirectories()

  try {
    const files = await fs.readdir(APPROVED_DIR)
    const jsonFiles = files.filter((f) => f.endsWith('.json'))

    const guides: GuideSubmission[] = []
    for (const file of jsonFiles) {
      const content = await fs.readFile(path.join(APPROVED_DIR, file), 'utf-8')
      const guide = JSON.parse(content) as GuideSubmission
      if (universityId === undefined || guide.universityId === universityId) {
        guides.push(guide)
      }
    }

    return guides
  } catch {
    return []
  }
}

/**
 * Get a specific guide submission by ID
 */
export async function getGuideById(id: string): Promise<GuideSubmission | null> {
  await ensureDirectories()

  // Check queue first
  const queuePath = path.join(QUEUE_DIR, `${id}.json`)
  try {
    const content = await fs.readFile(queuePath, 'utf-8')
    return JSON.parse(content) as GuideSubmission
  } catch {
    // Check approved
  }

  const approvedPath = path.join(APPROVED_DIR, `${id}.json`)
  try {
    const content = await fs.readFile(approvedPath, 'utf-8')
    return JSON.parse(content) as GuideSubmission
  } catch {
    // Check rejected
  }

  const rejectedPath = path.join(REJECTED_DIR, `${id}.json`)
  try {
    const content = await fs.readFile(rejectedPath, 'utf-8')
    return JSON.parse(content) as GuideSubmission
  } catch {
    return null
  }
}

/**
 * Moderate a guide submission (approve or reject)
 */
export async function moderateGuide(
  submissionId: string,
  decision: 'approve' | 'reject',
  notes?: string
): Promise<void> {
  await ensureDirectories()

  const queuePath = path.join(QUEUE_DIR, `${submissionId}.json`)

  // Read submission from queue
  let submission: GuideSubmission
  try {
    const content = await fs.readFile(queuePath, 'utf-8')
    submission = JSON.parse(content) as GuideSubmission
  } catch {
    throw new Error(`Submission not found: ${submissionId}`)
  }

  if (submission.status !== 'pending') {
    throw new Error(`Submission already moderated: ${submissionId}`)
  }

  const now = new Date().toISOString()

  // Update submission with moderation info
  submission.status = decision === 'approve' ? 'approved' : 'rejected'
  submission.moderationNotes = notes
  submission.moderatedAt = now

  // Delete from queue
  await fs.unlink(queuePath)

  // Write to appropriate directory
  if (decision === 'approve') {
    const approvedPath = path.join(APPROVED_DIR, `${submissionId}.json`)
    await fs.writeFile(approvedPath, JSON.stringify(submission, null, 2))

    // Update index
    const index = await getIndex()
    index[submission.universityId] = submissionId
    await saveIndex(index)
  } else {
    const rejectedPath = path.join(REJECTED_DIR, `${submissionId}.json`)
    await fs.writeFile(rejectedPath, JSON.stringify(submission, null, 2))
  }
}

/**
 * Get the approved guide for a specific university
 */
export async function getGuideForUniversity(
  universityId: string
): Promise<GuideSubmission | null> {
  await ensureDirectories()

  // Check index first
  const index = await getIndex()
  const guideId = index[universityId]

  if (guideId) {
    const guide = await getGuideById(guideId)
    if (guide && guide.status === 'approved') {
      return guide
    }
  }

  // Fallback: search through approved files
  try {
    const files = await fs.readdir(APPROVED_DIR)
    const jsonFiles = files.filter((f) => f.endsWith('.json'))

    for (const file of jsonFiles) {
      const content = await fs.readFile(path.join(APPROVED_DIR, file), 'utf-8')
      const guide = JSON.parse(content) as GuideSubmission
      if (guide.universityId === universityId) {
        return guide
      }
    }
  } catch {
    // Directory might not exist
  }

  return null
}

export default {
  submitGuide,
  getPendingGuides,
  getApprovedGuides,
  getGuideById,
  moderateGuide,
  getGuideForUniversity,
}
