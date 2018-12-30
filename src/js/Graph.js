import {getMapColors} from './symbolic';
export {startGraph,handleLiteral,getObjectArray,getObjects,handleWhileStatement,handleIfStatement,getDraw,initiate,handleLogicalExpression,handleMemberExpression,handleFunctionDeclaration,handleProgram,handleExpressionStatement,handleVariableDeclaration,handleReturnStatement,handleIdentifier,handleBinaryExpression,handleUnaryExpression};
let line=1;
var next;
var index=0;
var objects={};
var toDraw;
var Whilenode;
var dictinoaryFunction =
    {
        'FunctionDeclaration' : handleFunctionDeclaration,
        'VariableDeclarator'  : handleVariableDeclarator,
        'BlockStatement' : handleBlockStatement,
        'ExpressionStatement' : handleExpressionStatement ,
        'AssignmentExpression' : handleAssignmentExpression,
        'WhileStatement' : handleWhileStatement ,
        'BinaryExpression' : handleBinaryExpression ,
        'Identifier' : handleIdentifier ,
        'Literal' : handleLiteral ,
        'ElseIfStatment' : handleElseIfStatment ,
        'ReturnStatement' : handleReturnStatement ,
        'UnaryExpression' : handleUnaryExpression ,
        'IfStatement' : handleIfStatement ,
        'VariableDeclaration' : handleVariableDeclaration ,
        'LogicalExpression' : handleLogicalExpression ,
        'Program' : handleProgram ,
        'MemberExpression' : handleMemberExpression
    };
function getObjectArray()
{
    return objects;
}
function initiate()
{
    objects=[];
    index=0;
    next=undefined;
    Whilenode=undefined;
    indexColor=0;
    colorArray= getMapColors();
}
function startGraph(exprimaCode)
{
    initiate();
    var nodeTrue=initateNode([],'square',undefined,true);
    parseNewCode(exprimaCode,nodeTrue,undefined,true,1);
    getObjects(nodeTrue);
    toDraw=getStringToFlowChart();
    return nodeTrue;
}
function getDraw()
{
    return toDraw;
}

function getStringToFlowChart()
{
    var oprands='';
    for (let i=0;i<objects.length;i++)
    {
        var node=objects[i];
        if (node == undefined)
            continue;
        var color=getColorNode(node);
        if (node.type=='square')
            oprands+= 'op'+node.index+'=>operation: '+getLinesContent(node.lines)+'|'+color+'\n';
        else if (node.type=='meoyan')
            oprands+= 'op'+node.index+'=>condition: '+getLinesContent(node.lines)+'|'+color+'\n';
        else
            oprands+= 'op'+node.index+'=>start: continue |'+color+'\n';
    }
    return addKshatot(oprands);

}
function getLinesContent(lines)
{
    var ans='';
    for (let i=0;i<lines.length;i++)
        ans+=lines[i]+'\n';
    return ans;
}
function addKshatot2(node,nodeName,oprands,type)
{
    if (node!=undefined) {
        var nodeTrue='op'+node.index;
        if (node.isTrue)
            oprands+=nodeName+'('+type+')->'+nodeTrue+'\n';
        else
            oprands+=nodeName+'('+type+',right)->'+nodeTrue+'\n';
    }
    return oprands;
}
function addKshatot(oprands)
{
    for (let i=0;i<objects.length;i++) {
        var node=objects[i];
        if (node==undefined)
            continue;
        var nodeName='op'+node.index;
        if (node.type=='meoyan') {
            oprands=addKshatot2(node.true,nodeName,oprands,'yes');
            oprands=addKshatot2(node.false,nodeName,oprands,'no');
        }
        if (node.next!=undefined) {
            var nodeNext = 'op' + node.next.index;
            oprands+=nodeName+'->'+nodeNext+'\n';
        }
    }
    return oprands;
}
function getColorNode(node)
{
    if (node.isTrue==true)
        return 'green';
    else
        return 'white';
}
function getObjects(node)
{

    if (node!=undefined)
    {
        if (objects[node.index]==undefined) {
            node.next=checkEmptyLine(node.next);
            node.false=checkEmptyLine(node.false);
            node.true=checkEmptyLine(node.true);
            objects[node.index]=node;
            getObjects(node.next);
            getObjects(node.true);
            getObjects(node.false);
        }
    }
}
function checkEmptyLine(node)
{
    if (node!=undefined &&node.lines!=undefined && node.lines.length==0 && node.type!='circle')
        node=node.next;
    return node;
}
function parseNewCode(parsedCode,curentNode,NextNode,isTrue,lineIn) {
    if (lineIn!=undefined)
        line=lineIn;
    if (parsedCode != null && parsedCode.type != null) {
        return dictinoaryFunction[parsedCode.type](parsedCode,curentNode,NextNode,isTrue,lineIn);
    }
    else
        return null;
}
function handleProgram(parsedCode,curentNode,NextNode,isTrue) {
    let toReturn = [];
    var i;
    for (i = 0; i < parsedCode.body.length; i++) {
        Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.body[i],curentNode,NextNode,isTrue));
    }
    let to=[];
    to[0]=toReturn;
    return to;
}
function handleLogicalExpression(parsedCode)
{
    var left = parseNewCode(parsedCode.left);
    var right = parseNewCode(parsedCode.right);
    return '('+ left+ parsedCode.operator + right+')';
}
function handleFunctionDeclaration(parsedCode,curentNode,NextNode,isTrue) {
    let toReturn = [];
    toReturn[0] = {};
    addToObj(toReturn[0], line, 'function declaration', parseNewCode(parsedCode.id,curentNode,NextNode,isTrue), '', '');
    var i;
    for (i = 0; i < parsedCode.params.length; i++) {
        toReturn[i + 1] = {};
        //addToObj(toReturn[i + 1], line, 'variable declaration', parseNewCode(parsedCode.params[i],curentNode,NextNode,isTrue), '', '');
    }
    line += 1;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.body,curentNode,NextNode,isTrue));
    return toReturn;
}

