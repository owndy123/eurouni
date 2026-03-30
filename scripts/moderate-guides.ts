/**
 * Guide Moderation CLI
 *
 * A command-line tool for moderating university guide submissions.
 *
 * Usage:
 *   npx ts-node scripts/moderate-guides.ts --list
 *   npx ts-node scripts/moderate-guides.ts --approve <id>
 *   npx ts-node scripts/moderate-guides.ts --reject <id> [notes]
 *   npx ts-node scripts/moderate-guides.ts --view <id>
 *
 * Examples:
 *   # List all pending submissions
 *   npx ts-node scripts/moderate-guides.ts --list
 *
 *   # Approve a submission
 *   npx ts-node scripts/moderate-guides.ts --approve abc123-stuba-xyz789
 *
 *   # Reject a submission with notes
 *   npx ts-node scripts/moderate-guides.ts --reject abc123-stuba-xyz789 "Missing official links"
 *
 *   # View a specific submission details
 *   npx ts-node scripts/moderate-guides.ts --view abc123-stuba-xyz789
 */

import {
  submitGuide,
  getPendingGuides,
  getGuideById,
  moderateGuide,
  GuideSubmission,
} from '../src/data/guideQueue'

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function colorize(color: keyof typeof colors, text: string): string {
  return `${colors[color]}${text}${colors.reset}`
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString()
}

function formatGuideSummary(guide: GuideSubmission, index: number): void {
  console.log(
    `${colorize('cyan', `[${index + 1}]`)} ${colorize('bright', guide.id)}`
  )
  console.log(`    University: ${colorize('yellow', guide.universityId)}`)
  console.log(`    Submitted: ${formatDate(guide.submittedAt)}`)
  console.log(
    `    Requirements: ${guide.content.requirements.length} items`
  )
  console.log(
    `    Links: apply=${guide.content.links.apply ? 'yes' : 'no'}, docs=${
      guide.content.links.docs ? 'yes' : 'no'
    }`
  )
  console.log()
}

function formatGuideDetails(guide: GuideSubmission): void {
  console.log(colorize('bright', '\n=== GUIDE DETAILS ==='))
  console.log(`${colorize('dim', 'ID:')} ${guide.id}`)
  console.log(`${colorize('dim', 'University:')} ${guide.universityId}`)
  console.log(`${colorize('dim', 'Submitter:')} ${guide.submitterEmail}`)
  console.log(`${colorize('dim', 'Submitted:')} ${formatDate(guide.submittedAt)}`)
  console.log(`${colorize('dim', 'Status:')} ${colorize('yellow', guide.status)}`)

  console.log(colorize('bright', '\n--- Content ---'))

  console.log(colorize('dim', 'Requirements:'))
  guide.content.requirements.forEach((req, i) => {
    console.log(`  ${i + 1}. ${req}`)
  })

  console.log(colorize('dim', '\nDeadlines:'))
  console.log(
    `  Application: ${guide.content.deadlines.application || 'not specified'}`
  )
  console.log(`  Results: ${guide.content.deadlines.results || 'not specified'}`)

  console.log(colorize('dim', '\nLinks:'))
  console.log(`  Apply: ${guide.content.links.apply || 'not provided'}`)
  console.log(`  Docs: ${guide.content.links.docs || 'not provided'}`)

  console.log(colorize('dim', '\nTips:'))
  console.log(`  ${guide.content.tips || 'none'}`)

  if (guide.moderationNotes) {
    console.log(colorize('bright', '\n--- Moderation ---'))
    console.log(`${colorize('dim', 'Notes:')} ${guide.moderationNotes}`)
    console.log(`${colorize('dim', 'Moderated:')} ${formatDate(guide.moderatedAt!)}`)
  }

  console.log()
}

async function listPendingGuides(): Promise<void> {
  console.log(colorize('bright', '\n=== PENDING GUIDE SUBMISSIONS ===\n'))

  const guides = await getPendingGuides()

  if (guides.length === 0) {
    console.log(colorize('dim', 'No pending submissions.\n'))
    return
  }

  console.log(
    colorize('dim', `Found ${guides.length} pending submission(s):\n`)
  )

  guides.forEach((guide, index) => {
    formatGuideSummary(guide, index)
  })

  console.log(
    colorize('dim', 'Use --view <id> to see details or --approve/--reject <id>')
  )
  console.log()
}

