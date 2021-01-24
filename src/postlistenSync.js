async function sample() {
  console.log('SLEEP START')
  setTimeout(() => {
    console.log('SLEEP END')
  }, 1000)
  return 'CHILD END'
}

(() => {
  console.log('PARENT START')
  sample().then(console.log)
  console.log('PARENT END')
})()

function sample2() {
  return new Promise(resolve => {
    console.log('SLEEP START')
    setTimeout(() => {
      console.log('SLEEP END')
      resolve('slow')
    }, 1000)
  })
}
