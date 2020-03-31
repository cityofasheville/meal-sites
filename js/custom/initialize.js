var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1l4JL0SWvufEVlZnJzjAA_oIejsSbjQBEdfVSG4xQbpo/pubhtml';

function init() {
  Tabletop.init( { 
    key: publicSpreadsheetUrl,
    callback: showInfo,
    orderby: 'startTime',
    simpleSheet: true
  } )
}

function showInfo(data, tabletop) {
  
  let objCount = 0;
  let rowHasRoom = 0;
  let cardSelectors = '';
  let typeLabel = '';
  let sanitizedValue = '';
  let todaysDate = new Date();
  // var startDate = new Date();
  // var endDate = new Date;
  let thisObject = {};
  let dayClassM = '';
  let dayClassT = '';
  let dayClassW = '';
  let dayClassTh = '';
  let dayClassF = '';
  let dayClassSa = '';
  let dayClassSu = '';



  window.filterOptions = {
    areaLabels: [],
    areaValues: [],
    dayLabels: [],
    dayValues: [],
    typeLabels: [],
    typeValues: []
  };

  window.filterSelectors = [];

  console.log(todaysDate);
  // console.log(window);

  data.forEach((obj) => {

    cardSelectors = '';
    rowHasRoom = objCount % 3;

    if (obj.startDate.trim()) {
      startDate = new Date(obj.startDate);
    } 
    else {
      startDate = new Date('3/1/2020');
    }

    if (obj.endDate.trim()) {
      endDate = new Date(obj.endDate);
    } 
    else {
      endDate = new Date('1/1/2100');
    }
    
    if ( (todaysDate < endDate) && (todaysDate > startDate) ) {

      if (obj.generalArea.trim()) {

        sanitizedValue = 'area-' + obj.generalArea.trim().toLowerCase().replace(/[^0-9a-z]/gi, '');
        cardSelectors += sanitizedValue + ' ';
  
        if (window.filterOptions.areaValues.indexOf(sanitizedValue) < 0) {
          window.filterOptions.areaLabels.push(obj.generalArea.trim());
          window.filterOptions.areaValues.push(sanitizedValue);
        }
      }
  
      if (obj.type.trim()) {
  
        sanitizedValue = 'type-' + obj.type.trim().toLowerCase().replace(/[^0-9a-z]/gi, '');
        cardSelectors += sanitizedValue + ' ';
  
        if (window.filterOptions.typeValues.indexOf(sanitizedValue) < 0) {
          if (obj.type.trim() === 'Students') { 
            typeLabel = 'Student Meals' 
          } else {
            typeLabel = obj.type.trim() 
          }
          window.filterOptions.typeLabels.push(typeLabel);
          window.filterOptions.typeValues.push(sanitizedValue);
        }
      }
  
      if (obj.mo.trim()) {
        cardSelectors += 'day-mo ';
        dayClassM = 'day-of-week--on';
  
        if (window.filterOptions.dayValues.indexOf('day-mo') < 0) {
          window.filterOptions.dayLabels.push('Monday');
          window.filterOptions.dayValues.push('day-mo');
        }
      }
      else {
        dayClassM = 'day-of-week--off';
      }
  
      if (obj.tu.trim()) {
        cardSelectors += 'day-tu ';
        dayClassT = 'day-of-week--on';
  
        if (window.filterOptions.dayValues.indexOf('day-tu') < 0) {
          window.filterOptions.dayLabels.push('Tuesday');
          window.filterOptions.dayValues.push('day-tu');
        }
      }
      else {
        dayClassT = 'day-of-week--off';
      }
  
      if (obj.we.trim()) {
        cardSelectors += 'day-we ';
        dayClassW = 'day-of-week--on';
  
        if (window.filterOptions.dayValues.indexOf('day-we') < 0) {
          window.filterOptions.dayLabels.push('Wednesday');
          window.filterOptions.dayValues.push('day-we');
        }
      }
      else {
        dayClassW = 'day-of-week--off';
      }
  
      if (obj.th.trim()) {
        cardSelectors += 'day-th ';
        dayClassTh = 'day-of-week--on';
  
        if (window.filterOptions.dayValues.indexOf('day-th') < 0) {
          window.filterOptions.dayLabels.push('Thursday');
          window.filterOptions.dayValues.push('day-th');
        }
      }
      else {
        dayClassTh = 'day-of-week--off';
      }
  
      if (obj.fr.trim()) {
        cardSelectors += 'day-fr ';
        dayClassF = 'day-of-week--on';
  
        if (window.filterOptions.dayValues.indexOf('day-fr') < 0) {
          window.filterOptions.dayLabels.push('Friday');
          window.filterOptions.dayValues.push('day-fr');
        }
      }
      else {
        dayClassF = 'day-of-week--off';
      }
  
      if (obj.sa.trim()) {
        cardSelectors += 'day-sa ';
        dayClassSa = 'day-of-week--on';
  
        if (window.filterOptions.dayValues.indexOf('day-sa') < 0) {
          window.filterOptions.dayLabels.push('Saturday');
          window.filterOptions.dayValues.push('day-sa');
        }
      }
      else {
        dayClassSa = 'day-of-week--off';
      }
  
      if (obj.su.trim()) {
        cardSelectors += 'day-su ';
        dayClassSu = 'day-of-week--on';
  
        if (window.filterOptions.dayValues.indexOf('day-su') < 0) {
          window.filterOptions.dayLabels.push('Sunday');
          window.filterOptions.dayValues.push('day-su');
        }
      }
      else {
        dayClassSu = 'day-of-week--off';
      }
  
      obj.selectors = cardSelectors;
      obj.styleM = dayClassM;
      obj.styleT = dayClassT;
      obj.styleW = dayClassW;
      obj.styleTh = dayClassTh;
      obj.styleF = dayClassF;
      obj.styleSa = dayClassSa;
      obj.styleSu = dayClassSu;
  
      thisObject = {
        objectID: obj.GEOID,
        selectors: cardSelectors
      };
  
      window.filterSelectors.push(thisObject);
  
      addCard(obj,rowHasRoom);
  
      objCount++;
  
    }


    // let startDate = null;
    // let endDate = null;
  
  });

  console.log(window.filterSelectors);

  let areaOptions = '';
  for (let i=0; i < window.filterOptions.areaValues.length; i++) {
    areaOptions += `<option value="${window.filterOptions.areaValues[i]}">${window.filterOptions.areaLabels[i]}</option>`
  }
  document.getElementById('filter-area').innerHTML += areaOptions;

  let dayOptions = '';
  for (let i=0; i < window.filterOptions.dayValues.length; i++) {
    dayOptions += `<option value="${window.filterOptions.dayValues[i]}">${window.filterOptions.dayLabels[i]}</option>`
  }
  document.getElementById('filter-day').innerHTML += dayOptions;

  let typeOptions = '';
  for (let i=0; i < window.filterOptions.typeValues.length; i++) {
    typeOptions += `<option value="${window.filterOptions.typeValues[i]}">${window.filterOptions.typeLabels[i]}</option>`
  }
  document.getElementById('filter-type').innerHTML += typeOptions;

}

function addCard(o,rowMod) {

  let q = encodeURIComponent(o.address);

  document.getElementById('food-locations').innerHTML += `
    <div class="col p-0 mb-5 all-objects object-${o.GEOID} ${o.selectors}">
      <div class="card inner m-3 h-100">
        <div class="card-header"><h3>${o.name}</h3></div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${o.generalArea}</li>
          <li class="list-group-item">Service: ${o.type === 'Students' ? 'Student Meals' : o.type}</li>
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
          <li class="list-group-item">Open from ${o.startTime} - ${o.endTime}</li>
          <li class="list-group-item"><a class="map-link text-dark" href="https://www.google.com/maps/search/${q}" title="View location of ${o.name} on a Google Map" target="_blank">Location</a>: ${o.address}</li>
        </ul>
      </div>
    </div>
  `;

}      

document.addEventListener('DOMContentLoaded', init);
