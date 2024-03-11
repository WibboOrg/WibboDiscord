import { Message } from "discord.js"

export interface ILog {
  seconds: number
  channelName: string
  getLastId: () => Promise<number>
  rawLogs: (lastId: number) => Promise<{ message: string, lastId: number } | undefined>
}

export interface ICommand {
  name: string
  permissions: bigint[]
  roles: string[]
  parse: (message: Message, parts: string[]) => Promise<void>
}