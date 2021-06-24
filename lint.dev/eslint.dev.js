/*
  eslint.dev.js
*/
const { exec } = require('child_process')
const notifier = require('node-notifier')
const path = require('path')
const { logFontBold, logFontBright, logFontColorYellow, logFontColorRed, logFontReset } = require('./color')

const execErrorHandler = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        error.code === 1 ? resolve({ stdout: stdout, stderr: stderr }) : reject({ error: error, stderr: stderr })
      } else {
        resolve({ stdout: stdout, stderr: stderr })
      }
    })
  })
}

exports.eslintDev = async (eslintCommand, watcher) => {
  try {
    const result = await execErrorHandler(eslintCommand)
    if (result.stdout) {
      const breakIntoLines = result.stdout.split('\n')
      const pickLetter = breakIntoLines.filter((line) => {
        return line.startsWith('✖')
      })
      const addColorLetter = breakIntoLines.map((line) => {
        if (line.startsWith('✖')) {
          return `\n${logFontBold}${logFontColorRed}${line}${logFontReset}`
        }
        if (line.includes(':')) {
          return line.includes(' error ')
            ? `\n${logFontBright}${logFontColorRed}${line}${logFontReset}\n`
            : `\n${logFontBright}${logFontColorYellow}${line}${logFontReset}\n`
        }
        if (!line) {
          return '\n'
        }
        return line
      })

      notifier.notify({
        title: 'ESLint Error or Warning.',
        message: pickLetter[0],
        contentImage: path.join(__dirname, 'images/logo_eslint.png'),
        sound: 'Submarine'
      })
      console.info(`${logFontBold}${logFontColorRed}ESLint Error or Warning:${logFontReset}${addColorLetter.join('')}`)
    } else if (result.stderr) {
      notifier.notify({
        title: 'ESLint Linting Failed.',
        message: result.stderr,
        contentImage: path.join(__dirname, 'images/logo_eslint.png'),
        sound: 'Submarine'
      })
      console.info(`${logFontBold}${logFontColorYellow}${result.stderr}${logFontReset}`)
      watcher.close()
      process.kill(process.pid, 'SIGHUP')
      process.exit(0)
    }
  } catch (error) {
    notifier.notify({
      title: 'ESLint Linting Failed.',
      message: error.stderr,
      contentImage: path.join(__dirname, 'images/logo_eslint.png'),
      sound: 'Submarine'
    })
    console.info(`${logFontBold}${logFontColorRed}${error.error}${logFontReset}`)
    watcher.close()
    process.kill(process.pid, 'SIGHUP')
    process.exit(0)
  }
}