function handleVariableDeclaration(parsedCode,curentNode,NextNode,isTrue) {
    var toReturn = [];
    var i;
    for (i = 0; i < parsedCode.declarations.length; i++) {
        toReturn[i] = {};
        var objReturned = parseNewCode(parsedCode.declarations[i],curentNode,NextNode,isTrue);
        var node=curentNode;
        if (curentNode.lines== undefined)
        {
            node = getNodeAfterAssigment(curentNode,NextNode);
        }
        node.lines.push(objReturned.name+' = ' + objReturned.value);
        node.isTrue=isTrue;
        addToObj(toReturn[i], line, 'variable declaration', objReturned.name, objReturned.condition, objReturned.value);
    }
    line += 1;
    return toReturn;
}

function handleVariableDeclarator(parsedCode) {
    var obj = {};
    obj.name = parseNewCode(parsedCode.id);
    obj.condition = '';
    obj.value = parseNewCode(parsedCode.init);
    return obj;
}
function initNodeWhile(next)
{
    var newNode={};
    newNode.lines=[];
    newNode.type='square';
    newNode.isTrue=true;
    newNode.index=index;
    newNode.next=next;
    index++;
    return newNode;
}
function handleBlockStatement(parsedCode,curentNode,NextNode,isTrue) {
    var toReturn = [];
    var i;
    for (i = 0; i < parsedCode.body.length; i++) {
        var mid = parseNewCode(parsedCode.body[i],curentNode,NextNode,isTrue);
        if (next!=undefined) {
            curentNode=next;
            next=undefined;
        }
        if (Whilenode!=undefined) {
            curentNode=Whilenode;
            var newNode=initNodeWhile(curentNode.next);
            curentNode.false=newNode;
            curentNode=newNode;
            Whilenode=undefined;
        }
        Array.prototype.push.apply(toReturn, mid);
    }
    return toReturn;
}

function handleExpressionStatement(parsedCode,curentNode,NextNode,isTrue) {

    var toReturn = [];
    toReturn[0] = parseNewCode(parsedCode.expression,curentNode,NextNode,isTrue);
    line += 1;
    return toReturn;
}


function handleAssignmentExpression(parsedCode,curentNode,NextNode,isTrue) {
    var obj = {};
    var left =parseNewCode(parsedCode.left);
    var right =parseNewCode(parsedCode.right);
    addToObj(obj, line, 'assignment expression', left, '', right);
    var node=curentNode;
    if (curentNode.lines== undefined)
    {
        node=getNodeAfterAssigment(curentNode,NextNode);
    }
    node.lines.push(left+' = ' + right);
    node.isTrue=isTrue;
    return obj;
}
function getNodeAfterAssigment(curentNode,NextNode)
{
    var node=curentNode;
    if (!(curentNode.next!=undefined && curentNode.next.lines!=undefined&&curentNode.next.type!='meoyan')) {
        node = {};
        node.index = index;
        index++;
        node.type = 'square';
        node.lines = [];
        curentNode.next = node;
        node.next = NextNode;
    }
    else
        node=curentNode.next;
    return node;
}
function handleWhileStatement(parsedCode,curentNode,NextNode,isTrue) {
    var toReturn = [];
    toReturn[0] = {};
    var test= parseNewCode(parsedCode.test,curentNode,NextNode,isTrue);
    addToObj(toReturn[0], line, 'while statment', '', test, '');
    line++;
    var newNode=initateNode([],'meoyan',NextNode,isTrue);
    newNode.lines.push('while '+test);
    curentNode.next=newNode;
    NextNode=newNode;
    var trueNode=initateNode([],'square',NextNode,isTrue);
    newNode.true=trueNode;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.body,trueNode,NextNode,isTrue));
    Whilenode=newNode;
    return toReturn;
}
function initateNode(lines,type,next,isTrue)
{
    var newNode={};
    newNode.lines=lines;
    newNode.type=type;
    newNode.next=next;
    newNode.index=index;
    newNode.isTrue=isTrue;
    index++;
    return newNode;
}
function handleBinaryExpression(parsedCode) {
    var left = parseNewCode(parsedCode.left);
    var right = parseNewCode(parsedCode.right);
    return '('+ left+ parsedCode.operator + right+')';
}

