/*
  If eslint-webpack-plugin & stylelint-webpack-plugin some dose not work on Next.js, Use this.
  First up. -> yarn add chokidar node-notifier -D
  Command. -> node lint.dev
*/
const chokidar = require('chokidar')
const { logFontBold, logFontColorGreen, logFontColorCyan, logFontReset } = require('./color')
const { eslintDev } = require('./eslint.dev')
const { stylelintDev } = require('./stylelint.dev')
const eslintCommand = `./node_modules/.bin/eslint './**/*.{ts,tsx}'`
const stylelintCommand = `./node_modules/.bin/stylelint 'src/**/*.scss' --fix`

const watcher = chokidar.watch('./src/', {
  persistent: true
})

let timeID
watcher
  .on('ready', () => {
    console.info(`${logFontBold}${logFontColorGreen}ESLint Linting Start...🔍${logFontReset}`)
    console.info(`${logFontBold}${logFontColorGreen}Stylelint Linting Start...🔍${logFontReset}`)
    eslintDev(eslintCommand, watcher)
    stylelintDev(stylelintCommand, watcher)
  })
  .on('change', (path) => {
    console.info(`${logFontBold}${logFontColorCyan}Change Files: ${logFontReset}${path}`)
    clearTimeout(timeID)
    timeID = setTimeout(() => {
      eslintDev(eslintCommand, watcher)
      stylelintDev(stylelintCommand, watcher)
    }, 250)
  })
