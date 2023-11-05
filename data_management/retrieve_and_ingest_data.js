const express = require('express')
const router = express.Router()
const axios = require('axios')
require('log-timestamp')
const Helper = require('../helper')

const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`

router.get('/earthquakes', async function (req, res) {
  console.log('Loading Application...')
  res.json('Running Application...')

  indexData = async () => {
    try {
      console.log('Retrieving data from the USGS API')

      const EARTHQUAKES = await axios.get(`${URL}`, {
        headers: {
          'Content-Type': ['application/json', 'charset=utf-8'],
        },
      })

      console.log('Data retrieved!')

      results = EARTHQUAKES.data.features

      console.log('Indexing data...')

      Helper.parseDataToPipeIngest(results)

      if (EARTHQUAKES.data.length) {
        indexData()
      } else {
        console.log('Data has been indexed successfully!')
      }
    } catch (err) {
      console.log(err)
    }

    console.log('Preparing for the next round of indexing...')
  }
  indexData()
})

module.exports = router
