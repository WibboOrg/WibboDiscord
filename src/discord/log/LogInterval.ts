import { cp } from 'fs'
import { sendMessage } from '../bot'
import { ILog } from '../types'

export class LogInterval {	
    runInterval?: NodeJS.Timer
    isRunning: boolean
    lastId: number

    constructor(private log: ILog) {
        this.runInterval = undefined
        this.isRunning = false
        this.lastId = -1
    }
    
    async init() {
        this.lastId = await this.log.getLastId()

        this.runInterval = setInterval(() => this.run(), this.log.seconds * 1000)
    }

    async run() {
        if(!this.isRunning) {
            this.isRunning = true

            await this.onRun()

            this.isRunning = false
        }
    }

    async onRun() {
        try {
            if (this.lastId == -1) this.lastId = await this.log.getLastId()
            else {
                const rawData = await this.log.rawLogs(this.lastId)

                if (!rawData) return

                let message = rawData.message
                this.lastId = rawData.lastId

                if (message && message.length > 0) {
                    sendMessage(message, this.log.channelName)
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}