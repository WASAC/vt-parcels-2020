require('dotenv').config();

const BBOX = `ST_Transform(ST_MakeEnvelope({minx}, {miny}, {maxx}, {maxy}, 3857), 4326)`;

module.exports ={
  db: {
    user:process.env.db_user,
    password:process.env.db_password,
    host:process.env.db_host,
    port:process.env.db_port,
    database:'rw_parcels',
  },
  format:{
    type: 'mbtiles',
    output: __dirname + '/data/parcels.mbtiles',
    metadata: {
      "name": "rwanda-parcels",
      "description":"parcels data in vector tiles as of 21 July 2020",
      "format":"pbf",
      "version": 1,
      "minzoom": 16,
      "maxzoom": 16,
      "center": "30.060,-1.945, 15",
      "bounds": "28.861730820621, -2.84023010213741, 30.8997466415943, -1.04716670707785",
      "type": "overlay",
      "json": `{"vector_layers": [ { "id": "parcels", "description": "", "minzoom": 15, "maxzoom": 15, "fields": {} },{ "id": "parcels_annotation", "description": "", "minzoom": 15, "maxzoom": 15, "fields": {} } ] }`
    },
  },
  // format:{
  //   type: 'pbf',
  //   output: __dirname + '/public/tiles',
  // },
  layers : [
    {
      name: 'parcels',
      buffer: 2,
      minzoom: 16,
      maxzoom:16,
      query:`
      WITH union_parcels as(
        SELECT
          objectid,
          parcel_num,
          geom
        FROM eastern_province
        WHERE NOT ST_IsEmpty(geom)
        AND geom && ST_Buffer(${BBOX}, 0.0000001)
        UNION ALL
        SELECT
          objectid,
          parcel_num,
          geom
        FROM kigali_city_province
        WHERE NOT ST_IsEmpty(geom)
        AND geom && ST_Buffer(${BBOX}, 0.0000001)
        UNION ALL
        SELECT
          objectid,
          parcel_num,
          geom
        FROM northern_province
        WHERE NOT ST_IsEmpty(geom)
        AND geom && ST_Buffer(${BBOX}, 0.0000001)
        UNION ALL
        SELECT
          objectid,
          parcel_num,
          geom
        FROM southern_province
        WHERE NOT ST_IsEmpty(geom)
        AND geom && ST_Buffer(${BBOX}, 0.0000001)
        UNION ALL
        SELECT
          objectid,
          parcel_num,
          geom
        FROM western_province
        WHERE NOT ST_IsEmpty(geom)
        AND geom && ST_Buffer(${BBOX}, 0.0000001)
      )
      ,final as(
        SELECT
        'Feature' AS type,
        ST_Intersection(ST_Buffer(x.geom, 0.0000001), ST_Buffer(${BBOX}, 0.0000001)) AS geom,
        row_to_json((
          SELECT p FROM (
          SELECT
            x.objectid as id,
            x.parcel_num parcel_no
          ) AS p
        )) AS properties
        FROM union_parcels x
      )
      SELECT row_to_json(featurecollection) AS json FROM (
        SELECT
          'FeatureCollection' AS type,
          array_to_json(array_agg(feature)) AS features
        FROM (
          SELECT
          x.type,
          ST_AsGeoJSON(x.geom)::json AS geometry,
          x.properties
          FROM final x
          WHERE NOT ST_IsEmpty(x.geom)
        ) AS feature
      ) AS featurecollection
      `
    },
    {
      name: 'parcels_annotation',
      buffer: 0,
      minzoom: 16,
      maxzoom:16,
      query:`
      WITH union_parcels as(
        SELECT
          objectid,
          parcel_num,
          geom
        FROM eastern_province
        WHERE NOT ST_IsEmpty(geom)
        AND geom && ST_Buffer(${BBOX}, 0.0000001)
        UNION ALL
        SELECT
          objectid,
          parcel_num,
          geom
        FROM kigali_city_province
        WHERE NOT ST_IsEmpty(geom)
        AND geom && ST_Buffer(${BBOX}, 0.0000001)
        UNION ALL
        SELECT
          objectid,
          parcel_num,
          geom
        FROM northern_province
        WHERE NOT ST_IsEmpty(geom)
        AND geom && ST_Buffer(${BBOX}, 0.0000001)
        UNION ALL
        SELECT
          objectid,
          parcel_num,
          geom
        FROM southern_province
        WHERE NOT ST_IsEmpty(geom)
        AND geom && ST_Buffer(${BBOX}, 0.0000001)
        UNION ALL
        SELECT
          objectid,
          parcel_num,
          geom
        FROM western_province
        WHERE NOT ST_IsEmpty(geom)
        AND geom && ST_Buffer(${BBOX}, 0.0000001)
      )
      ,final as(
        SELECT
        'Feature' AS type,
        ST_Intersection(ST_CENTROID(x.geom), ST_Buffer(${BBOX}, 0.0000001)) AS geom,
        row_to_json((
          SELECT p FROM (
          SELECT
          x.objectid as id,
          x.parcel_num parcel_no
          ) AS p
        )) AS properties
        FROM union_parcels x
        WHERE NOT ST_IsEmpty(x.geom)
      )
      SELECT row_to_json(featurecollection) AS json FROM (
        SELECT
          'FeatureCollection' AS type,
          array_to_json(array_agg(feature)) AS features
        FROM (
          SELECT
          x.type,
          ST_AsGeoJSON(x.geom)::json AS geometry,
          x.properties
          FROM final x
          WHERE x.geom IS NOT NULL AND (NOT ST_IsEmpty(x.geom))
        ) AS feature
      ) AS featurecollection
      `
    },
  ]
}