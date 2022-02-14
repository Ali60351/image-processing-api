import chalk from 'chalk';

type messageType = Array<string | object>;

class Logger {
    private log = (color: chalk.Chalk = chalk.black, messages: messageType): void => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }

        const processedMessages = messages.map(message => {
            if (typeof message === 'string') {
                return color(message);
            } else {
                return message;
            }
        });

        console.log(...processedMessages, '-', new Date().toString().split('GMT')[0]);
    };

    info = (...messages: messageType): void => {
        this.log(chalk.blueBright, messages);
    };

    success = (...messages: messageType): void => {
        this.log(chalk.green, messages);
    };

    warn = (...messages: messageType): void => {
        this.log(chalk.yellowBright, messages);
    };

    error = (...messages: messageType): void => {
        this.log(chalk.redBright, messages);
    };
}

export default new Logger();
