const fetch = require('./../../node_modules/node-fetch')
const args = require('./../../node_modules/args')

args
  .option('token', 'The Github authorization token.')
  .option('deployment', 'The deployment id to be updated')
  .option('state', 'The state of the deployment. ["error", "failure", "inactive", "pending", "success"]')
  .option('target_url', 'The url for the deployment.')
  .option('description', 'The deployment status description.', 'Deployment status updated.')

const options = args.parse(process.argv)
console.log(options)

if (!options.token) {
  throw new Error('The authorization token must be passed in.')
}
if (!options.deployment) {
  throw new Error('The deployment id is required.')
}
if (!options.state) {
  throw new Error('The state is required.')
}
if (!options.targetUrl) {
  throw new Error('The target is required.')
}

fetch(`https://api.github.com/repos/jcarroll2007/ci-playground/deployments/${options.deployment}/statuses`, {
  headers: {
    Authorization: `token ${options.token}`
  },
  method: 'POST',
  body: JSON.stringify({
    state: options.state,
    target_url: options.targetUrl,
    description: options.description
  })
})
  .then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error(res.statusText)
    } else {
      return res.json()
    }
  })
  .then(json => {
    process.stdout.write(json.id)
  })
  .catch(err => console.log(err));
