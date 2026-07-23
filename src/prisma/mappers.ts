import {
  ParticipantStatus,
  ResultStatus,
  type Participant,
  type Result
} from '@prisma/client'

export const participantStatusToDb = (status: 'active' | 'inactive') =>
  status === 'active' ? ParticipantStatus.ACTIVE : ParticipantStatus.INACTIVE

export const participantStatusFromDb = (status: ParticipantStatus) =>
  status === ParticipantStatus.ACTIVE ? 'active' as const : 'inactive' as const

export const resultStatusToDb = (status: 'pending' | 'finished' | 'dnf') => ({
  pending: ResultStatus.PENDING,
  finished: ResultStatus.FINISHED,
  dnf: ResultStatus.DNF
})[status]

export const resultStatusFromDb = (status: ResultStatus) => ({
  PENDING: 'pending' as const,
  FINISHED: 'finished' as const,
  DNF: 'dnf' as const
})[status]

export const dateOnly = (date: Date) => date.toISOString().slice(0, 10)

export const mapParticipant = (participant: Participant) => ({
  ...participant,
  status: participantStatusFromDb(participant.status),
  createdAt: participant.createdAt.toISOString(),
  updatedAt: participant.updatedAt.toISOString()
})

export const mapResult = (result: Result) => ({
  ...result,
  score: result.score ?? '',
  status: resultStatusFromDb(result.status),
  createdAt: result.createdAt.toISOString(),
  updatedAt: result.updatedAt.toISOString()
})

export const mapWod = <T extends {
  date: Date
  activities: Array<{ name: string }>
  createdAt: Date
  updatedAt: Date
}>(wod: T) => {
  const { activities, ...record } = wod
  return {
    ...record,
    date: dateOnly(wod.date),
    activities: activities.map(activity => activity.name),
    createdAt: wod.createdAt.toISOString(),
    updatedAt: wod.updatedAt.toISOString()
  }
}
