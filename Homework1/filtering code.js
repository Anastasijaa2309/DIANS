const fs = require('fs');

const csvFilePath = 'path/to/sample_data.csv';  

// read the CSV
const csvData = fs.readFileSync(csvFilePath, 'utf-8');

const userLocation = { lat: 40.7128, lon: -74.0060 };
const currentTime = 14;

// convert CSV
const wineriesData = csvData.trim().split('\n').map(row => {
  const keys = csvData.trim().split('\n')[0].split(',');
  const values = row.split(',');
  return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
});

//filter
function filterOpenWineries(wineryData, currentTime) {
  return wineryData.filter(winery => {
    try {
      const openingTime = parseInt(winery.opening_hours);
      const closingTime = parseInt(winery.closing_hours);
      return currentTime >= openingTime && currentTime <= closingTime;
    } catch (error) {
      return false;
    }
  });
}

function filterSortByProximity(openWineries, userLocation) {
  const { lat: userLat, lon: userLon } = userLocation;
  return openWineries.sort((a, b) =>
    geodesic([userLat, userLon], [parseFloat(a.lat), parseFloat(a.lon)]).miles -
    geodesic([userLat, userLon], [parseFloat(b.lat), parseFloat(b.lon)]).miles
  );
}

const openWineries = filterOpenWineries(wineriesData, currentTime);
const sortedWineries = filterSortByProximity(openWineries, userLocation);

sortedWineries.forEach(winery => {
  console.log(winery);
});
