{
	"translatorID": "b5f8d616-bdd1-4aa9-896d-2854b76b2933",
	"label": "Stand News",
	"creator": "HKmap.live",
	"target": "^https?://.*?\\.thestandnews\\.com/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "csibv",
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
	return "newspaperArticle";

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

		item.language = "zh-HK";
		if (type == "newspaperArticle") {
			item.publicationTitle = "立場新聞";
		}
		
		item.title = ZU.xpathText(doc, "//h1[@class='article-name']")
		
		var jsonld = ZU.xpathText(doc, '//script[@type="application/ld+json"][1]');
		if (jsonld) {
			var data = JSON.parse(jsonld);
			if (data.datePublished){
				item.date=data.datePublished
			}
			if (data.author) {
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
		item.complete();
	});
	
	translator.getTranslatorObject(function (trans) {
		trans.itemType = type;
		trans.addCustomFields({
		});
		trans.doWeb(doc, url);
	});
}


/** BEGIN TEST CASES **/
var testCases = [
	
]
/** END TEST CASES **/
