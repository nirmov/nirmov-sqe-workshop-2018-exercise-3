import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parseNewCode} from './Parser';
import {startGraph,getDraw} from './Graph';
import {symbole,getMapColors,parseArguments,initiateVariableMap} from './symbolic';
import * as flowchart from 'flowchart.js';
var table = document.getElementById('Result');
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        ClearTable();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        initiateVariableMap();
        parseNewCode(parsedCode,1);
        parseArguments(document.getElementById('arguments').value);
        var final=symbole(codeToParse);
        document.getElementById('functionAfter').innerHTML = '';
        printNewFunc(final);
        startGraph(parsedCode);
        document.getElementById('diagram').innerHTML = '';
        drawGraph(getDraw());
    });
});
function printNewFunc(final)
{
    var mapColors=getMapColors();
    var indexIf=0;
    for (let i=0;i<final.length;i++)
    {
        var line=final[i];
        var color=getBackgroundColor(line,indexIf,mapColors);
        if (color!='white') {
            indexIf++;
        }
        $('#functionAfter').append(
            $('<div>' + line + '</div>').addClass(color)
        );
    }
}

function getBackgroundColor(line,indexIf,mapColors)
{
    if (line.includes('if')||line.includes('else'))
    {
        var color=mapColors[indexIf];
        if (color==true)
            return 'green';
        return 'red';
    }
    return 'white';
}
function ClearTable()
{
    var Rows = table.getElementsByTagName('tr');
    var Count = Rows.length;

    for(var i=Count-1; i>0; i--) {
        table.deleteRow(i);
    }
}
function drawGraph(operands)
{
    var diagram = flowchart.parse(operands);
    diagram.drawSVG('diagram', {
        'x': 0, 'y': 0,
        'line-width': 3, 'line-length': 50, 'text-margin': 10, 'font-size': 14, 'font-color': 'black', 'line-color': 'black',
        'element-color': 'black', 'fill': 'white', 'yes-text': 'T', 'no-text': 'F', 'arrow-end': 'block', 'scale': 1,
        'symbols': {
            'start': {
                'font-color': 'black', 'element-color': 'green', 'fill': 'yellow' ,'start-text': '',
            },
            'end':{
                'class': 'end-element'
            }
        },
        'flowstate' : {
            'green' : { 'fill' : 'green'}, 'white': {'fill' : 'red'}
        }
    });
}