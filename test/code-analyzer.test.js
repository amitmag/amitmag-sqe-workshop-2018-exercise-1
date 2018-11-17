import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {functionDeclarationHandler} from '../src/js/codeParser';
import * as parser from '../src/js/codeParser';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}}},"init":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}'
        );
    });
});

// describe('The function declaration handler', () => {
//     it('is parsing an empty function1 correctly', () => {
//         assert.equal(
//             functionDeclarationHandler(JSON.parse('{ "type": "FunctionDeclaration", "id": { "type": "Identifier", "name": "func", "loc": { "start": { "line": 1, "column": 9 }, "end": { "line": 1, "column": 13 } } }, "params": [], "body": { "type": "BlockStatement", "body": [], "loc": { "start": { "line": 1, "column": 15 }, "end": { "line": 2, "column": 1 } } }, "generator": false, "expression": false, "async": false, "loc": { "start": { "line": 1, "column": 0 }, "end": { "line": 2, "column": 1 } } } ], "sourceType": "script", "loc": { "start": { "line": 1, "column": 0 }, "end": { "line": 2, "column": 1 } }')),
//             '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
//         );
//     });
// });


