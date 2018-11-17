import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {createItemAccordingToType} from './codeParser.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let items = parseToItems(codeToParse);
        createTable(items);
    });
});

export function parseToItems(codeToParse){
    let parsedCode = parseCode(codeToParse);
    let items = [];
    parsedCode.body.forEach(element => {
        items = items.concat(createItemAccordingToType(element));
    });
    return items;
}

function createTable(items){
    let row = '<tr>' +
            '<th> Line </th>' +
            '<th> Type </th>' +
            '<th> Name </th>' +
            '<th> Condition </th>' +
            '<th> Value </th>' +
            '</tr>';
    $('#itemsTable').append(row) ;            
    items.forEach(item => {
        let row = '<tr>' +
                '<td>' + item.line + '</td>' +
                '<td>' + item.type + '</td>' +
                '<td>' + item.name + '</td>' +
                '<td>' + item.condition + '</td>' +
                '<td>' + item.value + '</td>' +
                '</tr>';
        $('#itemsTable').append(row);           
    });   
}












