const BBT_CHANNEL_TOKEN = 'token_xxxxx'
const BBT_CHANNEL = 'xxxx'
const BBT_RESOURCE = 'xxx'

type PostEventObject = {
  queryString: string,
  parameter: object,
  parameters: object,
  contextPath: '',
  contentLength: number,
  postData: {
    length: number,
    type: string,
    contents: string,
    name: 'postData'
  }
}

const doGet = () => {
  return ContentService.createTextOutput()
  .setContent('You have to request with payload data and use POST method.')
}

// See. https://developers.google.com/apps-script/guides/web
const doPost = (e: PostEventObject) => {
  const queries: any = parseQuery(e.postData.contents)
  if(!Object.keys(queries).length) {
    return ContentService.createTextOutput('Your request was not understood.')
  }

  /*
    Collect the attributes required to post an ephemeral messaage.
    See. https://api.slack.com/methods/chat.postEphemeral
  */
  const postBody = {
    data: {
      text: queries.text,
      channel: queries.channel_id,
      user: queries.user_id
    }
  }

  // NG code
  // The compiler infers 'method' is string,
  // but the property is expected to be type
  // of URLFetchRequestOptions.
  // So, it throws error: ts2345.
  // const options = {
  //   'contentType': 'application/json',
  //   'headers': {
  //     'X-Auth-Token': BBT_CHANNEL_TOKEN
  //   },
  //   'method': 'post',
  //   'payload': JSON.stringify(postBody)
  // }

  // See. https://beebotte.com/docs/restapi
  const url = `https://api.beebotte.com/v1/data/publish/${BBT_CHANNEL}/${BBT_RESOURCE}`
  UrlFetchApp.fetch(url, {
    contentType: 'application/json',
    headers: {
      'X-Auth-Token': BBT_CHANNEL_TOKEN
    },
    method: 'post',
    payload: JSON.stringify(postBody)
  }) // Request
  return ContentService.createTextOutput() // An empty responce to Slack slash command.
}

/*
  Parse query string such as 'hoge=fuga&foo=bar' and convert to key & value object.
  See. https://stackoverflow.com/questions/8486099/how-do-i-parse-a-url-query-parameters-in-javascript
*/
const parseQuery = (q: string) => {
  let query = q.substr(1)
  let result = {}
  query.split('&').forEach(part => {
    const item = part.split('=')
    result[item[0]] = decodeURIComponent(item[1])
  })
  return result
}
