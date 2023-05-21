let tabId = null

chrome.browserAction.onClicked.addListener((tab) => {
  if (tabId === null) {
    tabId = tab.id
    chrome.browserAction.setIcon({ path: 'on_icon.png' })
    chrome.tabs.sendMessage(tab.id, { command: 'START' })
  } else {
    tabId = null
    chrome.browserAction.setIcon({ path: 'off_icon.png' })
    chrome.tabs.sendMessage(tab.id, { command: 'STOP' })
  }
})

chrome.tabs.onRemoved.addListener((id) => {
  if (id === tabId) {
    tabId = null
    chrome.browserAction.setIcon({ path: 'off_icon.png' })
  }
})
