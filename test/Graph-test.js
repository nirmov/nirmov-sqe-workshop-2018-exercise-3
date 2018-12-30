import assert from 'assert';
import {symbole,parseArguments,initiateVariableMap} from '../src/js/symbolic';
import {parseCode} from '../src/js/code-analyzer';
import { parseNewCode} from '../src/js/Parser';
import {startGraph,getDraw,initiate,getObjectArray,getObjects,handleFunctionDeclaration,handleIfStatement,handleProgram,handleWhileStatement,handleLiteral,handleMemberExpression,handleVariableDeclaration,handleExpressionStatement,handleReturnStatement,handleUnaryExpression,handleIdentifier,handleBinaryExpression,handleLogicalExpression} from '../src/js/Graph';
describe('The javascript parser', () => {
    it('this is test to handle identidier function', () => {
        var input="c= a + 1 ;";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        var output = handleBinaryExpression(parsedCode.body[0].expression.right);
        assert.equal(output,'(a+1)');
    });
    it('this is test to handle binary expression function', () => {
        var input="function nir (x) {\n" +
            " let c=7;\n" +
            "}";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        var output = handleIdentifier(parsedCode.body[0].body.body[0].declarations[0].id);
        assert.equal(output,'c');
    });
    it('this is test to handle literal function', () => {
        var input="function nir (x) {\n" +
            " let c=7;\n" +
            "}";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        var output = handleLiteral(parsedCode.body[0].body.body[0].declarations[0].init);
        assert.equal(output,'7');
    });
    it('this is test to handle function', () => {
        var input="function nir (x) {\n" +
            " let c=7;\n" +
            "}";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        var curentNode={};
        curentNode.lines=[];
        handleFunctionDeclaration(parsedCode.body[0],curentNode,undefined,true);
        assert.equal(curentNode.lines.length,1);
        assert.equal(curentNode.lines[0],'c = 7');
    });
    it('this is test to handle UnaryExpression ', () => {
        var input="let x=-1;";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        var output = handleUnaryExpression(parsedCode.body[0].declarations[0].init);
        assert.equal(output,'-1');
    });
    it('this is test to Member Expression ', () => {
        var input="a[0]=8;";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        var output = handleMemberExpression(parsedCode.body[0].expression.left);
        assert.equal(output,'a[0]');
    });
    it('this is test to handle VariableDeclaration ', () => {
        var input="let x=-1;";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        var curentNode={};
        curentNode.lines=[];
        handleVariableDeclaration(parsedCode.body[0],curentNode,undefined,true);
        assert.equal(curentNode.lines.length,1);
        assert.equal(curentNode.lines[0],'x = -1');
    });
    it('this is test to handle ExpressionStatement ', () => {
        var input="let c;\n" +
            "c=0;";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        var curentNode={};
        curentNode.lines=[];
        handleExpressionStatement(parsedCode.body[1],curentNode,undefined,true);
        assert.equal(curentNode.lines.length,1);
        assert.equal(curentNode.lines[0],'c = 0');
    });
    it('this is test to handle return Statment ', () => {
        var input="function nir (){\n" +
            "let c=0;\n" +
            "  return c;\n" +
            "}";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        var curentNode={};
        curentNode.lines=[];
        handleReturnStatement(parsedCode.body[0].body.body[1],curentNode,undefined,true);
        assert.equal(curentNode.lines.length,0);
        assert.equal(curentNode.next.lines.length,1);
        assert.equal(curentNode.next.lines[0],'return c');
    });
    it('this is test to handle Logical Expression ', () => {
        var input="a = true && true ;";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        var output=handleLogicalExpression(parsedCode.body[0].expression.right);
        assert.equal(output,'(true&&true)');
    });
    it('this is test to handle hanleProgram ', () => {
        var input="let c;\n" +
            "c=0;";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        var curentNode={};
        curentNode.lines=[];
        handleProgram(parsedCode,curentNode,undefined,true);
        assert.equal(curentNode.lines.length,2);
        assert.equal(curentNode.lines[1],'c = 0');
    });
    it('this is test to handle if Statment ', () => {
        var input="if (1 == 1 )\n" +
            "  a=7;";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        initiate();
        var curentNode={};
        curentNode.lines=[];
        handleIfStatement(parsedCode.body[0],curentNode,undefined,true);
        assert.equal(curentNode.lines.length,0);
        assert.equal(curentNode.next.type,'meoyan');
        assert.equal(curentNode.next.true.lines.length,1);
    });

    it('this is test to handle else if Statment ', () => {
        var input="if (1 == 1 ){\n" +
            "  a=7;\n" +
            "  a=9;\n" +
            "}\n" +
            "else if ( 1==2 )\n" +
            "  a=9;";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        initiate();
        var curentNode={};
        curentNode.isTrue=true;
        curentNode.lines=[];
        handleIfStatement(parsedCode.body[0],curentNode,undefined,true);
        assert.equal(curentNode.lines.length,0);
        assert.equal(curentNode.next.type,'meoyan');
        assert.equal(curentNode.next.true.lines.length,2);
        assert.equal(curentNode.next.false.lines.length,1);
        assert.equal(curentNode.next.false.type,'meoyan');
        assert.equal(curentNode.next.false.isTrue,false);
        assert.equal(curentNode.next.true.isTrue,true);
        assert.equal(curentNode.next.isTrue,true);
        assert.equal(curentNode.isTrue,true);
        assert.equal(curentNode.next.false.true.next,curentNode.next.true.next);
    });
    it('this is test to handle else Statment ', () => {
        var input="if (1 == 1 ){\n" +
            "  a=7;\n" +
            "  a=9;\n" +
            "}\n" +
            "else( 1==2 )\n" +
            "  a=9;";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        initiate();
        var curentNode={};
        curentNode.lines=[];
        curentNode.isTrue=true;
        handleIfStatement(parsedCode.body[0],curentNode,undefined,true);
        assert.equal(curentNode.lines.length,0);
        assert.equal(curentNode.next.type,'meoyan');
        assert.equal(curentNode.next.true.lines.length,2);
        assert.equal(curentNode.next.false.lines.length,0);
        assert.equal(curentNode.next.false.type,'square');
        assert.equal(curentNode.next.false.isTrue,false);
        assert.equal(curentNode.next.true.isTrue,true);
        assert.equal(curentNode.next.isTrue,true);
        assert.equal(curentNode.isTrue,true);
        assert.equal(curentNode.next.false.next,curentNode.next.true.next);
    });
    it('this is test to handle while Statment ', () => {
        var input="while (1 == 1 ){\n" +
            "  a=7;\n" +
            "  a=9;\n" +
            "}";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        initiate();
        var curentNode={};
        curentNode.lines=[];
        handleWhileStatement(parsedCode.body[0],curentNode,undefined,true);
        assert.equal(curentNode.lines.length,0);
        assert.equal(curentNode.next.type,'meoyan');
        assert.equal(curentNode.next.true.lines.length,2);
        assert.equal(curentNode.next.false,undefined);
    });
    it('this is test to handle while Statment ', () => {
        var input="function nir (){\n" +
        "while (1 == 1 ){\n" +
        "  a=7;\n" +
        "  a=9;\n" +
        "}\n" +
        "d=9;\n" +
        "}";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        initiate();
        var curentNode={};
        curentNode.lines=[];
        curentNode=startGraph(parsedCode);
        assert.equal(curentNode.lines.length,0);
        assert.equal(curentNode.next.type,'meoyan');
        assert.equal(curentNode.next.true.lines.length,2);
        assert.equal(curentNode.next.false.lines.length,1);
    });
    it('this is test to handle else if else Statment ', () => {
        var input="function nir (){\n" +
            "if(1 == 2 ){\n" +
            "  a=7;\n" +
            "}\n" +
            "else if ( 2 == 3)\n" +
            "{\n" +
            "  a=10;\n" +
            "}\n" +
            "else \n" +
            "   d=9;\n" +
            "return 10\n" +
            "}";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        initiate();
        var curentNode={};
        curentNode.isTrue=true;
        curentNode.lines=[];
        curentNode = startGraph(parsedCode);
        assert.equal(curentNode.lines.length,0);
        assert.equal(curentNode.next.type,'meoyan');
        assert.equal(curentNode.next.true.lines.length,1);
        assert.equal(curentNode.next.false.lines.length,1);
        assert.equal(curentNode.next.false.type,'meoyan');
        assert.equal(curentNode.next.false.isTrue,true);
        assert.equal(curentNode.next.false.false.isTrue,true);
        assert.equal(curentNode.next.true.isTrue,false);
        assert.equal(curentNode.next.isTrue,true);
        assert.equal(curentNode.isTrue,true);
        assert.equal(curentNode.next.false.true.next,curentNode.next.true.next);
        assert.equal(curentNode.next.false.false.next,curentNode.next.true.next);
    });
    it('this is test to handle getObjects Statment ', () => {
        var input="function nir (){\n" +
            "if(1 == 2 ){\n" +
            "  a=7;\n" +
            "}\n" +
            "else if ( 2 == 3)\n" +
            "{\n" +
            "  a=10;\n" +
            "}\n" +
            "else \n" +
            "   d=9;\n" +
            "return 10\n" +
            "}";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        initiate();
        var curentNode={};
        curentNode.isTrue=true;
        curentNode.lines=[];
        handleProgram(parsedCode,curentNode,undefined,true);
        getObjects(curentNode);
        var objects=getObjectArray();
        assert.equal(objects.length,7);
    });
    it('this is test to handle add getStringToFlowChart\n ', () => {
        var input="function nir (){\n" +
            "if(1 == 2 ){\n" +
            "  a=7;\n" +
            "}\n" +
            "else if ( 2 == 3)\n" +
            "{\n" +
            "  a=10;\n" +
            "}\n" +
            "else \n" +
            "   d=9;\n" +
            "return 10\n" +
            "}";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=1");
        initiateVariableMap();
        symbole(input);
        initiate();
        var curentNode={};
        curentNode.isTrue=true;
        curentNode.lines=[];
        handleProgram(parsedCode,curentNode,undefined,true);
        getObjects(curentNode);
        var objects=getObjectArray();
        assert.equal(objects.length,7);
        var ans="op0=>operation: |green\n" +
            "op1=>condition: (1==2)\n" +
            "|green\n" +
            "op2=>start: continue |green\n" +
            "op3=>operation: a = 7\n" +
            "|white\n" +
            "op4=>condition: (2==3)\n" +
            "|green\n" +
            "op5=>operation: a = 10\n" +
            "|white\n" +
            "op6=>operation: d = 9\n" +
            "|green\n" +
            "op7=>operation: return 10\n" +
            "|green\n" +
            "op0->op1\n" +
            "op1(yes,right)->op3\n" +
            "op1(no)->op4\n" +
            "op2->op7\n" +
            "op3->op2\n" +
            "op4(yes,right)->op5\n" +
            "op4(no)->op6\n" +
            "op5->op2\n" +
            "op6->op2\n" ;
        assert.equal(getDraw(),ans);
    });
    it('this is test to handle add getStringToFlowChart\n ', () => {
            var input="function nir (x)\n" +
                "{\n" +
                "\n" +
                " if (x==1 )\n" +
                "  {\n" +
                "    let d=9; \n" +
                "    if (d == 8)\n" +
                "      d=7;\n" +
                "    else\n" +
                "      d=10;\n" +
                "    let f=1;\n" +
                "    d=8;\n" +
                "  }\n" +
                "  else\n" +
                "  {\n" +
                "   x=3;\n" +
                "  }\n" +
                "  return true;\n" +
                "}";
        var parsedCode=parseCode(input);
        initiateVariableMap();
        parseArguments("x=1");
        parseNewCode(parsedCode,1);
        symbole(input);
        initiate();
        var curentNode={};
        curentNode.isTrue=true;
        curentNode.lines=[];
        startGraph(parsedCode);
        getObjects(curentNode);
        var objects=getObjectArray();
        assert.equal(objects.length,11);
        var ans="op0=>operation: |green\n" +
            "op1=>condition: (x==1)\n" +
            "|green\n" +
            "op2=>start: continue |green\n" +
            "op3=>operation: d = 9\n" +
            "|green\n" +
            "op4=>condition: (d==8)\n" +
            "|green\n" +
            "op5=>start: continue |green\n" +
            "op6=>operation: d = 7\n" +
            "|white\n" +
            "op7=>operation: d = 10\n" +
            "|green\n" +
            "op8=>operation: f = 1\n" +
            "d = 8\n" +
            "|green\n" +
            "op9=>operation: x = 3\n" +
            "|white\n" +
            "op10=>operation: return true\n" +
            "|green\n" +
            "op0->op1\n" +
            "op1(yes)->op3\n" +
            "op1(no,right)->op9\n" +
            "op2->op10\n" +
            "op3->op4\n" +
            "op4(yes,right)->op6\n" +
            "op4(no)->op7\n" +
            "op4->op2\n" +
            "op5->op8\n" +
            "op6->op5\n" +
            "op7->op5\n" +
            "op8->op2\n" +
            "op9->op2\n";
        assert.equal(getDraw(),ans);
    });
});