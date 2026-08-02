import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TOOLS_DIR = path.join(__dirname, 'src/components/workspace/tools')

async function migrate() {
  const files = fs.readdirSync(TOOLS_DIR)
  
  let migratedCount = 0
  let skippedCount = 0

  for (const file of files) {
    if (!file.endsWith('.tsx')) continue
    const filePath = path.join(TOOLS_DIR, file)
    let content = fs.readFileSync(filePath, 'utf-8')

    // Skip if already migrated or doesn't have the typical structure
    if (content.includes('ToolSplitView') || !content.includes('className="flex flex-col items-center justify-center h-full w-full space-y-6"')) {
      skippedCount++
      continue
    }

    // Try to extract key components using regex
    // 1. Icon component and color class
    const iconDivMatch = content.match(/<div className="w-20 h-20 rounded-2xl\s+([a-zA-Z0-9-]+)\s+.*flex items-center justify-center shadow-2xl">\s*<([A-zA-Z0-9]+)\s+className="[^"]*"\s*\/>\s*<\/div>/)
    
    // 2. Title
    const titleMatch = content.match(/<h2 className="text-2xl font-bold[^"]*">([^<]+)<\/h2>/)

    if (!iconDivMatch || !titleMatch) {
      console.log(`Skipping ${file} - Could not parse icon/title`)
      skippedCount++
      continue
    }

    const iconBgColorClass = iconDivMatch[1] // e.g., bg-orange-500
    const iconComponent = iconDivMatch[2] // e.g., FileImage
    const title = titleMatch[1]

    // Find the description if it exists
    let description = title
    const descMatch = content.match(/<div className="p-3[^"]* text-xs text-center">\s*([^<]+)\s*<\/div>/)
    if (descMatch) {
      description = descMatch[1].trim()
    } else {
      const pMatch = content.match(/<p className="text-xs text-slate-400 mt-2">\s*([^<]+)\s*<\/p>/)
      if (pMatch) description = pMatch[1].trim()
    }

    // Find custom settings.
    const settingsMatch = content.match(/<div className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-lg truncate">\{activeFile(?:\.name)?\}<\/div>\s*<\/div>([\s\S]*?)(?:\{isProcessing|<button)/)
    
    let customSettingsJSX = ''
    if (settingsMatch && settingsMatch[1].trim().length > 0) {
      customSettingsJSX = settingsMatch[1].trim()
      // Remove the description div from custom settings if we matched it
      customSettingsJSX = customSettingsJSX.replace(/<div className="p-3[^"]* text-xs text-center">\s*[^<]+\s*<\/div>/, '')
    }

    // Extract handleProcess function name
    const buttonMatch = content.match(/<button[^>]*onClick=\{([^}]+)\}[^>]*>/)
    const processFn = buttonMatch ? buttonMatch[1] : 'handleProcess'

    // Extract button text
    const buttonTextMatch = content.match(/\{isProcessing \? "[^"]+" : "([^"]+)"\}/)
    const processButtonText = buttonTextMatch ? buttonTextMatch[1] : `Convert ${title}`

    // Add import if needed
    let newContent = content
    if (!newContent.includes('ToolSplitView')) {
      newContent = newContent.replace(
        /(import .* from "lucide-react"\s*\n)/,
        `$1import { ToolSplitView } from "../canvases/tool-split-view"\n`
      )
    }

    // Replace the icon component if it was not imported
    if (newContent.includes(iconComponent) && !newContent.includes(` ${iconComponent} `) && !newContent.includes(`${iconComponent},`)) {
      newContent = newContent.replace(
        /(import \{)(.*)(?=\} from "lucide-react")/,
        `$1 ${iconComponent}, $2`
      )
    }

    const iconColor = iconBgColorClass.replace('bg-', 'text-')
    let resultUrlProp = 'resultUrl={undefined}'
    
    // Some components don't have resultUrl state. We'll pass undefined.
    // If they have URL state but it's not called resultUrl, this might need manual fix.

    let customSettingsProp = customSettingsJSX ? `customSettings={<>${customSettingsJSX}</>}` : ''

    const newReturn = `return (
    <ToolSplitView
      title="${title}"
      description="${description}"
      icon={<${iconComponent} className="w-6 h-6 ${iconColor}" />}
      originalFile={activeFile}
      isProcessing={isProcessing}
      progress={typeof progress !== 'undefined' ? progress : 0}
      isDone={isDone}
      onProcess={${processFn}}
      processButtonText="${processButtonText}"
      ${resultUrlProp}
      ${customSettingsProp}
    />
  )`

    // Replace the return block
    const returnRegex = /return\s*\(\s*<div className="flex flex-col items-center justify-center h-full w-full space-y-6">[\s\S]*?\)\s*\}\s*$/
    
    if (returnRegex.test(newContent)) {
      newContent = newContent.replace(returnRegex, `${newReturn}\n}\n`)
      fs.writeFileSync(filePath, newContent)
      console.log(`Migrated ${file}`)
      migratedCount++
    } else {
      console.log(`Skipping ${file} - Regex did not match full return block`)
      skippedCount++
    }
  }

  console.log(`\nMigration complete. Migrated: ${migratedCount}, Skipped: ${skippedCount}`)
}

migrate().catch(console.error)
