import { html, render } from 'lit-html';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faMinus, faArrowDown, faColumns, faFireAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faHandSpock, faCopyright } from '@fortawesome/free-regular-svg-icons'
import { faTelegram, faGithub, faNpm, faFontAwesomeFlag } from '@fortawesome/free-brands-svg-icons'

library.add(faPlus, faMinus, faArrowDown, faColumns, faFireAlt, faTimes, faHandSpock, faCopyright, faTelegram, faGithub, faNpm, faFontAwesomeFlag);
dom.i2svg();
dom.watch();

require('./mystyles.scss');

var tableModel = [[{ data: '' }]];
var generateButton = document.querySelector('#generate_button');
var previewButton = document.querySelector('#preview_button');
var closeModalButton = document.querySelector('#close_modal');
var greetingsSelector = 'greetings';
var tableSelector = 'table_container';
var resultSelector = 'result';

/* initial table generation templates */

var tableTemplate = (rowTemplates) => html`
    <table class="table">
        <tbody>
            ${rowTemplates}
        </tbody>
    </table>
    <div class="buttons has-addons">
        <button id="add_row" @click=${addRowHandler} class="button is-success is-light">+</button>
        <button id="remove_row" @click=${removeRowHandler} class="button is-danger is-light">-</button>
    </div>
`;
var buttonTemplate = (id) => html`
    <div class="buttons has-addons">
        <button id=${id} @click=${addTdHandler} class="button is-success is-light">${faPlusTemplate}</button>
        <button id=${id} @click=${removeTdHandler} class="button is-danger is-light">${faMinusTemplate}</button>
        <button id="${id}" @click=${removeMiddleRowHandler} class="button is-danger">${faTimesTemplate}</button>
    </div>
`;
var inputTemplate = (id, data) => html`
    <td><input id=${id} @change=${inputChangeHandler} type="text" value=${data.data} class="input"></td>
`;
var rowTemplate = (tdElements, buttonTemplate) => html`
    <tr>${tdElements}<td>${buttonTemplate}</td></tr>
`;

/* table generation as columns templates */

var columnsTemplate = (tableModel) => html`
    ${tableModel.map((rowData, keyRow) => html`
        <div class="columns is-mobile">
            ${rowData.map((elemData, elemKey) => html`
                <div class="column ${rowData.length === 1 ? "is-two-thirds": ""}">
                    <input id=${keyRow + '_' + elemKey} @change=${inputChangeHandler} type="text" .value=${elemData.data} class="input">
                </div>
            `)}<div class="column">${buttonTemplate('row_' + keyRow)}</div>
        </div>
    `)}
    
    <div class="buttons has-addons">
        <button id="add_row" @click=${addRowHandler} class="button is-success is-light">
            ${faPlusTemplate}
        </button>
        <button id="remove_row" @click=${removeRowHandler} class="button is-danger is-light">
            ${faMinusTemplate}
        </button>
    </div>
`;

let faPlusTemplate = html`
    <span class="icon">
        <i class="fas fa-plus"></i>
    </span>
`;

let faMinusTemplate = html`
    <span class="icon">
        <i class="fas fa-minus"></i>
    </span>
`;

let faTimesTemplate = html`
    <span class="icon">
        <i class="fas fa-times"></i>
    </span>
`;

// just for testing purpose
function generateTestTableModel() {
    return [
        [{ data: 'test1' }],
        [{ data: 'test2' }, { data: 'test3' }],
        [{ data: 'test4' }, { data: 'test5' }]
    ]
}

/* event hendlers for table generation */

function addRowHandler(event) {
    tableModel.push([{ data: '' }]);
    drawTable(tableModel, tableSelector);
}

function removeRowHandler(event) {
    tableModel.pop();
    drawTable(tableModel, tableSelector);
}

function removeMiddleRowHandler(event) {
    let [rowStr, id] = event.target.id.split('_');
    tableModel.splice(id, 1);
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

/**
 * Generate template for tableModel
 * @param {array} tableModel 
 */
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

/**
 * Generate result table string, fill textarea and modal body
 */
generateButton.addEventListener('click', function (event) {
    let maxRowLength = getRowMaxLength(tableModel);

    var generatedTable = `
<table>
<tbody>
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
</tbody>
</table>
`;

    let textareaElement = document.querySelector('#' + resultSelector);
    textareaElement.value = generatedTable;
    textareaElement.style.height = 'auto';
    textareaElement.style.height = textareaElement.scrollHeight + 'px';

    document.querySelector('#preview_body').innerHTML = generatedTable;
});

/* Modal actions */
previewButton.addEventListener('click', function (event) {
    document.querySelector('.modal').classList.add('is-active');
});

closeModalButton.addEventListener('click', function (event) {
    document.querySelector('.modal').classList.remove('is-active');
});

/**
 * Generate and draw table constructor from table model
 * @param {array} tableModel 
 * @param {string} tableSelector 
 */
var drawTable = (tableModel, tableSelector) => {
    // const resultTable = generateTableTemplate(tableModel);
    const resultTable = columnsTemplate(tableModel);
    render(resultTable, document.querySelector('#' + tableSelector));
}
drawTable(tableModel, tableSelector);

/* Draw Hero */
let heroTemplate = (data) => html`
  <section class="hero is-primary">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        ${data.title}
        <span class="icon"><i class="far fa-hand-spock"></i></span>  
      </h1>
      <h2 class="subtitle">
        ${data.body}
      </h2>
    </div>
  </div>
</section>`;

const heroResult = heroTemplate({ title: 'Hello', body: 'This is simple <table> generator for bicycle attributes' });
render(heroResult, document.querySelector('#' + greetingsSelector));