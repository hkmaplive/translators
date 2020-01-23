{
	"translatorID": "0ecfd261-ac35-4a21-bbc3-bdd25b5ef8dc",
	"label": "Ming Pao",
	"creator": "HKmap.live",
	"target": "^https?://.*?\\.mingpao\\.com/",
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
		item.OCLC = "60609352";
		item.language = "zh-HK";
		if (type == "newspaperArticle") {
			item.publicationTitle = "明報";
		}
		
		var title = item.title.split(' - ')
		item.title = title[0]
		if(title.length>1){
			item.date = (new Date(title[1].substr(0,4), title[1].substr(4,2), title[1].substr(6,2), 8)).toISOString()
		}
		if(title.length>2){
			item.section = title[2]
		}
		
		item.creators = [];
		var munIdx = item.title.indexOf('（文：')
		if(munIdx>=0){
			var endIdx = item.title.indexOf('）', munIdx)
			var author = item.title.substr(munIdx+3,endIdx-munIdx-3)
		}else{
			var munIdx = item.title.indexOf('／文：')
			if(munIdx>=0){
				var endIdx = item.title.indexOf('）', munIdx)
				var author = item.title.substr(munIdx+3)
			}else{
				var colIdx = item.title.indexOf('：')
				if(colIdx<5){
					var author = item.title.substr(0,colIdx)
				}
			}
		}
		if(author){
			item.creators.push({"firstName": author.substr(1), 
								"lastName": author.substr(0,1), 
								"creatorType":"author"});
		}
		
		if(item.tags[0]) item.tags = item.tags[0].split(',')
				
		item.complete();
	});
	
	translator.getTranslatorObject(function (trans) {
		trans.itemType = type;
		trans.addCustomFields({
			"keyword": "tags"
		});
		trans.doWeb(doc, url);
	});
}


/** BEGIN TEST CASES **/
var testCases = [
	
]
/** END TEST CASES **/
