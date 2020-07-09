self.onmessage = (e) => {
  const { count = 1 } = e.data
  self.postMessage('count is ' + count)
  for (let i = 0; i < count; i++) {
    self.postMessage(i)
  }
}