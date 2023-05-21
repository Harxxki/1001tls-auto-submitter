let timerActive = false
let timer = null

async function handleClick(tabId) {
  await chrome.tabs.sendMessage(tabId, { command: 'CLICK' }, () => {})
}

async function startTimer(tabId) {
  if (timer) clearTimeout(timer)

  // const delay = Math.random() * 5 * 60 * 1000 + 10 * 60 * 1000; // 10 to 15 minutes
  const delay = 10 * 1000 // 10 seconds for testing
  timer = setTimeout(async () => {
    await handleClick(tabId)
    startTimer(tabId)
  }, delay)

  timerActive = true
  await chrome.action.setIcon({ path: '../icons/on_icon.png', tabId })
}

async function stopTimer(tabId) {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  timerActive = false
  await chrome.action.setIcon({ path: '../icons/off_icon.png', tabId })
}

chrome.action.onClicked.addListener(async (tab) => {
  if (timerActive) {
    await stopTimer(tab.id)
  } else {
    await startTimer(tab.id)
  }
})

chrome.tabs.onUpdated.addListener(async (id, changeInfo, tab) => {
  if (timerActive) {
    await chrome.action.setIcon({ path: '../icons/on_icon.png', id })
  } else {
    await chrome.action.setIcon({ path: '../icons/off_icon.png', id })
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'CHECK_TIMER') {
    sendResponse({ active: timerActive })
  } else if (request.command === 'START') {
    if (!timerActive) {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0].url.includes('1001tracklists.com/create/tracklist.php')) {
          await startTimer(tabs[0].id)
          sendResponse({ active: timerActive })
        }
      })
    } else {
      sendResponse({ active: timerActive })
    }
  } else if (request.command === 'STOP') {
    if (timerActive) {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0].url.includes('1001tracklists.com/create/tracklist.php')) {
          await stopTimer(tabs[0].id)
          sendResponse({ active: timerActive })
        }
      })
    } else {
      sendResponse({ active: timerActive })
    }
  }
  return true
})
