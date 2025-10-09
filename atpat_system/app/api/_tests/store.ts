export type Test = {
  id: string
  name?: string
  parent_url: string
  duration_minutes: number
  login_window_start: string
  login_window_end: string
  notes?: string
  created_by: string // user id
  created_at: string
  stats?: {
    assigned?: number
    active?: number
    completed?: number
  }
}

const testsById = new Map<string, Test>()
const testsList: Test[] = []

export function createTest(data: Omit<Test, "id" | "created_at">): Test {
  const id = crypto.randomUUID()
  const test: Test = {
    id,
    created_at: new Date().toISOString(),
    stats: { assigned: 0, active: 0, completed: 0 },
    ...data,
  }
  testsById.set(id, test)
  testsList.push(test)
  return test
}

export function getTestById(id: string): Test | undefined {
  return testsById.get(id)
}

export function getAllTests(): Test[] {
  return testsList
}

export function updateTestStats(id: string, stats: Partial<Test["stats"]>) {
  const test = testsById.get(id)
  if (test) {
    test.stats = { ...test.stats, ...stats }
  }
}
