import bootView from './view/boot'
import * as callbacks from './view/gameEvents'

// View kezdő scriptje
window.addEventListener('load', bootView)

// Itt majd feliratkozunk a szervertől jövő eseményekre
// a fent importált függvényekkel.........

console.log('JS betöltött!')
