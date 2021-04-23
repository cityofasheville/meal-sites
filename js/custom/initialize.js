
function getMealSites() {
  axios.get('https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/Meal_Merged_Map_View/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=type&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=500&returnZ=false&returnM=false&returnExceededLimitFeatures=false&quantizationParameters=&sqlFormat=none&f=pjson&token=')
  .then(res => {
    // logData(res.data.features);
    initializeDataset(res.data.features);
  })
  .catch(err => {
    if (err.response) {
      showError('Unexpected response: ' + err.message);
      // client received an error response (5xx, 4xx)
    } else if (err.request) {
      showError('Request failed: ' + err.message);
      // client never received a response, or request never left
    } else {
      showError(err.message);
    }
  });
}

function logData(d) {
  console.log('Func out');
  console.log(d);
}

function showError(err, eFile='NA') {
  let displayMsg = `
    <div class="col-12">
      <h2>Error Report</h2>
      <p>There was an problem retrieving data from the source. Please contact City of Asheville IT Services for assistance. (help@ashevillenc.gov | 828-251-4000)</p>
      <p>${err}</p>
      <p>Spreadsheet target: ${public_spreadsheet_url}</p>
      <p>File details: ${eFile}</p>
    </div>
  `;
  document.getElementById("object-filters").innerHTML = '';
  document.getElementById("object-filters").className = ''
  document.getElementById("view-switcher").innerHTML = '';
  document.getElementById("food-locations").className = 'row';
  document.getElementById("food-locations").innerHTML = displayMsg;
}


