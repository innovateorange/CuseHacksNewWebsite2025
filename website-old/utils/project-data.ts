// Utility to fetch and parse project data from CSV

export interface Project {
  year: string
  title: string
  tryItOutLink: string
  builtWith: string[]
}

export async function fetchProjectData(): Promise<Project[]> {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/42ae5550-3d13-480f-9588-0560544f3b9e%20%281%29-5Wq13k5x1gcL05MV6huVbG7hYgy56B.csv",
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch project data: ${response.status}`)
    }

    const csvText = await response.text()
    return parseCSV(csvText)
  } catch (error) {
    console.error("Error fetching project data:", error)
    return []
  }
}

function parseCSV(csvText: string): Project[] {
  const lines = csvText.split("\n")

  // Skip header row
  const dataRows = lines.slice(1)

  return dataRows
    .filter((row) => row.trim() !== "")
    .map((row) => {
      const columns = row.split(",").map((col) => col.trim())

      // Ensure we have at least 4 columns
      if (columns.length < 4) return null

      return {
        year: columns[0],
        title: columns[1],
        tryItOutLink: columns[2],
        builtWith: columns[3].split(" ").map((tech) => tech.trim()),
      }
    })
    .filter((project): project is Project => project !== null)
}

// Function to get featured projects (top 5)
export function getFeaturedProjects(projects: Project[]): Project[] {
  // Sort by year (newest first) and take the first 5
  return [...projects].sort((a, b) => new Date(b.year).getTime() - new Date(a.year).getTime()).slice(0, 5)
}