async function viewGuide(id: string): Promise<void> {
  const guide = await getGuideById(id)

  if (!guide) {
    console.log(colorize('red', `Error: Guide not found: ${id}\n`))
    process.exit(1)
  }

  formatGuideDetails(guide)
}

async function approveGuide(id: string): Promise<void> {
  console.log(colorize('cyan', `\nApproving guide: ${id}\n`))

  try {
    await moderateGuide(id, 'approve')
    console.log(colorize('green', 'Guide approved successfully!\n'))
  } catch (error) {
    console.log(
      colorize('red', `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    )
    process.exit(1)
  }
}

async function rejectGuide(id: string, notes?: string): Promise<void> {
  console.log(colorize('cyan', `\nRejecting guide: ${id}\n`))
  if (notes) {
    console.log(colorize('dim', `Reason: ${notes}\n`))
  }

  try {
    await moderateGuide(id, 'reject', notes)
    console.log(colorize('yellow', 'Guide rejected.\n'))
  } catch (error) {
    console.log(
      colorize('red', `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    )
    process.exit(1)
  }
}

async function submitTestGuide(): Promise<void> {
  console.log(colorize('cyan', '\nSubmitting test guide...\n'))

  const submission = {
    universityId: 'stuba',
    submitterEmail: 'test@example.com',
    content: {
      requirements: ['High school diploma', 'English B2 certificate', 'Math test'],
      deadlines: {
        application: '2026-05-31',
        results: '2026-07-15',
      },
      links: {
        apply: 'https://www.stuba.sk/apply',
        docs: 'https://www.stuba.sk/docs',
      },
      tips: 'Make sure to prepare your portfolio early. The interview is in English.',
    },
  }

  try {
    const guide = await submitGuide(submission)
    console.log(colorize('green', 'Test guide submitted successfully!'))
    console.log(colorize('dim', `ID: ${guide.id}`))
    console.log()
  } catch (error) {
    console.log(
      colorize('red', `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    )
    process.exit(1)
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log(`
${colorize('bright', 'Guide Moderation CLI')}

${colorize('dim', 'Usage:')}
  npx ts-node scripts/moderate-guides.ts --list
  npx ts-node scripts/moderate-guides.ts --approve <id>
  npx ts-node scripts/moderate-guides.ts --reject <id> [notes]
  npx ts-node scripts/moderate-guides.ts --view <id>
  npx ts-node scripts/moderate-guides.ts --submit-test

${colorize('dim', 'Commands:')}
  --list          List all pending guide submissions
  --approve <id>   Approve a pending submission
  --reject <id>    Reject a pending submission (optional notes after id)
  --view <id>      View full details of a submission
  --submit-test    Submit a test guide for testing
`)
    process.exit(0)
  }

  const command = args[0]

  switch (command) {
    case '--list':
      await listPendingGuides()
      break

    case '--view':
      if (args.length < 2) {
        console.log(colorize('red', 'Error: --view requires an ID\n'))
        process.exit(1)
      }
      await viewGuide(args[1])
      break

    case '--approve':
      if (args.length < 2) {
        console.log(colorize('red', 'Error: --approve requires an ID\n'))
        process.exit(1)
      }
      await approveGuide(args[1])
      break

    case '--reject': {
      if (args.length < 2) {
        console.log(colorize('red', 'Error: --reject requires an ID\n'))
        process.exit(1)
      }
      const id = args[1]
      const notes = args.slice(2).join(' ') || undefined
      await rejectGuide(id, notes)
      break
    }

    case '--submit-test':
      await submitTestGuide()
      break

    default:
      console.log(colorize('red', `Unknown command: ${command}\n`))
      process.exit(1)
  }
}

main().catch((error) => {
  console.error(colorize('red', `Fatal error: ${error.message}`))
  process.exit(1)
})