function initializeDataset(data) {

  let objCount = 0;
  let cardSelectors = '';
  let typeLabel = '';
  let sanitizedValue = '';
  let todaysDate = new Date();
      todaysDate.setHours(0,0,0,0);
  let thisObject = {};
  let dayClassM = '';
  let dayClassT = '';
  let dayClassW = '';
  let dayClassTh = '';
  let dayClassF = '';
  let dayClassSa = '';
  let dayClassSu = '';

  // Object will contain arrays of objects representing filter options
  window.filterOptions = {
    areas: [],
    days: [],
    types: [],
  };

  window.filterSelectors = [];
  window.foodLocationsHTML = '';
  window.foodLocationsPrintHTML = '';

  for (let obj of data) {

  // NOTE: originally ditched foreach loop b/c we needed to break the loop on encountering empty row from spreadsheet
  // since we started pulling more reliable data, can loop however you want 

    cardSelectors = '';

    if ( obj.attributes.startDate ) {
      startDate = new Date(obj.attributes.startDate);
    } 
    else {
      startDate = new Date('3/1/2020');
    }

    if ( obj.attributes.endDate ) {
      endDate = new Date(obj.attributes.endDate);
    } 
    else {
      endDate = new Date('1/1/2100');
    }
    
    if ( (todaysDate <= endDate) && (todaysDate >= startDate) && obj.attributes.name ) {

      if (obj.attributes.generalArea) {

        sanitizedValue = 'area-' + obj.attributes.generalArea.toLowerCase().replace(/[^0-9a-z]/gi, '');
        cardSelectors += sanitizedValue + ' ';
  
        if (window.filterOptions.areas.map(function(e) { return e.value; }).indexOf(sanitizedValue) < 0) {
            window.filterOptions.areas.push(
            {
              label: obj.attributes.generalArea,
              value: sanitizedValue
            }
          );
        }
      }
  
      if (obj.attributes.type) {
  
        sanitizedValue = 'type-' + obj.attributes.type.toLowerCase().replace(/[^0-9a-z]/gi, '');
        cardSelectors += sanitizedValue + ' ';
  
        if (window.filterOptions.types.map(function(e) { return e.value; }).indexOf(sanitizedValue) < 0) {
          if (obj.attributes.type === 'Students') { 
            typeLabel = 'Student Meals' 
          } else {
            typeLabel = obj.attributes.type 
          }
          window.filterOptions.types.push(
            {
              label: typeLabel,
              value: sanitizedValue
            }
          );
        }
      }
  
      if (obj.attributes.mo) {
        cardSelectors += 'day-mo ';
        dayClassM = 'day-of-week--on';
        if (window.filterOptions.days.map(function(e) { return e.value; }).indexOf('day-mo') < 0) {
          window.filterOptions.days.push(
            {
              index: 0,
              label: 'Monday',
              value: 'day-mo'
            }
          );  
        }
      }
      else {
        dayClassM = 'day-of-week--off';
      }
  
      if (obj.attributes.tu) {
        cardSelectors += 'day-tu ';
        dayClassT = 'day-of-week--on';
        if (window.filterOptions.days.map(function(e) { return e.value; }).indexOf('day-tu') < 0) {
          window.filterOptions.days.push(
            {
              index: 1,
              label: 'Tuesday',
              value: 'day-tu'
            }
          );  
        }
      }
      else {
        dayClassT = 'day-of-week--off';
      }
  
      if (obj.attributes.we) {
        cardSelectors += 'day-we ';
        dayClassW = 'day-of-week--on';
        if (window.filterOptions.days.map(function(e) { return e.value; }).indexOf('day-we') < 0) {
          window.filterOptions.days.push(
            {
              index: 2,
              label: 'Wednesday',
              value: 'day-we'
            }
          );  
        }
      }
      else {
        dayClassW = 'day-of-week--off';
      }
  
      if (obj.attributes.th) {
        cardSelectors += 'day-th ';
        dayClassTh = 'day-of-week--on';
        if (window.filterOptions.days.map(function(e) { return e.value; }).indexOf('day-th') < 0) {
          window.filterOptions.days.push(
            {
              index: 3,
              label: 'Thursday',
              value: 'day-th'
            }
          );  
        }
      }
      else {
        dayClassTh = 'day-of-week--off';
      }
  
      if (obj.attributes.fr) {
        cardSelectors += 'day-fr ';
        dayClassF = 'day-of-week--on';
        if (window.filterOptions.days.map(function(e) { return e.value; }).indexOf('day-fr') < 0) {
          window.filterOptions.days.push(
            {
              index: 4,
              label: 'Friday',
              value: 'day-fr'
            }
          );  
        }
      }
      else {
        dayClassF = 'day-of-week--off';
      }
  
      if (obj.attributes.sa) {
        cardSelectors += 'day-sa ';
        dayClassSa = 'day-of-week--on';
        if (window.filterOptions.days.map(function(e) { return e.value; }).indexOf('day-sa') < 0) {
          window.filterOptions.days.push(
            {
              index: 5,
              label: 'Saturday',
              value: 'day-sa'
            }
          );  
        }
      }
      else {
        dayClassSa = 'day-of-week--off';
      }
  
      if (obj.attributes.su) {
        cardSelectors += 'day-su ';
        dayClassSu = 'day-of-week--on';
        if (window.filterOptions.days.map(function(e) { return e.value; }).indexOf('day-su') < 0) {
          window.filterOptions.days.push(
            {
              index: 6,
              label: 'Sunday',
              value: 'day-su'
            }
          );  
        }
      }
      else {
        dayClassSu = 'day-of-week--off';
      }

      if ( !obj.attributes.startTime && !obj.attributes.endTime ) {
        obj.attributes.hoursOpen = 'Hours not specified';
      }
      else if ( obj.attributes.startTime && !obj.attributes.endTime ) {
        obj.attributes.hoursOpen = `${obj.attributes.startTime} onward`;
      }
      else if ( !obj.startTime && obj.endTime ) {
        obj.attributes.hoursOpen = `Until ${obj.attributes.endTime}`;
      }
      else {
        obj.attributes.hoursOpen = `${obj.attributes.startTime} - ${obj.attributes.endTime}`;
      }
      
      if ( !obj.attributes.startDate && !obj.attributes.endDate ) {
        obj.daysOpen = 'Dates not specified';
      }
      else if ( obj.attributes.startDate && !obj.attributes.endDate || obj.attributes.startDate && moment(todaysDate).format("YYYY") < moment(endDate).format("YYYY") ) {
        obj.attributes.daysOpen = `${moment(startDate).format("MMM Do, YYYY")} onward`;
      }
      else if ( !obj.attributes.startDate && obj.attributes.endDate && moment(todaysDate).format("YYYY") === moment(endDate).format("YYYY") ) {
        obj.attributes.daysOpen = `Effective until ${moment(endDate).format("MMM Do, YYYY")}`;
      }
      else if ( !obj.attributes.startDate && obj.attributes.endDate && moment(todaysDate).format("YYYY") < moment(endDate).format("YYYY") ) {
        obj.attributes.daysOpen = `Ongoing`;
      }
      else {
        if ( obj.attributes.startDate === obj.attributes.endDate ) {
          obj.attributes.daysOpen = `${moment(startDate).format("MMM Do, YYYY")} Only`;
        }
        else {
          obj.attributes.daysOpen = `${moment(startDate).format("MMM Do, YYYY")} - ${moment(endDate).format("MMM Do, YYYY")}`;
        }
      }

      switch ( obj.attributes.type ) {
        case "Students":
          obj.attributes.serviceIcon = `<i class="fas fa-utensils service-student"></i>`;
          break;
        case "Student Delivery Site":
          obj.attributes.serviceIcon = `<i class="fas fa-truck-loading service-delivery"></i>`;
          break;
        case "Meal Pickup":
          obj.attributes.serviceIcon = `<i class="fas fa-toolbox service-meal"></i>`;
          break;
        case "Food Box Pickup":
          obj.attributes.serviceIcon = `<i class="fas fa-shopping-basket service-foodbox"></i>`;
          break;
        case "Farmers Market":
          obj.attributes.serviceIcon = `<i class="fas fa-tractor service-farmersmarket"></i>`;
          break;
        case "Senior Meals":
          obj.attributes.serviceIcon = `<i class="fab fa-stripe-s service-seniormeals"></i>`;
          break;
        case "EBT Groceries":
          obj.attributes.serviceIcon = `<i class="far fa-credit-card service-ebtgroceries"></i>`;
          break;
        case "WIC Groceries":
          obj.attributes.serviceIcon = `<i class="fas fa-baby service-wicgroceries"></i>`;
          break;
        case "Community Gardens":
          obj.attributes.serviceIcon = `<i class="fas fa-seedling service-communitygardens"></i>`;
          break;
        default:
          obj.attributes.serviceIcon = "";
      }
        
      obj.attributes.selectors = cardSelectors;
      obj.attributes.styleM = dayClassM;
      obj.attributes.styleT = dayClassT;
      obj.attributes.styleW = dayClassW;
      obj.attributes.styleTh = dayClassTh;
      obj.attributes.styleF = dayClassF;
      obj.attributes.styleSa = dayClassSa;
      obj.attributes.styleSu = dayClassSu;
  
      thisObject = {
        objectID: obj.attributes.OBJECTID,
        selectors: cardSelectors
      };
  
      window.filterSelectors.push(thisObject);
  
      addCard(obj.attributes);

      objCount++;
    }
  }

  console.log(`-- Filter Selectors on the Window (${objCount}) --`);
  console.log(window.filterSelectors);

  // Sort the options sensibly for display
  window.filterOptions.areas.sort( (a,b) => a.label > b.label ? 1 : -1 );
  window.filterOptions.types.sort( (a,b) => a.label > b.label ? 1 : -1 );
  window.filterOptions.days.sort( (a,b) => a.index > b.index ? 1 : -1 )

  let areaOptions = '';
  for (let i=0; i < window.filterOptions.areas.length; i++) {
    areaOptions += `<option value="${window.filterOptions.areas[i].value}">${window.filterOptions.areas[i].label}</option>`
  }
  document.getElementById('filter-area').innerHTML += areaOptions;

  let dayOptions = '';
  for (let i=0; i < window.filterOptions.days.length; i++) {
    dayOptions += `<option value="${window.filterOptions.days[i].value}">${window.filterOptions.days[i].label}</option>`
  }
  document.getElementById('filter-day').innerHTML += dayOptions;

  let typeOptions = '';
  for (let i=0; i < window.filterOptions.types.length; i++) {
    typeOptions += `<option value="${window.filterOptions.types[i].value}">${window.filterOptions.types[i].label}</option>`
  }
  document.getElementById('filter-type').innerHTML += typeOptions;

  document.getElementById('food-locations').innerHTML = window.foodLocationsHTML;
  document.getElementById('food-locations-print').innerHTML = window.foodLocationsPrintHTML;
  
  // Now that all incoming data is processed, instantiate the filter object
  var objectFilter = new ObjectFilter; 
  
  console.log('-- Fresh ObjectFilter, post-initialization --');
  console.log(objectFilter);
}

