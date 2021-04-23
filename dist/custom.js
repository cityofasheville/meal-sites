
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


class ObjectFilter {

  constructor() {

    // Let's be aware of the elements we'll be dealing with
    this.allObjects = $(".all-objects");
    this.selectArea = $("#filter-area");
    this.selectDay = $("#filter-day");
    this.selectType = $("#filter-type");
    this.showPrint =  $("#show-print");
    this.printReturn =  $("#print-return");
    this.showAll =  $("#show-all");

    // this.isFilterVisible = true;

    // These are the different "types" of filters that can be applied
    this.filterProperties = ['area','day','type'];
    this.filterPropertyLabels = ['Area','Day of the week','Service Type'];

    // This object tracks the state of selections and matches
    this.filterSelections = {
      areaKeys: [],
      areaLabels: [],
      dayKeys: [],
      dayLabels: [],
      typeKeys: [],
      typeLabels: [],
      matchedIDs: [],
      objectSelectors: []
    };

    // console.log(window.filterSelectors);
    // Array of Object IDs and selectors
    this.objectID = window.filterSelectors;
    this.events();

  } // end constructor

  events() {
    /*
    -------------------------------------------------------------------------
      Method to deal with "remove filter" actions
      That is, when a "selected filter" button is toggled off
    -------------------------------------------------------------------------
    */
    $(".selected-filters").on("click", ".filter-button", (e) => {

      // get data-filter-type attribute from the filter button clicked
      let removedType = e.target.attributes[2].nodeValue;

      // check for index using data-filter-value attribute of the button clicked
      // i.e. locate the position of that filter in the "state-tracking" object
      let removedValueIndex = this.filterSelections[`${removedType}Keys`].indexOf(e.target.attributes[1].nodeValue);

      if (removedValueIndex >= 0) {
        // remove the removed filter value from its position in the "state-tracking" object
        this.filterSelections[`${removedType}Keys`].splice(removedValueIndex,1);
        this.filterSelections[`${removedType}Labels`].splice(removedValueIndex,1);
      }

      // remove the filter button itself from the page
      $(`[data-filter-value='${e.target.attributes[1].nodeValue}']`).remove();

      if (!this.filterSelections[`${removedType}Keys`].length) {
        $(`.selected-filters-default-${removedType}`).removeClass("object--hidden");
      }

      // re-scan the "state" object and refresh display with matched items
      this.filtersRefresh();
    });

    this.selectArea.change( () => {
      this.filtersAdd.call(this, this.selectArea, 'area');
    });

    this.selectDay.change( () => {
      this.filtersAdd.call(this, this.selectDay, 'day');
    });

    this.selectType.change( () => {
      this.filtersAdd.call(this, this.selectType, 'type');
    });

    // Show all objects (remove all filters) (not currently used - 2020.03.30)
    this.showAll.on("click", () => {
      this.allObjects.removeClass("object--hidden");
      for (let p=0; p < this.filterProperties.length; p++) {
        this.filterSelections[`${this.filterProperties[p]}Keys`].length = 0;
        this.filterSelections[`${this.filterProperties[p]}Labels`].length = 0;
        $(`#list-group-${this.filterProperties[p]}`).html(`<li class="list-group-item selected-filters-default-${this.filterProperties[p]}">Any ${this.filterPropertyLabels[p]}</li>`);
      }
      this.filterSelections.matchedIDs.length = 0;
      this.filterSelections.objectSelectors = '';
    })

    this.showPrint.on("click", () => {
      this.printToggle();
    })

    this.printReturn.on("click", () => {
      this.printToggle();
    })
  }

  printToggle() {
    $(`.no-print`).toggleClass("object--hidden");
    $(`.print-view`).toggleClass("object--hidden");
    $(`#show-print`).toggleClass("object--hidden");
    $(`#print-return`).toggleClass("object--hidden");
  }

  // Method to scan state object and refresh display with matched items
  filtersRefresh() {

    // Slice it to make a copy, not a pointer!
    let remainingWorks = this.objectID.slice();
    let matchingWorks = [];

    console.log(remainingWorks);

    // for each possible property, look for user-selected filters
    this.filterProperties.forEach( (property) => {

      // if the property has filters selected...
      if (this.filterSelections[`${property}Keys`].length) {
        // ...then filter the set of artwork (remainingWorks)
        matchingWorks = remainingWorks.filter( (item) => {
          let filtermatches = 0;
          this.filterSelections[`${property}Keys`].forEach( (currProp) => {
            if (item.selectors.indexOf(currProp) >= 0) {
              filtermatches++;
            }
          });
          return filtermatches;
        });

        remainingWorks = matchingWorks.slice();
        matchingWorks.length = 0;
      }
    });

    // refresh all matched-item values in the state object
    this.filterSelections.matchedIDs.length = 0;
    this.filterSelections.matchedIDs = remainingWorks.slice();
    this.filterSelections.objectSelectors = '';

    let matchCount = 0;

    // Now, for each matched object...
    this.filterSelections.matchedIDs.forEach( (obj) => {

      // ...build a list of selectors for targeting
      this.filterSelections.objectSelectors += '.object-' + obj.objectID;

      matchCount++;

      // We don't want a comma at the end of the selectors list
      if (matchCount < this.filterSelections.matchedIDs.length) {
        this.filterSelections.objectSelectors += ', ';
      }

    });

    console.log('Refreshing Filters:');
    console.log(this.filterSelections.matchedIDs);
    console.log(this.filterSelections.objectSelectors);

    // this.filterSelections.matchedIDs holds the IDs matching current filters (use for custom print page)
    // console.log(this.filterSelections.matchedIDs);

    // Hide all thumbnails so we have a clean slate
    this.allObjects.addClass("object--hidden");

    // If any filters are still selected, reveal those thumbnails and hide the "no results" message
    if(this.filterSelections.matchedIDs.length) {
      $(`${this.filterSelections.objectSelectors}`).toggleClass("object--hidden");
      $(`#no-results`).removeClass('no-results--on');
    }
    else {
      // if nothing matched, reveal the "no results" message
      $(`#no-results`).addClass('no-results--on');
    }

  } // End filtersRefresh()

  // Method to add newly selected filters to state object
  filtersAdd(thisSelectedObject, thisSelectedType) {

    // If it's not already in the state object, let's add it!
    if ( this.filterSelections[`${thisSelectedType}Keys`].indexOf(thisSelectedObject.val()) < 0 ) {

      // Push newly selected filter onto the value and label arrays
      this.filterSelections[`${thisSelectedType}Keys`].push(thisSelectedObject.val());
      this.filterSelections[`${thisSelectedType}Labels`].push(thisSelectedObject.children("option:selected").text());

      console.log('Adding Filter - ' + thisSelectedType);

      this.filtersRefresh();

      // Add a "selected filter" button for the newly selected filter
      $(`#list-group-${thisSelectedType}`).append(` <li class="list-group-item filter-button" data-filter-value="${thisSelectedObject.val()}" data-filter-type="${thisSelectedType}" title="Click to remove this filter">${thisSelectedObject.children("option:selected").text()}</li>`);
      $(`.selected-filters-default-${thisSelectedType}`).addClass("object--hidden");
    }

    thisSelectedObject[0].selectedIndex = 0;

  } // end filtersAdd()

}