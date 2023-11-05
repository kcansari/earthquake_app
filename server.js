const express = require('express')
const client = require('./elasticsearch/client')
const app = express()
const port = 3000
const data = require('./data_management/retrieve_and_ingest_data')
const cors = require('cors')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(cors())

app.use('/ingest_data', data)

app.get('/results', (req, res) => {
  const passedType = req.query.type
  const passedMag = req.query.mag
  const passedLocation = req.query.location
  const passedDateRange = req.query.dateRange
  const passedSortOption = req.query.sortOption

  let query = {
    sort: [
      {
        mag: {
          order: passedSortOption,
        },
      },
    ],
    size: 300,
    query: {
      bool: {
        filter: [
          {
            term: { type: passedType },
          },
          {
            range: {
              mag: {
                gte: passedMag,
              },
            },
          },
          {
            match: { place: passedLocation },
          },
          // for those who use prettier, make sure there is no whitespace.
          {
            range: {
              '@timestamp': {
                gte: `now-${passedDateRange}d/d`,
                lt: 'now/d',
              },
            },
          },
        ],
      },
    },
  }

  async function sendESRequest() {
    const body = await client.search({
      index: 'earthquakes',
      body: {
        sort: [
          {
            mag: {
              order: passedSortOption,
            },
          },
        ],
        size: 300,
        query: {
          bool: {
            filter: [
              {
                term: { type: passedType },
              },
              {
                range: {
                  mag: {
                    gte: passedMag,
                  },
                },
              },
              {
                match: { place: passedLocation },
              },
              // for those who use prettier, make sure there is no whitespace.
              {
                range: {
                  '@timestamp': {
                    gte: `now-${passedDateRange}d/d`,
                    lt: 'now/d',
                  },
                },
              },
            ],
          },
        },
      },
    })
    res.json(body.hits.hits)
  }
  sendESRequest()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
