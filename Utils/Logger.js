const chalk = require('chalk');
const dayjs = require('dayjs');

const format = '{tstamp} {tag} {txt}\n';

function error(content) {
    write(content, 'black', 'bgRed', 'ERROR', true)
}

function warn(content) {
    write(content, 'black', 'bgYellow', 'WARN', false)
}

function typo(content) {
    write(content, 'black', 'bgCyan', 'TYPO', false)
}

function command(content) {
    write(content, 'black', 'bgGreen', 'CMD', false)
}

function event(content) {
    write(content, 'black', 'bgGreen', 'EVT', false)
}

function button(content) {
    write(content, 'black', 'bgGreen', 'BTN', false)
}

function select(content) {
    write(content, 'black', 'bgGreen', 'SEL', false)
}

function client(content) {
    write(content, 'black', 'bgWhite', 'CLIENT', false)
}

function info(content) {
    write(content, 'black', 'bgBlue', 'INFO', false)
}

function write(content, tagColor, bgTagColor, tag, error = false) {
    const timestamp = `[${dayjs().format('DD/MM/YY - HH:mm:ss')}]`;
    const logTag = `[${tag}]`;
    const stream = error ? process.stderr : process.stdout;

    const item = format
        .replace('{tstamp}', chalk.gray(timestamp))
        .replace('{tag}', chalk[bgTagColor][tagColor](logTag))
        .replace('{txt}', chalk.white(content));

    stream.write(item);
}

module.exports = {
    error,
    warn,
    typo,
    command,
    event,
    client,
    info,
    button,
    select
};