function addCard(o) {

  let q = encodeURIComponent(o.address);

  window.foodLocationsHTML += `
    <div class="col p-0 mb-5 all-objects object-${o.OBJECTID} ${o.selectors}">
      <div class="card inner m-3 h-100">
        <div class="card-header"><h3>${o.name}</h3></div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${o.generalArea}</li>
          <li class="list-group-item">${o.serviceIcon} ${o.type === 'Students' ? 'Student Meals' : o.type}</li>
          <li class="list-group-item">
            <ul class="week-list" aria-label="Days of the week">
              <li class="day-of-week ${o.styleM}" title="${o.name} ${o.type} service is ${o.styleM === 'day-of-week--on' ? 'open' : 'closed'} on Monday"><span class="day-label">M</span></li>
              <li class="day-of-week ${o.styleT}" title="${o.name} ${o.type} service is ${o.styleT === 'day-of-week--on' ? 'open' : 'closed'} on Tuesday"><span class="day-label">T</span></li>
              <li class="day-of-week ${o.styleW}" title="${o.name} ${o.type} service is ${o.styleW === 'day-of-week--on' ? 'open' : 'closed'} on Wednesday"><span class="day-label">W</span></li>
              <li class="day-of-week ${o.styleTh}" title="${o.name} ${o.type} service is ${o.styleTh === 'day-of-week--on' ? 'open' : 'closed'} on Thursday"><span class="day-label">Th</span></li>
              <li class="day-of-week ${o.styleF}" title="${o.name} ${o.type} service is ${o.styleF === 'day-of-week--on' ? 'open' : 'closed'} on Friday"><span class="day-label">F</span></li>
              <li class="day-of-week ${o.styleSa}" title="${o.name} ${o.type} service is ${o.styleSa === 'day-of-week--on' ? 'open' : 'closed'} on Saturday"><span class="day-label">Sa</span></li>
              <li class="day-of-week ${o.styleSu}" title="${o.name} ${o.type} service is ${o.styleSu === 'day-of-week--on' ? 'open' : 'closed'} on Sunday"><span class="day-label">Su</span></li>
            </ul>
          </li>          
          <li class="list-group-item">${o.hoursOpen}<br />${o.daysOpen}</li>
          <li class="list-group-item"><a class="map-link text-dark" href="https://www.google.com/maps/search/${q}" title="View location of ${o.name} on a Google Map" target="_blank">Location</a>: ${o.address}</li>
        </ul>
      </div>
    </div>
  `;

  window.foodLocationsPrintHTML += `
    <tr class="all-objects object-${o.OBJECTID} ${o.selectors}">
      <td><h3>${o.name}</h3>${o.serviceIcon} ${o.type === 'Students' ? 'Student Meals' : o.type}</td>
      <td>
        <ul class="week-list week-list--print" aria-label="Days of the week">
          <li class="day-of-week ${o.styleM}" title="${o.name} ${o.type} service is ${o.styleM === 'day-of-week--on' ? 'open' : 'closed'} on Monday"><span class="day-label">M</span></li>
          <li class="day-of-week ${o.styleT}" title="${o.name} ${o.type} service is ${o.styleT === 'day-of-week--on' ? 'open' : 'closed'} on Tuesday"><span class="day-label">T</span></li>
          <li class="day-of-week ${o.styleW}" title="${o.name} ${o.type} service is ${o.styleW === 'day-of-week--on' ? 'open' : 'closed'} on Wednesday"><span class="day-label">W</span></li>
          <li class="day-of-week ${o.styleTh}" title="${o.name} ${o.type} service is ${o.styleTh === 'day-of-week--on' ? 'open' : 'closed'} on Thursday"><span class="day-label">Th</span></li>
          <li class="day-of-week ${o.styleF}" title="${o.name} ${o.type} service is ${o.styleF === 'day-of-week--on' ? 'open' : 'closed'} on Friday"><span class="day-label">F</span></li>
          <li class="day-of-week ${o.styleSa}" title="${o.name} ${o.type} service is ${o.styleSa === 'day-of-week--on' ? 'open' : 'closed'} on Saturday"><span class="day-label">Sa</span></li>
          <li class="day-of-week ${o.styleSu}" title="${o.name} ${o.type} service is ${o.styleSu === 'day-of-week--on' ? 'open' : 'closed'} on Sunday"><span class="day-label">Su</span></li>
        </ul>
        ${o.hoursOpen} | ${o.daysOpen}
      </td>
      <td>Area: ${o.generalArea}<br /><a class="map-link text-dark" href="https://www.google.com/maps/search/${q}" title="View location of ${o.name} on a Google Map" target="_blank">${o.address}</a></td>
    </tr>
  `;

}      

const initialize = document.addEventListener('DOMContentLoaded', getMealSites);

console.log('Initializing now...');
