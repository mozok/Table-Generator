import { html, render } from './node_modules/lit-html/lit-html.js';

var tableModel = [[{ data: '' }]];
var generateButton = document.querySelector('#generate_button');
var greetingsSelector = 'greetings';
var tableSelector = 'table_container';
var resultSelector = 'result';

var tableTemplate = (rowTemplates) => html`
    <table>
        ${rowTemplates}
    </table>
    <button id="add_row" @click=${addRowHandler}>+</button>
    <button id="remove_row" @click=${removeRowHandler}>-</button>
`;
var buttonTemplate = (id) => html`
    <td><button id=${id} @click=${addTdHandler}>+</button><button id=${id} @click=${removeTdHandler}>-</button></td>
`;
var inputTemplate = (id, data) => html`
    <td><input id=${id} @change=${inputChangeHandler} type="text" value=${data.data}></td>
`;
var rowTemplate = (tdElements, buttonTemplate) => html`
    <tr>${tdElements}${buttonTemplate}</tr>
`;

function generateTestTableModel() {
    return [
        [{ data: 'test1' }],
        [{ data: 'test2' }, { data: 'test3' }],
        [{ data: 'test4' }, { data: 'test5' }]
    ]
}

function addRowHandler(event) {
    tableModel.push([{ data: '' }]);
    drawTable(tableModel, tableSelector);
}
function removeRowHandler(event) {
    tableModel.pop();
    drawTable(tableModel, tableSelector);
}

function addTdHandler(event) {
    let [rowStr, id] = event.target.id.split('_');
    tableModel[id].push({ data: '' });
    drawTable(tableModel, tableSelector);
}

function removeTdHandler(event) {
    let [rowStr, id] = event.target.id.split('_');
    tableModel[id].pop();
    drawTable(tableModel, tableSelector);
}

function inputChangeHandler(event) {
    let [row, td] = event.target.id.split('_');
    tableModel[row][td].data = event.target.value;
    drawTable(tableModel, tableSelector);
}

function generateTableTemplate(tableModel) {
    const rowTemplates = []
    for (let [keyRow, rowData] of tableModel.entries()) {
        const tdElements = [];
        for (let [keyTd, tdData] of rowData.entries()) {
            tdElements.push(inputTemplate(keyRow + '_' + keyTd, tdData));
        }
        rowTemplates.push(rowTemplate(tdElements, buttonTemplate('row_' + keyRow)));
    }

    return tableTemplate(rowTemplates);
}

generateButton.addEventListener('click', function (event) {
    var generatedTable = `
<table>
    ${tableModel.map((rowData, keyRow) => `<tr>
    ${rowData.map((tdData, keyTd) => `
        ${keyTd === 0 ? `<th>${tdData.data}</th>` : `<td>${tdData.data}</td>`}
    `).join('')}
    </tr>`).join('\n')}
<table>
`;

    let textareaElement = document.querySelector('#' + resultSelector);
    textareaElement.value = generatedTable;
    textareaElement.style.height = 'auto';
    textareaElement.style.height = textareaElement.scrollHeight + 'px';
});

var drawTable = (tableModel, tableSelector) => {
    const resultTable = generateTableTemplate(tableModel);
    render(resultTable, document.querySelector('#' + tableSelector));
}
drawTable(tableModel, tableSelector);


let myTemplate = (data) => html`
  <h1>${data.title}</h1>
  <p>${data.body}</p>`;

const result = myTemplate({ title: 'Hello', body: 'This is simple <table> generator for bicycle attributes' });
render(result, document.querySelector('#' + greetingsSelector));