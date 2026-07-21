import type { Response } from 'express'

export function setListHeaders(response: Response, resource: string, start: number, end: number, total: number) {
  response.setHeader('Content-Range', `${resource} ${start}-${end}/${total}`)
  response.setHeader('X-Total-Count', String(total))
}

