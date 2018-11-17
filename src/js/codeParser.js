export function createItemAccordingToType(element){
    return typeToHandlerMapping[element.type](element);
}

let typeToHandlerMapping = {
    'Program': programHandler,
    'FunctionDeclaration': functionDeclarationHandler,
    'BlockStatement': blockStatementHandler,
    'VariableDeclaration': variableDeclarationHandler,
    'ExpressionStatement': expressionStatementHandler,
    'WhileStatement': whileStatementHandler,
    'IfStatement': ifStatmentHandler,
    'ReturnStatement':returnStatmentHandler,
    'ForStatement': forStatmentHandler,
    'BinaryExpression': binaryExpressionHandler,
    'MemberExpression': memberExpressionHandler,
    'UnaryExpression': unaryExpressionHandler,
    'AssignmentExpression': assignmentExpressionHandler,
    'UpdateExpression': updateExpressionHandler,
    'Identifier':identifierHandler,
    'Literal': literalHandler
};

export function functionDeclarationHandler(element){
    let itemsToReturn = [];
    let item = {
        line: element.loc.start.line,
        type: 'function declaration',
        name: element.id.name,
        condition: '',
        value: ''
    };
    
    itemsToReturn.push(item);
    element.params.forEach(variable => {
        item = createVariableDeclarationForParams(variable);
        itemsToReturn.push(item);
    });

    let bodyElements = createItemAccordingToType(element.body);
    itemsToReturn = itemsToReturn.concat(bodyElements);
    return itemsToReturn;
}

function createVariableDeclarationForParams(variable){
    let item = {
        line: variable.loc.start.line,
        type: 'variable declaration',
        name: variable.name,
        condition: '',
        value: ''
    };
    return item;
}

export function variableDeclarationHandler(element){
    let itemsToReturn = [];
    element.declarations.forEach(declaration => {
        let value = 'null (or empty)';
        if(declaration.init != null )
            value = createItemAccordingToType(declaration.init);
        let item = {
            line: declaration.loc.start.line,
            type: 'variable declaration',
            name: declaration.id.name,
            condition: '',
            value: value
        };
        itemsToReturn.push(item);
    });
    return itemsToReturn;
}

export function expressionStatementHandler(element){
    if(element.expression.type === 'AssignmentExpression')
        return assignmentExpressionHandler(element.expression);
}

export function assignmentExpressionHandler(element){
    let item = {
        line: element.loc.start.line,
        type: 'assignment expression',
        name: element.left.name,
        condition: '',
        value: createItemAccordingToType(element.right)
    };
    return item;
}

export function memberExpressionHandler(element){
    let variable = element.object.name;
    let index = createItemAccordingToType(element.property);
    return variable + '[' + index + ']';
}

export function binaryExpressionHandler(element){
    let operator = element.operator;
    let right = createItemAccordingToType(element.right);
    let left = createItemAccordingToType(element.left);
    return left + operator + right;
}

export function whileStatementHandler(element){
    let conditionStatement = conditionStatementHandler(element.test);
    let itemsToReturn = [];
    let item = {
        line: element.loc.start.line,
        type: 'while statement',
        name: '',
        condition: conditionStatement.condition,
        value: conditionStatement.value
    };
    itemsToReturn.push(item);

    let bodyElements = createItemAccordingToType(element.body);
    itemsToReturn = itemsToReturn.concat(bodyElements);

    return itemsToReturn;
}

export function conditionStatementHandler(element){
    let condition, value;
    if(element.type == 'BinaryExpression'){
        condition = binaryExpressionHandler(element);
        value = '';
    }
    else if(element.type == 'UnaryExpression'){
        condition = unaryExpressionHandler(element);
        value = '';
    }
    else {
        condition = '';
        value = element.value;
    }

    return {condition: condition, 
        value: value};
}

export function unaryExpressionHandler(element){
    let operator = element.operator;
    let argument = createItemAccordingToType(element.argument);
    return operator + argument;
}

export function ifStatmentHandler(element, type = 'if statement'){
    let itemsToReturn = [];
    let conditionStatement = conditionStatementHandler(element.test);
    let item = {
        line: element.loc.start.line,
        type: type,
        name: '',
        condition: conditionStatement.condition,
        value: conditionStatement.value
    };
    itemsToReturn.push(item);
    let consequentElements = createItemAccordingToType(element.consequent);
    itemsToReturn = itemsToReturn.concat(consequentElements);
    if(element.alternate.type === 'IfStatement')
        itemsToReturn = itemsToReturn.concat(ifStatmentHandler(element.alternate, 'else if statement'));
    else
        itemsToReturn.push(returnStatmentHandler(element.alternate))   ;
    return itemsToReturn;
}

export function returnStatmentHandler(element){
    let item = {
        line: element.loc.start.line,
        type: 'return statement',
        name: '',
        condition: '',
        value: createItemAccordingToType(element.argument)
    };
    return item;
}

export function blockStatementHandler(element){
    let itemsToReturn = [];
    element.body.forEach(bodyElement => {
        itemsToReturn = itemsToReturn.concat(createItemAccordingToType(bodyElement));
    });
    return itemsToReturn;
}

export function forStatmentHandler(element){
    let itemsToReturn = [];
    let item = {
        line: element.loc.start.line,
        type: 'for statement',
        name: '',
        condition: conditionStatementHandler(element.test).condition,
        value: ''
    };
    itemsToReturn.push(item);
    itemsToReturn.push(createItemAccordingToType(element.init));
    itemsToReturn.push(createItemAccordingToType(element.update));
    let bodyElements = createItemAccordingToType(element.body);
    itemsToReturn = itemsToReturn.concat(bodyElements);
    return itemsToReturn;
}

export function updateExpressionHandler(element){
    let operator = element.operator;
    let argument = createItemAccordingToType(element.update);
    let item = {
        line: element.loc.start.line,
        type: 'update expression',
        name: '',
        condition: '',
        value: argument + operator
    };
    return item;
}

export function identifierHandler(element){
    return element.name;
}

export function literalHandler(element){
    return element.value;
}

export function programHandler(element){
    let itemsToReturn = [];
    element.body.forEach(bodyElement => {
        itemsToReturn = itemsToReturn.concat(createItemAccordingToType(bodyElement));
    });
    return itemsToReturn;
}