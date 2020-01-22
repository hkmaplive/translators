{
	"translatorID": "3dfd4f2d-6b08-4e78-9917-7eda8de63845",
	"label": "SCMP",
	"creator": "HKmap.live",
	"target": "^https?://(www)?\\.scmp\\.com/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2020-01-20 00:00:00"
}

/*
	***** BEGIN LICENSE BLOCK *****
	
	Copyright © 2020 HKmap.live
	
	This file is part of Zotero.
	
	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.
	
	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.
	
	***** END LICENSE BLOCK *****
*/

function detectWeb(doc, url) {
	if (url.includes('/article/')) {
		return "newspaperArticle";
	}
	return false;
}

function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		throw 'multiple not implemented'
	}
	else {
		scrape(doc, url);
	}
}

function scrape(doc, url) {
	var translator = Zotero.loadTranslator('web');
	var type = detectWeb(doc, url);
	// Embedded Metadata
	translator.setTranslator('951c027d-74ac-47d4-a107-9c3069ab7b48');
	translator.setHandler('itemDone', function (obj, item) {
		item.ISSN = "1021-6731";
		item.language = "en-US";
		if (type == "newspaperArticle") {
			item.publicationTitle = "South China Morning Post";
		}
		var jsonld = ZU.xpathText(doc, '//script[@type="application/ld+json" and @data-vue-meta="true"][2]');
		if (jsonld) {
			var data = JSON.parse(jsonld);
			if (data.author) {
				data.author = JSON.parse(data.author);
				if(data.author.length){
					item.creators = [];
					for (var i = 0; i < data.author.length; i++) {
						item.creators.push(ZU.cleanAuthor(data.author[i]['name'], "author"));
					}
				}else{
					item.creators.push(ZU.cleanAuthor(data.author['name'], "author"));
				}
			}
		}
		var jsonld = ZU.xpathText(doc, '//script[@type="application/ld+json" and @data-vue-meta="true"][3]');
		if (jsonld) {
			var data = JSON.parse(jsonld);
			if (data.itemListElement) {
				if(data.itemListElement.length){
					item.section = data.itemListElement[0]['item']['name'];
					for (var i = 1; i < data.itemListElement.length; i++) {
						item.section += "/"+data.itemListElement[i]['item']['name'];
					}
				}else{
					item.section = data.itemListElement['item']['name'];
				}
			}
		}
		item.complete();
	});
	
	translator.getTranslatorObject(function (trans) {
		trans.itemType = type;
		trans.doWeb(doc, url);
	});
}


/** BEGIN TEST CASES **/
var testCases = [
	
]
/** END TEST CASES **/
