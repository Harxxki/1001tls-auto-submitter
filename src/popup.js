document.getElementById('toggle').onchange = function () {
  const command = this.checked ? 'START' : 'STOP'
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command }, function (response) {
      if (response) {
        document.getElementById('status').textContent = response.timer
          ? 'Running'
          : 'Stopped'
      } else {
        document.getElementById('status').textContent =
          'Cannot be used on this page'
        document.getElementById('toggle').checked = false
      }
    })
  })
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { command: 'GET_STATUS' },
    function (response) {
      if (response) {
        document.getElementById('status').textContent = response.timer
          ? 'Running'
          : 'Stopped'
        document.getElementById('toggle').checked = response.toggle
      } else {
        document.getElementById('status').textContent =
          'Cannot be used on this page'
      }
    }
  )
})
