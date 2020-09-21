# vt-parcels
![GitHub](https://img.shields.io/github/license/wasac/vt-parcels-2020)
[![Netlify Status](https://api.netlify.com/api/v1/badges/efe4fdd0-451e-4e32-b845-f8871cab8559/deploy-status)](https://app.netlify.com/sites/vt-parcels-2020/deploys)

parcels vector tiles data as of 21 July 2020 in Rwanda

## License of Vector Tiles Data

Shield: [![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a [Creative Commons Attribution 4.0 International
License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg

Please put the following attribution when you use this vector tiles of land parcels.
```
Copyright (c) 2020 Rwanda Land Management and Use Authority(RLMUA)
```

Vector tile URL
```
https://vt-parcels-2020.netlify.app/tiles/{z}/{x}/{y}.pbf
```

## Preparation

### create database

```
psql -h localhost -p 25432 -U docker -d postgres
create database rw_parcels;
\c rw_parcels;
create extension postgis;
select postgis_version();
\q
```

### transform CRS to EPSG:4326
Use QGIS to transform CRS to 4326.
Shapefiles can be created under wgs84 folder.

### import Shapefiles
Use QGIS to import Shapefiles, or import by `shp2pgsql` command
```
cd PARCELS_21_07_2020/wgs84
shp2pgsql -I -s 4326 eastern_province.shp eastern_province.shp | psql -h localhost -p 25432 -U docker -d rw_parcels
shp2pgsql -I -s 4326 kigali_city_province.shp kigali_city_province | psql -h localhost -p 25432 -U docker -d rw_parcels
shp2pgsql -I -s 4326 northern_province.shp northern_province | psql -h localhost -p 25432 -U docker -d rw_parcels
shp2pgsql -I -s 4326 southern_province.shp southern_province | psql -h localhost -p 25432 -U docker -d rw_parcels
shp2pgsql -I -s 4326 western_province.shp western_province | psql -h localhost -p 25432 -U docker -d rw_parcels
```

### create spatial index
```
CREATE INDEX idx_eastern_province_geometry ON public.eastern_province USING gist(geom);
CREATE INDEX idx_kigali_city_province_geometry ON public.kigali_city_province USING gist(geom);
CREATE INDEX idx_northern_province_geometry ON public.northern_province USING gist(geom);
CREATE INDEX idx_southern_province_geometry ON public.southern_province USING gist(geom);
CREATE INDEX idx_western_province_geometry ON public.western_province USING gist(geom);
```

### analyze
```
ANALYZE;
```

## Usage

- create vector tiles
```
npm i
npm run create
```

- extract pbf from mbtiles
```
npm run extract
```

- deploy to gh-pages
```
npm run deploy
```

- deploy to netlify
```
npm install -g netlify-cli
netlify -v
netlify login
netlify deploy
```

## Time to generate vector tiles
- 21st September 2020
  - total number of tiles: 122016
  - actual number of tiles generated: 59943
  - 16867338.345ms=4.6853717625hours
