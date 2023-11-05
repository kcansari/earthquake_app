const client = require('./elasticsearch/client')

class Helper {
  static parseDataToPipeIngest(results) {
    const isArray = Array.isArray(results)
    let earthquakeObject = {}

    if (!isArray) {
      throw new Error('Parameter is not an array!')
    }

    results.map(
      async (results) => (
        (earthquakeObject = {
          place: results.properties.place,
          time: results.properties.time,
          tz: results.properties.tz,
          url: results.properties.url,
          detail: results.properties.detail,
          felt: results.properties.felt,
          cdi: results.properties.cdi,
          alert: results.properties.alert,
          status: results.properties.status,
          tsunami: results.properties.tsunami,
          sig: results.properties.sig,
          net: results.properties.net,
          code: results.properties.code,
          sources: results.properties.sources,
          nst: results.properties.nst,
          dmin: results.properties.dmin,
          rms: results.properties.rms,
          mag: results.properties.mag,
          magType: results.properties.magType,
          type: results.properties.type,
          longitude: results.geometry.coordinates[0],
          latitude: results.geometry.coordinates[1],
          depth: results.geometry.coordinates[2],
        }),
        await client.index({
          index: 'earthquakes',
          id: results.id,
          body: earthquakeObject,
          pipeline: 'earthquake_data_pipeline',
        })
      )
    )
  }
}

module.exports = Helper
