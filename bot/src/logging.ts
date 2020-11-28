import { createLogger, format, transports, Logger } from "winston";
const { combine, label, timestamp, printf } = format;


const myFormat = printf(( {level, message, label, timestamp} ) => {
    let formattedLevel = level[0].toUpperCase() + level.substr(1, level.length - 1);
    return `${timestamp} [${formattedLevel}] ${label}: ${message}`;
})

export function buildLogger(displayLabel : string) : Logger{
    let loglevel = process.env.LOGLEVEL ? process.env.LOGLEVEL : 'info'
    return createLogger({
        level: loglevel,
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

