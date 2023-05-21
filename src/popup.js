let isEnabled = false

const toggleButton = document.getElementById('toggle')
const statusText = document.getElementById('status')

const checkURL = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (
    tab.status === 'complete' &&
    tab.url.includes('1001tracklists.com/create/tracklist.php')
  ) {
    toggleButton.disabled = false
  } else {
    toggleButton.disabled = true
  }
}

const updateButton = async () => {
  let response = await new Promise((resolve) => {
    chrome.runtime.sendMessage({ command: 'CHECK_TIMER' }, resolve)
  })
  isEnabled = response.active
  toggleButton.checked = isEnabled
  statusText.textContent = isEnabled ? 'Running' : 'Stopped'
}

toggleButton.addEventListener('change', async () => {
  let response = await new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { command: isEnabled ? 'STOP' : 'START' },
      resolve
    )
  })
  isEnabled = response.active
  toggleButton.checked = isEnabled
  statusText.textContent = isEnabled ? 'Running' : 'Stopped'
})

// Update every second
setInterval(updateButton, 1000)

// Check the current timer state when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ command: 'CHECK_TIMER' }, (response) => {
    if (response.active) {
      toggleButton.checked = true
      statusText.textContent = 'Running'
    } else {
      toggleButton.checked = false
      statusText.textContent = 'Stopped'
    }
  })
})
