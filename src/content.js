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
}

function stopTimer() {
  if (timer) clearTimeout(timer)
  timer = null
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'START') {
    toggle = true
    if (window.location.href.includes('example.com/example')) startTimer()
  } else if (request.command === 'STOP') {
    toggle = false
    stopTimer()
  } else if (request.command === 'GET_STATUS') {
    sendResponse({ toggle, timer })
  }
})

// Check when page url changes
const observer = new MutationObserver(() => {
  if (window.location.href.includes('example.com/example')) {
    if (toggle) startTimer()
  } else {
    stopTimer()
  }
})
observer.observe(document.querySelector('body'), {
  childList: true,
  subtree: true,
})
