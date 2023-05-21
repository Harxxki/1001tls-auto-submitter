let tabId = null

chrome.action.onClicked.addListener(async (tab) => {
  if (tabId === null) {
    tabId = tab.id
    await chrome.action.setIcon({ path: 'icons/on_icon.png', tabId: tab.id })
    chrome.tabs.sendMessage(tabId, { command: 'START' })
  } else {
    await chrome.action.setIcon({ path: 'icons/off_icon.png', tabId: tab.id })
    chrome.tabs.sendMessage(tabId, { command: 'STOP' })
    tabId = null
  }
})

chrome.tabs.onUpdated.addListener((id, changeInfo) => {
  if (id === tabId && changeInfo.status && changeInfo.status === 'complete') {
    tabId = null
    chrome.action.setIcon({ path: 'icons/off_icon.png', tabId: id })
  }
})
