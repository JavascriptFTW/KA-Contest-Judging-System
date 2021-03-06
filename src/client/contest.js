var CJS = require("../backend/contest_judging_sys.js");
var helpers = require("../helpers/helpers.js");

let urlParams = helpers.general.getUrlParams(window.location.href);

var numEntriesToLoad = 32;

var contestId = null;

if (urlParams.hasOwnProperty("contest")) {
    contestId = urlParams.contest;
} else {
    alert("Please specify a Contest ID!");
    window.history.back();
}

if (urlParams.hasOwnProperty("count")) {
    numEntriesToLoad = parseInt(urlParams.count, 10);
}

var createEntry = function(entry) {
    return $("<div>").attr("id", entry.id)
        .append(
            $("<a>").attr("href", `entry.html?contest=${contestId}&entry=${entry.id}`)
                .append(
                    $("<img>").attr("src", "https://www.khanacademy.org/" + entry.thumb)
                        .addClass("img-responsive entry-img")
                )
                .append(
                    $("<p>").text(entry.name).addClass("entry-title center-align")
                )
                .addClass("col s12 m3 l3 center-align contest-entry")
        );
};

var setupPage = function() {
    CJS.loadXContestEntries(contestId, function(response) {
        console.log(response);
        let numEntries = 0;
        let $entriesRow = $("<div>").addClass("row");
        $("#entries").append($entriesRow);

        for (let entryId in response) {
            numEntries += 1;
            let thisEntry = response[entryId];

            $entriesRow
                .append(createEntry(thisEntry));

            if (numEntries % 4 === 0) {
                $entriesRow = $("<div>").addClass("row");
                $("#entries").append($entriesRow);
            }
        }
    }, numEntriesToLoad, true);

    CJS.fetchContest(contestId, (data) => {
        $(".contest-name").text(`Entries for ${data.name}`);
    }, ["name"]);
};

$(document).ready(function() {
    helpers.authentication.setupPageAuth("#authBtn", CJS);
    setupPage();
});

$("#next-unjudged").on("click", (evt) => {
    evt.preventDefault();

    CJS.fetchContestEntries(urlParams.contest, function(nextEntry) {
        if (nextEntry[0] !== undefined) {
            window.location.href = `entry.html?contest=${urlParams.contest}&entry=${nextEntry[0]}`;
        } else {
            alert("We couldn't find an un-judged entry, sorry!");
        }
    }, 1, false);
})