const buttonAddParagraph = '<div class="add-button" onclick="addParagraph(); showButtons(event.target.parentElement);">P</div>';
const buttonAddSection = '<div class="add-button" onclick="addSection(); showButtons(event.target.parentElement);">S</div>';
const buttonAddImage = '<div class="add-button" onclick="addImage(); showButtons(event.target.parentElement);">I</div>';
const buttonAddFormula = '<div class="add-button" onclick="addFormula(); showButtons(event.target.parentElement);">F</div>';
const buttonAddEnumeration = '<div class="add-button" onclick="addEnumeration(); showButtons(event.target.parentElement);">E</div>';
const buttonAddTable = '<div class="add-button" onclick="addTable(); showButtons(event.target.parentElement);">T</div>';
const buttonAddCodeSnippet = '<div class="add-button" onclick="addCodeSnippet(); showButtons(event.target.parentElement);">C</div>';
const buttonFromPaste = '<div class="add-button" onclick="fromPaste(); showButtons(event.target.parentElement);">B</div>';
const miniToolbar = '<div class="mini-toolbar"><button class="mini-toolbar-button" onclick="copyEditorElement();">🗐</button><button class="mini-toolbar-button" onclick="cutEditorElement();">✂</button><button class="mini-toolbar-button" onclick="deleteEditorElement();">🞫</button></div>'
const paragraph = '<div class="paragraph editor-element">' + miniToolbar + '<textarea class="paragraph-text" onblur="CacheWriter.paragraph(event.target.parentElement);dumpValue();"></textarea></div>';
const section = '<div class="section"><div class="heading editor-element"><div class="mini-toolbar"><button class="mini-toolbar-button" onclick="deleteEditorElement();">🞫</button></div><button class="roll-up" onclick="rollUp();">▼</button><textarea class="heading-text" onblur="dumpValue();CacheWriter.section(event.target.parentElement.parentElement);"></textarea></div><div class="content-container"><div class="v-line"></div><div class="section-content"><div class="insert" onclick="showButtons();" onmouseleave="hideButtons();"></div></div></div>';
const insert = '<div class="insert" onclick="showButtons();" onmouseleave="hideButtons();"></div>';
const codeSnippet = '<div class="code-snippet editor-element">' + miniToolbar + '<textarea placeholder="Название листинга" class="code-snippet-caption" onblur="dumpValue();CacheWriter.codeSnippet(event.target.parentElement);"></textarea><textarea placeholder="Паста javascript здесь" class="code-snippet-text" spellcheck=false onblur="dumpValue();CacheWriter.codeSnippet(event.target.parentElement);"></textarea></div>'
const enumerationElement = '<textarea class="enumeration-text" placeholder="- ..." onblur="CacheWriter.enumeration(event.target.parentElement);enumerationOnblur();dumpValue();"></textarea>'
const enumeration = '<div class="enumeration editor-element">' + miniToolbar + enumerationElement + '</div>'
const tableCell = '<textarea class="table-cell" onkeydown="tableCellKeyframeHandler();" onmousedown="tableCellOnMouseDown();" onblur="dumpValue();"></textarea>'
const image = '<div class="image editor-element">' + miniToolbar + '<img class="image-preview" onerror="onUncorrectImage();" onload="CacheWriter.image(event.target.parentElement);"></img><input class="image-load" type="file" accept="image/jpeg,image/jpg,image/png,.png,.jpg,.jpeg" onchange="onImageLoad();"><button class="image-remove" onclick="removeImage();CacheWriter.image(event.target.parentElement);">X</button><textarea placeholder="Название рисунка" class="image-caption-text" onblur="dumpValue();CacheWriter.image(event.target.parentElement);"></textarea></div>'
const table = 
`<div class="table editor-element">
    `+ miniToolbar + `
    <textarea class="table-caption" onblur="CacheWriter.table(event.target.parentElement);dumpValue();" placeholder="Название таблицы"></textarea>
    <button class="button-open-table-editor" onclick="openTableEditor();">Открыть редактор</button>
    <div class="table-editor" hidden>
        <div class="table-area">
            <div class="table-column" style="width: 40%;">
                <div class="table-column-tools">
                    <button class="button-delete-column" onclick="removeTableColumn();" title="Удалить столбец">x</button>
                    <button class="button-adjust-column" onclick="increaseTableColumn();" title="Расширить столбец">+</button>
                    <button class="button-adjust-column" onclick="decreaseTableColumn();" title="Сузить столбец">-</button>
                </div>` + 
                tableCell + 
                tableCell +`
            </div>
            <div class="table-column" style="width: 40%;">
                <div class="table-column-tools">
                    <button class="button-delete-column" onclick="removeTableColumn();">x</button>
                    <button class="button-adjust-column" onclick="increaseTableColumn();">+</button>
                    <button class="button-adjust-column" onclick="decreaseTableColumn();">-</button>
                </div> `
                + tableCell + 
                tableCell + `
            </div>
        </div>
        <div class="table-editor-hint">Добавить ячейки:<br><span class="keyframe">Аlt</span> + <span class="keyframe">→</span><span class="keyframe">←</span><span class="keyframe">↑</span><span class="keyframe">↓</span><br>Удалить строку:<br><span class="keyframe">Alt</span> + <span class="keyframe">Del</span></div>
        <button class="table-editor-apply" onclick="CacheWriter.table(event.target.parentElement.parentElement);escapeTableEditor();">Применить</button>
    </div>
</div>`
const formula = '<div class="formula editor-element">' + miniToolbar + '<textarea placeholder="Формула (LaTeX)" class="formula-text" onblur="renderFormulaPreview();dumpValue();"></textarea></div>'
//const oldTable = '<div class="table editor-element">' + miniToolbar + '<textarea class="table-caption"  onblur="dumpValue();"></textarea><button class="button-open-table-editor" onclick="openTablEditor();">Открыть редактор</button><div class="table-editor" hidden><div class="table-area" data-widths="50,50"><div class="table-row"><textarea class="table-cell" onmousedown="table_cell_onmousedown();"></textarea><textarea class="table-cell" onmousedown="table_cell_onmousedown();"></textarea></div><div class="table-row"><textarea class="table-cell" onmousedown="table_cell_onmousedown();"></textarea><textarea class="table-cell" onmousedown="table_cell_onmousedown();"></textarea></div></div><button class="table-editor-apply" onclick="escapeTableEditor();">Применить</button></div></div>'
