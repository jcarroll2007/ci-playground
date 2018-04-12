const functions = require('firebase-functions')
const app = require('express')()
const MobileDetect = require('mobile-detect')

//TODO do we need to user optional js useragent?

app.get('**', (req, res) => {
  const detector = new MobileDetect(req.headers['user-agent'])
  console.log(detector.mobile())
  let type = ''
  if (detector.mobile() && !detector.tablet()) {
    type = 'mobile'
  } else {
    type = 'desktop/tablet'
  }
  res.send(`<div>${type}</div>`)
})

exports.app = functions.https.onRequest((req,res) => {
  if (!req.url) {
    req.url = '/';
    req.path = '/';
  }
  return app(req, res);
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
