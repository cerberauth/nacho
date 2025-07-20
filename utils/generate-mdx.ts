import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  summary: string
  image?: string
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  const frontMatterBlock = match![1]
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXMetaData(dir: string) {
  return getMDXFiles(dir).map((file) => {
    const { metadata } = readMDXFile(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
    }
  })
}

function generateJSONFiles(fileName: string, data: any[]) {
  fs.writeFileSync(
    path.join(path.join(process.cwd(), 'data', 'mdx'), `${fileName}.json`),
    JSON.stringify(data)
  )
}

export function generateUseCases() {
  const dir = path.join(process.cwd(), 'app', 'use-cases')

  const useCases = getMDXMetaData(dir)
  generateJSONFiles('use-cases', useCases)
}

generateUseCases()
