function handleClick() {
  const button = document.querySelector(
    'button[title="submit changes"][name="btn_submitChanges"]'
  )
  if (button) button.dispatchEvent(new MouseEvent('click'))
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === 'CLICK') {
    handleClick()
    sendResponse({})
    return true // Indicate that we will send a response asynchronously
  }
})

window.addEventListener('load', () => {
  if (
    window.location.href.includes('1001tracklists.com/create/tracklist.php')
  ) {
    chrome.runtime.sendMessage({ command: 'CHECK_TIMER' }, (response) => {
      if (response && response.active) {
        chrome.runtime.sendMessage({ command: 'CLICK' })
      }
    })
  }
})