function handleIdentifier(parsedCode) {
    return parsedCode.name;
}

function handleLiteral(parsedCode) {
    return parsedCode.value;
}

function handleElseIfStatment(parsedCode,curentNode,NextNode,isTrue) {
    var toReturn = [];
    toReturn[0] = {};
    var condition=parseNewCode(parsedCode.test,curentNode,NextNode,isTrue);
    addToObj(toReturn[0], line, 'else if statment', '', condition, '');
    curentNode.isTrue=isTrue;
    curentNode.lines.push(condition);
    curentNode.type='meoyan';
    var trueIf=getIsTrue();
    var nodeTrue=initateNode([],'square',NextNode,curentNode.isTrue);
    curentNode.true=nodeTrue;
    line++;
    var trueBefore=trueIf;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.consequent,nodeTrue,NextNode,trueIf));
    handleAlternate(parsedCode,NextNode,trueIf,toReturn,isTrue,curentNode,trueBefore);
    return toReturn;
}

function handleAlternate(parsedCode,nextNode,trueIf,toReturn,isTrue,newNode,trueBefore)
{
    if (parsedCode.alternate != null) {
        var nodeFalse=initateNode([],undefined,undefined,undefined);
        trueBefore=trueIf;
        if (!(parsedCode.alternate.type == 'ElseIfStatment')){
            nodeFalse.type='square';
            nodeFalse.next=nextNode;
            trueIf=getIsTrue();
            nodeFalse.isTrue=trueIf;
        }
        else
            trueIf=isTrue&&!trueBefore;
        newNode.false=nodeFalse;
        Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.alternate,nodeFalse,nextNode,trueIf));
    }
    else {
        newNode.false=nextNode;
    }
}

function handleIfStatement(parsedCode,curentNode,NextNode,isTrue, type) {
    var toReturn = [];
    toReturn[0] = {};
    var condition=parseNewCode(parsedCode.test,curentNode,NextNode,isTrue);
    addToObj(toReturn[0], line, type, '', condition, '');
    var trueIf=getIsTrue();
    var newNode=initateNode([],'meoyan',NextNode,isTrue);
    newNode.lines.push(condition);
    var nextNode=initateNode(undefined,'circle',NextNode,isTrue);
    curentNode.next=newNode;
    var nodeTrue=initateNode([],'square',nextNode,curentNode.isTrue);
    newNode.true=nodeTrue;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.consequent,nodeTrue,nextNode,trueIf));
    handleAlternate(parsedCode,nextNode,trueIf,toReturn,isTrue,newNode);
    next=nextNode;
    return toReturn;
}
var colorArray;
var indexColor=0;
function getIsTrue()
{
    var to=colorArray[indexColor];
    indexColor++;
    return to;
}
function handleReturnStatement(parsedCode,curentNode,NextNode,isTrue) {
    var toReturn = [];
    toReturn[0] = {};
    var newNode={};
    newNode.lines=[];
    newNode.index=index;
    index++;
    var argument=parseNewCode(parsedCode.argument);
    addToObj(toReturn[0], line, 'return statment', '', '',argument);
    newNode.lines.push('return '+ argument);
    newNode.isTrue=isTrue;
    newNode.type='square';
    curentNode.next=newNode;
    //curentNode=newNode;
    line++;
    return toReturn;
}

function handleUnaryExpression(parsedCode) {
    var toReturn = parseNewCode(parsedCode.argument);
    var to = parsedCode.operator + toReturn;
    return to;
}

function handleMemberExpression(parsedCode) {
    return parseNewCode(parsedCode.object) + '[' + parseNewCode(parsedCode.property) + ']';
}

function addToObj(obj, line, type, name, condition, value) {
    obj.line = line;
    obj.type = type;
    obj.name = name;
    obj.condition = condition;
    obj.value = value;
}