import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const inputHtmlPath = path.join(rootDir, 'resume', 'resume.html')
const outputPdfPath = path.join(rootDir, 'public', 'resume.pdf')

function findBrowserExecutable() {
  const candidates = [
    process.env.EDGE_PATH,
    process.env.CHROME_PATH,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }
  return null
}

function buildResume() {
  if (!fs.existsSync(inputHtmlPath)) {
    console.error(`Error: Resume source file not found at ${inputHtmlPath}`)
    process.exit(1)
  }

  const browserPath = findBrowserExecutable()
  if (!browserPath) {
    console.error(
      'Error: Could not find Microsoft Edge or Google Chrome executable. Set EDGE_PATH or CHROME_PATH environment variable.'
    )
    process.exit(1)
  }

  fs.mkdirSync(path.dirname(outputPdfPath), { recursive: true })

  const fileUrl = pathToFileURL(inputHtmlPath).href
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${outputPdfPath}`,
    fileUrl,
  ]

  console.log(`Rendering Harvard resume PDF using: ${browserPath}`)
  execFileSync(browserPath, args, { stdio: 'inherit' })

  if (!fs.existsSync(outputPdfPath)) {
    console.error(`Error: Failed to generate ${outputPdfPath}`)
    process.exit(1)
  }

  const stats = fs.statSync(outputPdfPath)
  console.log(`Generated ${outputPdfPath} (${(stats.size / 1024).toFixed(1)} KB)`)
}

buildResume()
