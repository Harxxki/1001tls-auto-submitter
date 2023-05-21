let activeTimers = {}

chrome.action.onClicked.addListener(async (tab) => {
  if (!(tab.id in activeTimers)) {
    activeTimers[tab.id] = true
    await chrome.action.setIcon({ path: 'icons/on_icon.png', tabId: tab.id })
    chrome.tabs.sendMessage(tab.id, { command: 'START' })
  } else {
    delete activeTimers[tab.id]
    await chrome.action.setIcon({ path: 'icons/off_icon.png', tabId: tab.id })
    chrome.tabs.sendMessage(tab.id, { command: 'STOP' })
  }
})

chrome.tabs.onRemoved.addListener((id) => {
  if (id in activeTimers) {
    delete activeTimers[id]
  }
})

chrome.tabs.onUpdated.addListener(async (id, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url.includes('1001tracklists.com/create/tracklist.php')
  ) {
    if (id in activeTimers) {
      await chrome.action.setIcon({ path: 'icons/on_icon.png', tabId: id })
      chrome.tabs.sendMessage(id, { command: 'START' })
    } else {
      await chrome.action.setIcon({ path: 'icons/off_icon.png', tabId: id })
    }
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'CHECK_TIMER') {
    if (sender.tab.id in activeTimers) {
      sendResponse({ active: true })
    } else {
      sendResponse({ active: false })
    }
  }
})
