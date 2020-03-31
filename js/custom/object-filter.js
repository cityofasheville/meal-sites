
class ObjectFilter {

  constructor() {

    // Let's be aware of the elements we'll be dealing with
    this.allObjects = $(".all-objects");
    this.selectArea = $("#filter-area");
    this.selectDay = $("#filter-day");
    this.selectType = $("#filter-type");
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
  }

  // Method to scan state object and refresh display with matched items
  filtersRefresh() {

    // Slice it to make a copy, not a pointer!
    let remainingWorks = this.objectID.slice();
    let matchingWorks = [];

    //console.log(remainingWorks);

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

      this.filtersRefresh();

      // Add a "selected filter" button for the newly selected filter
      $(`#list-group-${thisSelectedType}`).append(` <li class="list-group-item filter-button" data-filter-value="${thisSelectedObject.val()}" data-filter-type="${thisSelectedType}" title="Click to remove this filter">${thisSelectedObject.children("option:selected").text()}</li>`);
      $(`.selected-filters-default-${thisSelectedType}`).addClass("object--hidden");
    }

    thisSelectedObject[0].selectedIndex = 0;

  } // end filtersAdd()

}

// wait a couple seconds for external data to load before instantiating
setTimeout(function() { 
  var objectFilter = new ObjectFilter; 
}, 2000);