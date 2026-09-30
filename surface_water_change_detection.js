var region = ee.Geometry.Rectangle([
  80.05, 12.85,
  80.30, 13.25
]);

function maskClouds(image) {
  var qa = image.select('QA60');
  var cloud = 1 << 10;
  var cirrus = 1 << 11;

  return image.updateMask(
    qa.bitwiseAnd(cloud).eq(0)
      .and(qa.bitwiseAnd(cirrus).eq(0))
  );
}

function getImage(year) {
  return ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(region)
    .filterDate(
      ee.Date.fromYMD(year, 1, 1),
      ee.Date.fromYMD(year, 3, 1)
    )
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(maskClouds)
    .median()
    .clip(region);
}

function getWater(year) {
  var image = getImage(year);

  var ndwi = image.normalizedDifference(['B3', 'B8']);
  var mndwi = image.normalizedDifference(['B3', 'B11']);
  var ndvi = image.normalizedDifference(['B8', 'B4']);

  return mndwi.gt(0.15)
    .and(ndwi.gt(0.10))
    .and(ndvi.lt(0.20))
    .rename('water');
}

function getArea(year) {
  var water = getWater(year);

  var area = water
    .multiply(ee.Image.pixelArea())
    .divide(1000000)
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: region,
      scale: 20,
      maxPixels: 1e10
    });

  return ee.Feature(null, {
    year: year,
    water_area_km2: area.get('water')
  });
}

var water2018 = getWater(2018);
var water2020 = getWater(2020);
var water2022 = getWater(2022);
var water2024 = getWater(2024);
var water2026 = getWater(2026);

var gain = water2026
  .and(water2018.not())
  .selfMask();

var loss = water2018
  .and(water2026.not())
  .selfMask();

var gainArea = gain
  .multiply(ee.Image.pixelArea())
  .divide(1000000)
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: region,
    scale: 20,
    maxPixels: 1e10
  });

var lossArea = loss
  .multiply(ee.Image.pixelArea())
  .divide(1000000)
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: region,
    scale: 20,
    maxPixels: 1e10
  });

print('Water Gain (km²)', gainArea.get('water'));
print('Water Loss (km²)', lossArea.get('water'));

var statistics = ee.FeatureCollection([
  getArea(2018),
  getArea(2020),
  getArea(2022),
  getArea(2024),
  getArea(2026)
]);

print('Multi-Year Water Statistics', statistics);

print(
  ui.Chart.feature.byFeature(
    statistics,
    'year',
    'water_area_km2'
  ).setOptions({
    title: 'Surface Water Area Change',
    hAxis: {title: 'Year'},
    vAxis: {title: 'Water Area (km²)'},
    lineWidth: 3,
    pointSize: 6
  })
);

var gainHotspots = gain
  .connectedPixelCount(100, true)
  .gte(9)
  .selfMask();

var lossHotspots = loss
  .connectedPixelCount(100, true)
  .gte(9)
  .selfMask();

Map.centerObject(region, 11);

Map.addLayer(
  getImage(2026),
  {
    bands: ['B4', 'B3', 'B2'],
    min: 0,
    max: 3000
  },
  'Satellite Image 2026'
);

Map.addLayer(
  water2018.selfMask(),
  {palette: ['0000FF']},
  'Water 2018'
);

Map.addLayer(
  water2026.selfMask(),
  {palette: ['00FFFF']},
  'Water 2026'
);

Map.addLayer(
  gainHotspots,
  {palette: ['00FF00']},
  'Water Gain Hotspots'
);

Map.addLayer(
  lossHotspots,
  {palette: ['FF0000']},
  'Water Loss Hotspots'
);
