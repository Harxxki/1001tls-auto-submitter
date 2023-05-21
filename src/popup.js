document.getElementById('toggle').onclick = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { command: 'TOGGLE' },
      function (response) {
        document.getElementById('status').textContent = response.timer
          ? 'Running'
          : 'Stopped'
      }
    )
  })
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { command: 'GET_STATUS' },
    function (response) {
      document.getElementById('status').textContent = response.timer
        ? 'Running'
        : 'Stopped'
    }
  )
})
