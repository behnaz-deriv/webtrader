define(["exports"],function(a){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var b=function(){var a={forex:1,indices:2,commodities:3,volidx:4};return function(b){return b.sort(function(b,c){return a[b]-a[c]})}}(),c=function(a){return a.reduce(function(a,b){var c=b.market_display_name,d=b.submarket_display_name,e=b.display_name;return a[c]=a[c]||{},a[c][d]=a[c][d]||[],a[c][d].push(e),a},{})},d=function(a){var c=e(a),d=b(Object.keys(c));return d.map(function(a){return c[a].toString()})},e=function(a){return a.reduce(function(a,b){var c=b.market,d=b.market_display_name;return a[c]=a[c]||[],a[c].includes(d)===!1&&a[c].push(d),a},{})};a.getMarketsSubmarkets=c,a.getOrderedMarkets=d});