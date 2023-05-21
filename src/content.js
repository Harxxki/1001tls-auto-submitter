function handleClick() {
  const button = document.querySelector(
    'button[title="submit changes"][name="btn_submitChanges"]'
  )
  if (button) {
    button.dispatchEvent(new MouseEvent('click'))
    console.log('button clicked')
  } else {
    console.log('button not found')
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === 'CLICK') {
    console.log('content: received CLICK message')
    handleClick()
    sendResponse({})
  }
  return true
})
