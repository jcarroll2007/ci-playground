const fetch = require('./../../node_modules/node-fetch')
const args = require('./../../node_modules/args')

args
  .option('branch', 'The current branch that is being deployed.')
  .option('token', 'The Github authorization token.')
  .option('owner', 'The Github repo owner is required.')
  .option('repo', 'The Github repo is required.')

const options = args.parse(process.argv)

if (!options.token) {
  throw new Error('The authorization token must be passed in.')
}
if (!options.branch) {
  throw new Error('The branch targetted for deployment is required.')
}

fetch(`https://api.github.com/repos/${options.owner}/${options.repo}/deployments`, {
  headers: {
    Authorization: `token ${options.token}`
  },
  method: 'POST',
  body: JSON.stringify({
    ref: options.branch,
    // ignore circle ci statuses
    required_contexts: [],
    description: 'Create deployment.'
  })
})
  // .then(response =>)
  .then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error(res.statusText)
    } else {
      return res.json()
    }
  })
  .then(json => {
    process.stdout.write(String(json.id))
  })
  .catch(err => console.log(err));
