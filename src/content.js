let toggle = false
let timer = null

function handleClick() {
  const button = document.querySelector(
    'button[title="submit changes"][name="btn_submitChanges"]'
  )
  if (button) button.dispatchEvent(new MouseEvent('click'))
}

function startTimer() {
  if (timer) clearTimeout(timer)
  const delay = Math.random() * 5 * 60 * 1000 + 10 * 60 * 1000 // 10 to 15 minutes
  timer = setTimeout(() => {
    handleClick()
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

const observer = new MutationObserver(handleClick)
observer.observe(document.body, { childList: true, subtree: true })

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.command === 'GET_STATUS') {
    sendResponse({ toggle, timer })
  } else if (request.command === 'START') {
    if (
      window.location.href.includes('1001tracklists.com/create/tracklist.php')
    ) {
      toggle = true
      await startTimer()
      sendResponse({ toggle, timer: true })
    } else {
      sendResponse(null)
    }
  } else if (request.command === 'STOP') {
    toggle = false
    stopTimer()
    sendResponse({ toggle, timer: false })
  }
})
