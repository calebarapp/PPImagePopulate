//========================================================================================
// contextual web search API variables: 
const ApiKey = "4c077f935dmsh561fe54be2c0d5ap16df5ajsnc9876cbb6d35";
const pageNumber = 1;
const pageSize = 12;
const autoCorrect = true;
const safeSearch = false;
const ApiUrl = "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q="
    + keywords + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&autoCorrect="
    + autoCorrect + "&safeSearch=" + safeSearch;

//========================================================================================

//=========================================================================================
// Image Search
//=========================================================================================

(function () {
    "use strict";

    // knockout.js viewmodel for displaying list of searchresults 
    let imageResultsViewModel = {
        imageSearchResults: ko.observableArray([])
    }

    // Gets keyword from title and seperates bold text from body.
    function _getSearchKeywords() {
        let title = $('#slideTitle').val();
        let body = $('#slideBody').html();
        let el = $('<div></div>');
        el.html(body)
        // Formating search keywords. Grabs all bold text, create an array, map through array to extract the text, join the array, replace whitespace with '+'.
        body = $('b', el).toArray()
            .map(function (x) { return x.innerHTML })
            .join().trim()
            .replace(' ', '+');
        title = title.trim().replace(' ', '+');
        // branching for keyword out put.
        let results;
        if (body) {
            results = title + '+' + body;
        } else {
            results = title;
        }
        return results;
    }

    // True turns the searching component on, false turns it off.
    function isLoading(bool) {
        if (bool) {
            $('#loadingIndicator').addClass('loading-indicator--active');
        } else {
            $('#loadingIndicator').removeClass('loading-indicator--active');
        }
    }

    //AJAX call to get images for the multiple selection. isLoading() Controls the searching indicator.
    function getImages() {
        // query parameters
        const keywords = _getSearchKeywords();
        isLoading(true);
        $.ajax({
            type: "GET",
            url: ApiUrl,
            headers: { "X-RapidAPI-Key": ApiKey }
        }).done(function (data) {
            imageResultsViewModel.imageSearchResults(data.value);
            isLoading(false);
        })
    }

//=========================================================================================
// Application initialization
//=========================================================================================
    
    // Initilizes the task pane by: 
    //1. enabling richTextarea
    //2. declaring event listeners for key-up events in the inpt boxes
    //3. apply knockout observables bindings
    Office.initialize = function (reason) {
        $(document).ready(function () {
            // Initialize the FabricUI notification mechanism and hide it
            var element = document.querySelector('.ms-MessageBanner');
            messageBanner = new fabric.MessageBanner(element);
            messageBanner.hideBanner();
            // enables the richTextarea div tat allows bol dtext in mock text-area
            enableRichTextArea();
            // Searches half a second after a change in one of the textboxs. resets timer
            // on keyup.
            let imageQueryTimer = null;
            $('#slideTitle').keyup(function() {
                clearTimeout(imageQueryTimer);
                imageQueryTimer = setTimeout(getImages, 500);
            });

            $('#slideBody').keyup(function () {
                clearTimeout(imageQueryTimer);
                imageQueryTimer = setTimeout(getImages, 500, event);
            });
        });
    };

    function enableRichTextArea() {
        $('.rich-textarea').each(function () {
            this.contentEditable = true;
        });
    }

    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notification-header").text(header);
        $("#notification-body").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }


    ko.applyBindings(imageResultsViewModel);
})();

//========================================================================
// Selecting images
//========================================================================

//  Toggles the hidden checkbox for a search item on click. Toggles the the "active" modifier on the search-result__img-container element
function imageSelect(e) {
    const el = e.currentTarget;
    const input = $('input', el);
    if (input.attr('checked') == true) {
        input.attr('checked', false);
    } else {
        input.attr('checked', true);
    };
    $('li', el).prevObject.toggleClass('search-results__img-container--active');
}

// limits image selection to four. 
function getSlideData() {
    let items = $('#searchResults');
    items = $('.search-results__img-container--active > img', items);
    let slideData = {
        title: null,
        body: null,
        images: []
    };
    slideData.title = $('#slideTitle')[0].value;
    slideData.body = $('#slideBody')[0].innerHTML;
    // get selected images and convert to base64
    for (let x = 0; x < items.length && x < 4; x++) {
        slideData.images.push(items[x].src);
    }
    return slideData;
}


//===========================================================
// slide data insert
//===========================================================

// Distrubutes tasks for populating a slide
function populateSlide() {
    const slideData = getSlideData();
    //insertTitle(slideData.title);
    //insertBody(slideData.body);
    console.log(slideData.images);
    insertImages(slideData.images)
}

function insertTitle(title) {
    Office.context.document.setSelectedDataAsync(title,
        function (asyncResult) {
            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                console.log(asyncResult.error.message);
            }
        });
}

function insertBody(body) {
    Office.context.document.setSelectedDataAsync(body,
        function (asyncResult) {
            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                console.log(asyncResult.error.message);
            };
        });
}

function insertImages(urlList) {
    const margin = 3;
    const imageWidth = 200;
    let imageOrigin = 50;
    let imageLeft = 50;
    let imageTop = 50;
    const images = getBase64Image(urlList);
    // insert each selected image
    for (let x = 0; x < urlList.length; x++) {
        //const image = images[x];
        imageLeft = margin + imageOrigin + imageWidth * x;
        
        /*Office.context.document.setSelectedDataAsync(image,
            {
        coercionType: Office.CoercionType.Image,
        imageLeft: imageLeft,
        imageTop: imageTop,
        imageWidth: imageWidth
        },
        function (asyncResult) {
            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
                console.log(asyncResult.error.message);
            }
        });*/
    } 
} 
// Retrieves base64 of image Urls using ImageConvertApi service.
function getBase64Image(imgs) {
    let images;
    $.ajax({
        crossDomain: true,
        type: "GET",
        url: "https://localhost:44386/api/values?urls="+imgs,
        dataType: "jsonp",
        success: function (data) {
            console.log('success', data);
            images = data;
            return images;
        },
        error: function (x) {
            console.log('fail', x);
        }
    });
};


