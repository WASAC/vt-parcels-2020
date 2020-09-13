# vt-parcels
![GitHub](https://img.shields.io/github/license/wasac/vt-parcels)
[![Netlify Status](https://api.netlify.com/api/v1/badges/58b0d7d0-f9ac-4bf4-b28a-2ec96843db8e/deploy-status)](https://app.netlify.com/sites/vt-parcels/deploys)

parcels vector tiles data in Rwanda

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
Copyright (c) 2020 Water and Sanitation Corporation, Ltd.
```

Vector tile URL
```
https://vt-parcels.netlify.app/tiles/{z}/{x}/{y}.mvt
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
- 13th September 2020
  - total number of tiles: 30504
  - actual number of tiles generated: 15200
  - 12832914.164ms=3.56469837888889hours
