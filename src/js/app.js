import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let items = []
        parsedCode.body.forEach(element => {
            items = items.concat(createItemAccordingToType(element))
        })
        createTable(items)
        // $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});

function createTable(items){
    let row = "<tr>" +
            "<th> Line </th>" +
            "<th> Type </th>" +
            "<th> Name </th>" +
            "<th> Condition </th>" +
            "<th> Value </th>" +
            "</tr>"
    $('#itemsTable').append(row)             
    items.forEach(item => {
        let row = "<tr>" +
                "<td>" + item.line + "</td>" +
                "<td>" + item.type + "</td>" +
                "<td>" + item.name + "</td>" +
                "<td>" + item.condition + "</td>" +
                "<td>" + item.value + "</td>" +
                "</tr>"
        $('#itemsTable').append(row)             
    });   
}

function functionDeclarationHandler(element){
    let itemsToReturn = []
    let item = {
        line: element.loc.start.line,
        type: "function declaration",
        name: element.id.name,
        condition: "",
        value: ""
    }
    itemsToReturn.push(item)

    element.params.forEach(variable => {
        item = {
            line: variable.loc.start.line,
            type: "variable declaration",
            name: variable.name,
            condition: "",
            value: ""
        }
        itemsToReturn.push(item)
    })
    let bodyElements = createItemAccordingToType(element.body)
    itemsToReturn = itemsToReturn.concat(bodyElements)

    return itemsToReturn
}

function variableDeclarationHandler(element){
    let itemsToReturn = []
    element.declarations.forEach(declaration => {
        let item = {
            line: declaration.loc.start.line,
            type: "variable declaration",
            name: declaration.id.name,
            condition: "",
            value: declaration.init
        }
        itemsToReturn.push(item)
    })
    return itemsToReturn
}

function expressionStatementHandler(element){
    if(element.expression.type === "AssignmentExpression")
        return assignmentExpressionHandler(element.expression)
}

function assignmentExpressionHandler(element){
    let item = {
        line: element.loc.start.line,
        type: "assignment expression",
        name: element.left.name,
        condition: "",
        value: getExpressionValue(element.right)
    }
    return item
}

function memberExpressionHandler(element){
    let variable = element.object.name
    let index = getExpressionValue(element.property)
    return variable + "[" + index + "]"
}

function getExpressionValue(element){
    if(element.type === "Identifier")
        return element.name
    else if(element.type === "Literal")
        return element.value
    else if(element.type === "BinaryExpression")
        return binaryExpressionHandler(element)
    else if(element.type === "MemberExpression")
        return memberExpressionHandler(element)
    else if(element.type === "UnaryExpression")
        return unaryExpressionHandler(element)
}

function binaryExpressionHandler(element){
    let operator = element.operator
    let right = getExpressionValue(element.right)
    let left = getExpressionValue(element.left)
    return left + operator + right
}

function whileStatementHandler(element){
    let conditionStatement = conditionStatementHandler(element.test)
    let itemsToReturn = []
    let item = {
        line: element.loc.start.line,
        type: "while statement",
        name: "",
        condition: conditionStatement.condition,
        value: conditionStatement.value
    }
    itemsToReturn.push(item)

    let bodyElements = createItemAccordingToType(element.body)
    itemsToReturn = itemsToReturn.concat(bodyElements)

    return itemsToReturn
}

function conditionStatementHandler(element){
    let condition, value
    if(element.type == "BinaryExpression"){
        condition = binaryExpressionHandler(element)
        value = ""
    }
    else if(element.type == "UnaryExpression"){
        condition = unaryExpressionHandler(element)
        value = ""
    }
    else {
        condition = ""
        value = element.value
    }

    return {condition: condition, 
            value: value}
}

function unaryExpressionHandler(element){
    let operator = element.operator
    let argument = getExpressionValue(element.argument)
    return operator + argument
}

function ifStatmentHandler(element, type){
    let itemsToReturn = []
    let conditionStatement = conditionStatementHandler(element.test)
    let item = {
        line: element.loc.start.line,
        type: type,
        name: "",
        condition: conditionStatement.condition,
        value: conditionStatement.value
    }
    itemsToReturn.push(item)

    let consequentElements = createItemAccordingToType(element.consequent)
    itemsToReturn = itemsToReturn.concat(consequentElements)

    if(element.alternate.type === "IfStatement")
        itemsToReturn = itemsToReturn.concat(ifStatmentHandler(element.alternate, "else if statement"))
    else
        itemsToReturn.push(returnStatmentHandler(element.alternate))
    
    return itemsToReturn
}

function returnStatmentHandler(element){
    let item = {
        line: element.loc.start.line,
        type: "return statement",
        name: "",
        condition: "",
        value: getExpressionValue(element.argument)
    }
    return item
}

function blockStatementHandler(element){
    let itemsToReturn = []
    element.body.forEach(bodyElement => {
        itemsToReturn = itemsToReturn.concat(createItemAccordingToType(bodyElement))
    })
    return itemsToReturn
}

function createItemAccordingToType(element){
    let itemsToReturn = []
    if(element.type === "FunctionDeclaration")
        itemsToReturn = functionDeclarationHandler(element)
    else if(element.type === "BlockStatement")
        itemsToReturn = blockStatementHandler(element)
    else if(element.type === "VariableDeclaration")
        itemsToReturn = variableDeclarationHandler(element)
    else if(element.type === "ExpressionStatement")
        itemsToReturn = expressionStatementHandler(element)
    else if(element.type === "WhileStatement")
        itemsToReturn = whileStatementHandler(element)   
    else if(element.type === "IfStatement")
        itemsToReturn = ifStatmentHandler(element, "if statement")
    else if(element.type === "ReturnStatement")
        itemsToReturn = returnStatmentHandler(element)
    return itemsToReturn    
}








