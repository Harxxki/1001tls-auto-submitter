let toggle = false
let timer = null

function startTimer() {
  if (timer) clearTimeout(timer)
  const delay = Math.random() * 5 * 60 * 1000 + 10 * 60 * 1000 // 10 to 15 minutes
  timer = setTimeout(() => {
    const button = document.querySelector(
      'button[title="submit changes"][name="btn_submitChanges"]'
    )
    if (button) button.dispatchEvent(new MouseEvent('click'))
    startTimer()
  }, delay)
  return true
}

function stopTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
    return false
  }
}

let observerInit = false
const observer = new MutationObserver((mutations, observer) => {
  if (!observerInit) {
    startTimer()
    observerInit = true
  }
})

observer.observe(document.body, { childList: true, subtree: true })

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.command === 'GET_STATUS') {
    sendResponse({ toggle, timer: timer !== null })
  } else if (request.command === 'START') {
    if (
      window.location.href.includes('1001tracklists.com/create/tracklist.php')
    ) {
      toggle = true
      if (!timer) {
        await startTimer()
      }
      sendResponse({ toggle, timer: timer !== null })
    } else {
      sendResponse(null)
    }
  } else if (request.command === 'STOP') {
    toggle = false
    stopTimer()
    sendResponse({ toggle, timer: timer !== null })
  }
})

window.addEventListener('load', () => {
  if (
    window.location.href.includes('1001tracklists.com/create/tracklist.php')
  ) {
    chrome.runtime.sendMessage({ command: 'CHECK_TIMER' }, (response) => {
      if (response.active && !timer) {
        startTimer()
      }
    })
  }
})
