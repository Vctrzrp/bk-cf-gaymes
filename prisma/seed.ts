import { ParticipantStatus, PrismaClient, ResultStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const participants = [
  { id: 'participant-1', firstName: 'Valentina', lastName: 'Rojas', status: ParticipantStatus.ACTIVE },
  { id: 'participant-2', firstName: 'Martina', lastName: 'Silva', status: ParticipantStatus.ACTIVE },
  { id: 'participant-3', firstName: 'Alex', lastName: 'González', status: ParticipantStatus.ACTIVE },
  { id: 'participant-4', firstName: 'Camila', lastName: 'Soto', status: ParticipantStatus.ACTIVE },
  { id: 'participant-5', firstName: 'Diego', lastName: 'Morales', status: ParticipantStatus.INACTIVE }
]

const wods = [
  { id: 'wod-1', name: 'WOD 1', date: '2026-08-08', activities: ['3 rondas por tiempo', '21-15-9 Thrusters', 'Pull-ups', '400 m de carrera'] },
  { id: 'wod-2', name: 'WOD 2', date: '2026-08-15', activities: ['AMRAP 15 minutos', '10 Deadlifts', '12 Box jumps', '14 Toes-to-bar'] },
  { id: 'wod-3', name: 'WOD 3', date: '2026-08-22', activities: ['Por tiempo', '50 Wall balls', '30 Clean & Jerks', '20 Handstand push-ups'] },
  { id: 'wod-4', name: 'WOD 4', date: '2026-08-29', activities: ['Chipper final', '1.000 m de remo', '40 Dumbbell snatches', '20 Burpees over bar'] }
]

const results = [
  { id: 'result-1', wodId: 'wod-1', participantId: 'participant-1', score: '08:42', points: 100, status: ResultStatus.FINISHED },
  { id: 'result-2', wodId: 'wod-1', participantId: 'participant-2', score: '09:11', points: 95, status: ResultStatus.FINISHED },
  { id: 'result-3', wodId: 'wod-1', participantId: 'participant-3', score: '09:38', points: 90, status: ResultStatus.FINISHED },
  { id: 'result-4', wodId: 'wod-2', participantId: 'participant-2', score: '8 + 24 reps', points: 100, status: ResultStatus.FINISHED },
  { id: 'result-5', wodId: 'wod-2', participantId: 'participant-1', score: '8 + 16 reps', points: 95, status: ResultStatus.FINISHED },
  { id: 'result-6', wodId: 'wod-2', participantId: 'participant-4', score: '', points: 0, status: ResultStatus.DNF }
]

async function seed() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'admin123', 12)
  await prisma.user.upsert({
    where: { username: process.env.ADMIN_USERNAME ?? 'admin' },
    update: { passwordHash, name: 'Administrador' },
    create: {
      username: process.env.ADMIN_USERNAME ?? 'admin',
      passwordHash,
      name: 'Administrador'
    }
  })

  for (const participant of participants) {
    await prisma.participant.upsert({
      where: { id: participant.id },
      update: participant,
      create: participant
    })
  }

  for (const wod of wods) {
    const { activities, ...data } = wod
    await prisma.wod.upsert({
      where: { id: wod.id },
      update: { ...data, date: new Date(`${data.date}T00:00:00.000Z`) },
      create: { ...data, date: new Date(`${data.date}T00:00:00.000Z`) }
    })
    await prisma.wodActivity.deleteMany({ where: { wodId: wod.id } })
    await prisma.wodActivity.createMany({
      data: activities.map((name, position) => ({ wodId: wod.id, name, position }))
    })
  }

  for (const result of results) {
    await prisma.result.upsert({
      where: { wodId_participantId: { wodId: result.wodId, participantId: result.participantId } },
      update: result,
      create: result
    })
  }
}

seed()
  .then(() => console.log('Seed completado correctamente'))
  .catch(error => {
    console.error('No fue posible ejecutar el seed', error)
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
