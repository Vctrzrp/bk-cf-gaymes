export type ParticipantStatus = 'active' | 'inactive'
export type ResultStatus = 'pending' | 'finished' | 'dnf'

export interface Participant {
  id: string
  firstName: string
  lastName: string
  status: ParticipantStatus
  createdAt: string
  updatedAt: string
}

export interface Wod {
  id: string
  name: string
  date: string
  activities: string[]
  createdAt: string
  updatedAt: string
}

export interface Result {
  id: string
  wodId: string
  participantId: string
  score: string
  points: number
  status: ResultStatus
  createdAt: string
  updatedAt: string
}

