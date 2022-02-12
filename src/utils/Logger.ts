import chalk from 'chalk';

export default class Logger {
    private log = (color: chalk.Chalk = chalk.black, message: string ) => {
        console.log(color(message), '-', new Date().toString());
    };

    info = (message: string) => {
        this.log(chalk.blueBright, message);
    };

    success = (message: string) => {
        this.log(chalk.greenBright, message);
    };

    warn = (message: string) => {
        this.log(chalk.yellowBright, message);
    };

    error = (message: string) => {
        this.log(chalk.redBright, message);
    };
}
