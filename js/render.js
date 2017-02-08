var Store = window.Store || {};

// load storage content
(function () {
    // event to get raised after all json content loaded
    var StoreLoaded = new CustomEvent("StoreLoaded");

    var numOfMapsToLoad = 0; // this is total number of map files to load
    var numOfloadedMaps = 0; // this is total number of map files actually loaded

    // // get json configuration file
    $.getJSON("lib/config.json", function (config) {
        // merge loaded configuration with store
        $.extend(Store, config);

        for (packageId = 0; packageId < Store.Packages.length; ++packageId) {
            var package = Store.Packages[packageId];

            numOfMapsToLoad += package.IconMaps.length;
            package.MapData = []; // array to store map data

            // iterate over icon maps to load them
            for (mapId = 0; mapId < package.IconMaps.length; ++mapId) {
                var iconMap = package.IconMaps[mapId];

                // get icon map file
                // use closure to save current package for callback updates
                $.getJSON("lib/" + package.Location + iconMap, (function () {
                    var curPackage = package;
                    return function (mapData) {
                        ++numOfloadedMaps;
                        curPackage.MapData.push(mapData);

                        // if all packages loaded and all map files loaded raise event
                        if (numOfloadedMaps >= Store.Packages.length && numOfMapsToLoad == numOfloadedMaps)
                            document.dispatchEvent(StoreLoaded);
                    };
                })());
            }
        }

        //load required css files
        Store.CommonCss.forEach(
            function (cssFile) {
                $('head').append('<link rel="stylesheet" type="text/css" href="lib/common/css/' + cssFile + '" />');
            });

        // load package content
        Store.Packages.forEach(
            function (package) {
                package.Css.forEach(
                    function (cssFile) {
                        $('head').append('<link rel="stylesheet" type="text/css" href="lib/' + package.Location + cssFile + '" />');
                    });
            });
    });
})();

// render store content
$(document).on("StoreLoaded", function () {
    var header = $('.tabHeader');
    var details = $('.tabDetails');

    $(header).append('<a class="flex-sm-fill text-sm-center nav-link active" href="#tab1" role="tab" data-toggle="tab">' + Store.Packages[0].Name + '</a>');
    $(details).append('<div class="tab-pane active" id="tab1"><ul class="icon-constainer"></ul></div>');

    // render tabs
    for (tabId = 1; tabId < Store.Packages.length; ++tabId) {
        var package = Store.Packages[tabId];

        $(header).append('<a class="flex-sm-fill text-sm-center nav-link" href="#tab' + (tabId + 1) + '" role="tab" data-toggle="tab">' + package.Name + '</a>');
        $(details).append('<div class="tab-pane" id="tab' + (tabId + 1) + '"><ul class="icon-constainer"></ul></div>');
    }

    // render icons
    for (tabId = 0; tabId < Store.Packages.length; ++tabId) {
        var package = Store.Packages[tabId];
        var tab = $('#tab' + (tabId + 1) + " .icon-constainer");

        for (mapId = 0; mapId < package.MapData.length; ++mapId) {
            var map = Store.Packages[tabId].MapData[mapId];

            for (iconId = 0; iconId < map.Icons.length; ++iconId) {
                $(tab).append('<li data-tags="' + map.Icons[iconId].Title.replace('_', ' ').replace('-', ' ') + '"><span class="icon ' + map.Prefix + ' ' + map.Icons[iconId].Css + '"></span><br /><span>' + (map.Prefix == '' ? '' : map.Prefix + ' ') + map.Icons[iconId].Css + '</span></li>');
            }
        }
    }

    var packageContainerTemplate = '<div class="card"><div class="card-header" role="tab" id="headingOne"><h5 class="mb-0"><a data-toggle="collapse" data-parent="#packages" href="#package{{id}}">{{title}}</a></h5></div><div id="package{{id}}" class="collapse" role="tabpanel">{{content}}<div class="card-block"></div></div></div>'

    var packageDetailsTemplate = '<div class="container"><div class="row">Name: {{Name}}</div><div class="row">Version: {{Version}}</div><div class="row"><span>URL: </span><a href="{{URL}}" target="_blank">{{URL}}</a></div></div>';

    var divPackage = $("#packages");

    //write loaded packages to html
    for (tabId = 0; tabId < Store.Packages.length; ++tabId) {
        var package = Store.Packages[tabId];
        var content = packageDetailsTemplate.replace("{{Name}}", package.Name).replace("{{Version}}", package.Version).replace(/{{URL}}/gi, package.URL);

         $(divPackage).append(packageContainerTemplate.replace("{{title}}", package.Name).replace(/{{id}}/gi, tabId + 1).replace("{{content}}", content));
    }
});

// search for icon
Store.search = function () {
    var value = $('#txtSearch').val().trim();

    if (value == '') {
        $('li.hide').removeClass('hide');
        $('nav a').removeClass('hide').first().tab('show');
        return;
    }

    arr = value.split(' ');

    var searchValue = 'li[data-tags*="' + arr[0] + '"]';

    for(termId = 1; termId < arr.length; ++termId)
        searchValue += ',li[data-tags*="' + arr[termId] + '"]';

    $(searchValue).removeClass('hide');
    $('li[data-tags]').not(searchValue).addClass('hide');

    $('nav a').each(function () {
        var self = $(this);
        var tabId = self.attr('href');
        var childLi = $(tabId).find('ul li:not([class*="hide"])');

        self.removeClass('active');
        
        if (childLi.length <= 0)
            self.addClass('hide');
        else
            self.removeClass('hide');
    });

    $('nav a:not([class*="hide"])').first().tab('show');
};
