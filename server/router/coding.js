import express from 'express'
import axios from 'axios'
import qs from 'qs'

const router = express.Router()

router.post('/verify', (req, res) => {
  axios.post('https://oushutech.coding.net/api/oauth/access_token', qs.stringify({
    client_id: 'ee6030ce7aa82056dc4f97df0069e1ba',
    client_secret: 'd9da9f7d65f52ffb84162e52ffcd39fadd567cab',
    code: req.body.code,
    grant_type: 'authorization_code'
  })).then(codingRes => {
    console.log(codingRes.data)
    tokenObj = codingRes.data
    res.json({
      status: 0,
      message: 'ok'
    })
  }).catch(err => {
    console.log(err)
    res.sendStatus(401)
  })
})

router.post('/batch-release', (req, res) => {
  Promise.all(depots.map(depot => axios.post('https://oushutech.coding.net/open-api?Action=CreateGitBranch', {
    DepotId: depot,
    BranchName: req.body.branch,
    StartPoint: 'master'
  }, {
    headers: {
      'Authorization': `Bearer ${tokenObj.access_token}`
    }
  }))).then(promisesRes => {
    console.log(promisesRes)
    res.json({
      status: 0,
      message: 'ok',
      data: promisesRes.map(promiseResItem => promiseResItem.data)
    })
  }).catch(err => {
    console.log(err)
  })
})

export default router