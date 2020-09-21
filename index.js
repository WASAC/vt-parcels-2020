const MvtGenerator = require('mvt-generator');
const config = require('./config');

const generate = async()=>{
  console.time('generate');
  // all country
  var extent = [28.861730820621, -2.84023010213741, 30.8997466415943, -1.04716670707785];
  // Nyarugenge
  // var extent = [29.9775193315519, -2.07576858425267, 30.0868420202431, -1.86677354935978];
  var minzoom = 16;
  var maxzoom = 16;

  const mvtGenerator = new MvtGenerator(config);
  await mvtGenerator.generate(extent, minzoom, maxzoom);
  console.timeEnd('generate');
};

module.exports = generate();