/*
  If eslint-webpack-plugin & stylelint-webpack-plugin some dose not work on Next.js, Use this.
  First up. -> yarn add node-notifier -D
  Command. -> node lint.dev
*/
const { watch } = require('fs')
const { logFontBold, logFontColorGreen, logFontColorCyan, logFontReset } = require('./color')
const { eslintDev } = require('./eslint.dev')
const { stylelintDev } = require('./stylelint.dev')
const eslintCommand = `./node_modules/.bin/eslint './**/*.{ts,tsx}'`
const stylelintCommand = `./node_modules/.bin/stylelint 'src/**/*.scss' --fix`

console.info(`${logFontBold}${logFontColorGreen}ESLint Linting Start...🔍${logFontReset}`)
console.info(`${logFontBold}${logFontColorGreen}Stylelint Linting Start...🔍${logFontReset}`)

// Runs only once after startup.
;(() => {
  eslintDev(eslintCommand, undefined)
  stylelintDev(stylelintCommand, undefined)
})()

const watcher = watch('./src/', { persistent: true, recursive: true }, (eventType, filename) => {
  console.info(`${logFontBold}${logFontColorCyan}${eventType} files: ${logFontReset}${filename}`)
  eslintDev(eslintCommand, watcher)
  stylelintDev(stylelintCommand, watcher)
})
