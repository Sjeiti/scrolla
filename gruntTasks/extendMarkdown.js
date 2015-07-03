/*global module,require*/
module.exports = function (grunt) {
	'use strict';

	grunt.registerMultiTask('extendMarkdown','',function () {
		var fs = require('fs')
			//
			,data = this.data
			,sSrc = data.src||'jsdoc/main.md'
			,sDst = data.dest||'README.md'
			,sJSON = data.json||'temp/tinysort.json'
			//
			,sFileSrc = fs.readFileSync(sSrc).toString()
			,sFileDst = fs.readFileSync(sDst).toString()
			,aJSON = JSON.parse(fs.readFileSync(sJSON).toString())
			//
			,targets = sFileSrc.match(/\{\{\w+\}\}/g)
			//s
			,aSrcSplit = splitHeading(sFileSrc)
			,aDstSplit = splitHeading(sFileDst)
			//
			,sUsage = getContents('usage',aSrcSplit)
			//
			//
			,sNewFile
		;
		setContents('usage',aDstSplit,sUsage);
		sNewFile = makeContents(aDstSplit);
		//sNewFile = sFileSrc;

		targets&&targets.forEach(function(target){
			var targetName = target.match(/\w+/).pop()
				,targetExists = aJSON.hasOwnProperty(targetName);
			console.log('markdown target','\''+targetName+'\'',targetExists?'exists':'not found'); // log
			if (aJSON.hasOwnProperty(targetName)) {
				var targetList = aJSON[targetName]
					,sOptions = '';
				for (var i=1,l=targetList.length;i<l;i++) {
					var option = targetList[i]
						,name = option[0]
						,type = option[1]
						//,ptnl = option[2]
						,dflt = option[3]
						,desc = option[4]
					;
					sOptions += '**'+name+'** ('+type+(dflt!==''&&dflt!=='null'?'='+dflt:'')+')\n'+desc+'\n\n';
				}
				sNewFile = sNewFile.replace(target,sOptions);
			}
		});

		fs.writeFileSync(sDst,sNewFile);
	});

	function splitHeading(contents){
		var aSplit = contents.split(/[^#]#{2}[^#]/g)
			,aReturn = [];
		if (aSplit) {
			for (var i=0,l=aSplit.length;i<l;i++) {
				var sBlock = aSplit[i]
					,aLines = sBlock.split(/\r\n|\n\r|\n|\r/g)
					,sTitle = i>0?aLines.shift():'start'
				;
				aReturn.push({
					name: sTitle
					,contents: aLines.join('\n')
				});
			}
		}
		return aReturn;
	}
	function getContents(name,from){
		for (var i=0,l=from.length;i<l;i++) {
			var o = from[i];
			if (o.name===name) return o.contents;
		}
	}
	function setContents(name,from,contents){
		for (var i=0,l=from.length;i<l;i++) {
			var o = from[i];
			if (o.name===name) o.contents = contents;
		}
	}
	function makeContents(from){
		var aContents = [];
		for (var i=0,l=from.length;i<l;i++) {
			var o = from[i];
			if (i>0) aContents.push('## '+o.name);
			aContents.push(o.contents);
		}
		return aContents.join('\n');
	}
};