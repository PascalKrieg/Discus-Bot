import { createLogger, format, transports, Logger } from "winston";
import winston from "winston/lib/winston/config";
const { combine, label, timestamp, printf } = format;


const myFormat = printf(( {level, message, label, timestamp} ) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})

export function buildLogger(displayLabel : string) : Logger{
    return createLogger({
        level: 'debug',
        format: combine(
            label({ label: displayLabel }),
            timestamp(),
            myFormat
          ),
        transports: [
            new transports.Console()
        ]
    })
}

