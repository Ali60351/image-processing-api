import chalk from 'chalk';

type messageType = Array<string | object>;

class Logger {
    private log = (color: chalk.Chalk = chalk.black, messages: messageType ) => {
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

    info = (...messages: messageType) => {
        this.log(chalk.blueBright, messages);
    };

    success = (...messages: messageType) => {
        this.log(chalk.green, messages);
    };

    warn = (...messages: messageType) => {
        this.log(chalk.yellowBright, messages);
    };

    error = (...messages: messageType) => {
        this.log(chalk.redBright, messages);
    };
}

export default new Logger();
