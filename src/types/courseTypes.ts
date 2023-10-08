import { prisma } from '@/db/prisma'

type Awaited<T> = T extends PromiseLike<infer U> ? U : T
type CourseType = Awaited<ReturnType<typeof prisma.course.findUnique>>

export type { Awaited, CourseType }
