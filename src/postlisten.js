const http = require('http')
const https = require('https')
const parse = require('querystring').parse
const {performance, PerformanceObserver} = require('perf_hooks')

const BBT_CHANNEL_TOKEN = 'token_jMvmLp00TLF5Kw1t'
const BBT_CHANNEL = 'test'
const BBT_RESOURCE = 'res'

const server = http.createServer((req, res) => {
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', () => {
    console.log('ACHIEVED the END')
    const wrapped = performance.timerify(publishToBbt)
    const obs = new PerformanceObserver(list => {
      console.log(`duration: ${list.getEntries()[0].duration}`)
      obs.disconnect()
    }) // Parallel
    obs.observe({entryTypes: ['function']})
    wrapped(data)
    res.writeHead(200)
    res.end()
    console.log('RESPONSE DONE')
  })
})

const port = 4000
server.on('listening', () => {
  console.log(`Server listening on port ${port}`);
})
server.listen(port)

function publishToBbt(s) {
  const queries = parse(s)
  const postData = {
    data: {
      text: queries.text,
      channel: queries.channel_id,
      user: queries.user_id
    }
  }

  const bbtReq = https.request({
    host: 'api.beebotte.com',
    path: `/v1/data/publish/${BBT_CHANNEL}/${BBT_RESOURCE}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': BBT_CHANNEL_TOKEN
    }
  })

  bbtReq.on('response', res => console.log('STATUS', res.statusCode))
  bbtReq.write(JSON.stringify(postData))
  bbtReq.end()
}