import { html, render } from './node_modules/lit-html/lit-html.js';

var tableModel = [[{ data: '' }]];
var generateButton = document.querySelector('#generate_button');
var greetingsSelector = 'greetings';
var tableSelector = 'table_container';
var resultSelector = 'result';

var tableTemplate = (rowTemplates) => html`
    <table class="table">
        ${rowTemplates}
    </table>
    <div class="buttons has-addons">
        <button id="add_row" @click=${addRowHandler} class="button is-success is-light">+</button>
        <button id="remove_row" @click=${removeRowHandler} class="button is-danger is-light">-</button>
    </div>
`;
var buttonTemplate = (id) => html`
    <td><div class="buttons has-addons">
        <button id=${id} @click=${addTdHandler} class="button is-success is-light">+</button>
        <button id=${id} @click=${removeTdHandler} class="button is-danger is-light">-</button>
    </div></td>
`;
var inputTemplate = (id, data) => html`
    <td><input id=${id} @change=${inputChangeHandler} type="text" value=${data.data} class="input"></td>
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

function getRowMaxLength(tableModel) {
    let maxLength = 0;
    for (let row of tableModel) {
        let rowLength = row.length;
        if (rowLength > maxLength) {
            maxLength = rowLength;
        }
    }
    return maxLength;
}

generateButton.addEventListener('click', function (event) {
    let maxRowLength = getRowMaxLength(tableModel);

    var generatedTable = `
<table>
    ${tableModel.map((rowData, keyRow) => `<tr>
    ${rowData.map((tdData, keyTd) => `
        ${keyTd === 0 
            ? `<th ${rowData.length === 1
                ? `colspan="${maxRowLength}"`
                : `style="text-align: left;"` 
            }>${tdData.data}</th>` 
            : `<td>${tdData.data}</td>`}
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

let heroTemplate = (data) => html`
  <section class="hero is-primary">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        ${data.title}
      </h1>
      <h2 class="subtitle">
        ${data.body}
      </h2>
    </div>
  </div>
</section>`;

const heroResult = heroTemplate({ title: 'Hello', body: 'This is simple <table> generator for bicycle attributes' });
render(heroResult, document.querySelector('#' + greetingsSelector));