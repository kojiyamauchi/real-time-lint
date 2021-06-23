/*
  stylelint.dev.js
*/
const { exec } = require('child_process')
const notifier = require('node-notifier')
const path = require('path')
const { logFontBold, logFontColorYellow, logFontColorRed, logFontReset } = require('./color')

const execErrorHandler = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        error.code === 2 ? resolve({ stdout: stdout, stderr: stderr }) : reject({ error: error, stderr: stderr })
      } else {
        resolve({ stdout: stdout, stderr: stderr })
      }
    })
  })
}

exports.stylelintDev = async (stylelintCommand, watcher) => {
  try {
    const result = await execErrorHandler(stylelintCommand)
    if (result.stdout) {
      const breakIntoLines = result.stdout.split('\n')
      breakIntoLines.pop()
      const pickLetter = breakIntoLines.filter((line) => {
        return line.includes('✖')
      })
      const addColorLetter = breakIntoLines.map((line) => {
        if (line.includes('✖')) {
          return `\n${logFontBold}${logFontColorRed}${line}${logFontReset}`
        }
        if (!line) {
          return '\n'
        }
        return line
      })

      notifier.notify({
        title: 'Stylelint Error or Warning.',
        message: pickLetter[0],
        contentImage: path.join(__dirname, 'images/logo_stylelint.png'),
        sound: 'Submarine'
      })
      console.info(`${logFontBold}${logFontColorRed}Stylelint Error or Warning:${logFontReset}${addColorLetter.join('')}`)
    } else if (result.stderr) {
      notifier.notify({
        title: 'Stylelint Linting Failed.',
        message: result.stderr,
        contentImage: path.join(__dirname, 'images/logo_stylelint.png'),
        sound: 'Submarine'
      })
      console.info(`${logFontBold}${logFontColorYellow}${result.stderr}${logFontReset}`)
      if (watcher) {
        watcher.close()
        process.kill(process.pid, 'SIGHUP')
        process.exit(0)
      }
    }
  } catch (error) {
    notifier.notify({
      title: 'Stylelint Linting Failed.',
      message: error.stderr,
      contentImage: path.join(__dirname, 'images/logo_stylelint.png'),
      sound: 'Submarine'
    })
    console.info(`${logFontBold}${logFontColorRed}${error.error}${logFontReset}`)
    if (watcher) {
      watcher.close()
      process.kill(process.pid, 'SIGHUP')
      process.exit(0)
    }
  }
}
