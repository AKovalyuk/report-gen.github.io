// shows buttons, to select type of new element
function showButtons(evt){
    // get event variable
    if(evt == undefined)
        evt = event.target;
    // prevent triggering on empty space
    if(!evt.matches('.insert'))
        return;
    let sections = 0, editorElements = 0, newHTML = '';
    // checking out context
    for(let el of evt.parentElement.children){
        if(el.matches('.section'))
            sections += 1;
    }
    let textOnly = document.getElementById('conclusion').contains(evt) || document.getElementById('introduction').contains(evt);
    editorElements = (evt.parentElement.children.length - 1) / 2 - sections;
    if(sections == 0){
        // TODO text only elements
        newHTML += (!textOnly ? buttonAddTable + buttonAddCodeSnippet + buttonAddFormula + 
        buttonAddImage : '') + buttonAddParagraph + buttonAddEnumeration;
        if(clipboard != null && !textOnly)
            newHTML += buttonFromPaste;
    }
    if(editorElements == 0){
        // checking out nesting level
        let sectionLevel = 0, el = evt;
        while(el.nodeName != 'BODY'){
            if(el.matches('.section'))
                sectionLevel += 1;
            el = el.parentElement;
        }
        if(sectionLevel < 4 && !evt.matches('.insert-nosections'))
            newHTML = buttonAddSection + newHTML;
    }
    evt.innerHTML = newHTML;
}

//hides buttons
function hideButtons(){
    // prevent triggering on empty space
    if(event.target.matches('.insert'))
        // erase all buttons from inner HTML
        event.target.innerHTML = '';
}

// functions, that appends new element (add<type>)
function addParagraph(){
    let insertPanel = event.target.parentElement;
    insertPanel.insertAdjacentHTML('afterend', insert);
    insertPanel.insertAdjacentHTML('afterend', paragraph);
}

function addCodeSnippet(){
    let insertPanel = event.target.parentElement;
    insertPanel.insertAdjacentHTML('afterend', insert);
    insertPanel.insertAdjacentHTML('afterend', codeSnippet);
}

function addEnumeration(){
    let insertPanel = event.target.parentElement;
    insertPanel.insertAdjacentHTML('afterend', insert);
    insertPanel.insertAdjacentHTML('afterend', enumeration);
}

function addImage(){
    let insertPanel = event.target.parentElement;
    insertPanel.insertAdjacentHTML('afterend', insert);
    insertPanel.insertAdjacentHTML('afterend', image);
}

function addTable(){
    let insertPanel = event.target.parentElement;
    insertPanel.insertAdjacentHTML('afterend', insert);
    insertPanel.insertAdjacentHTML('afterend', table);
}

function addFormula(){
    let insertPanel = event.target.parentElement;
    insertPanel.insertAdjacentHTML('afterend', insert);
    insertPanel.insertAdjacentHTML('afterend', formula);
}

// placeholder for appropriate nesting level
const placeholders = [
    "Название раздела",
    "Название подраздела",
    "Название пункта",
    "Название подпункта"
]

function addSection(){
    let insertPanel = event.target.parentElement;
    let element = event.target, sectionLevel = 0;
    // check nesting leven
    while(element.nodeName != 'BODY'){
        if(element.matches('.section'))
            sectionLevel += 1;
        element = element.parentElement;
    }
    insertPanel.insertAdjacentHTML('afterend', insert);
    insertPanel.insertAdjacentHTML('afterend', section);
    // set placeholder for textarea appropirate nesting level
    event.target.parentElement.nextSibling.getElementsByClassName('heading-text')[0].placeholder = placeholders[sectionLevel];
}

// insert element from inner clipboard
function fromPaste(){
    let insertPanel = event.target.parentElement;
    insertPanel.insertAdjacentHTML('afterend', insert);
    insertPanel.insertAdjacentHTML('afterend', clipboard);
    loadValue(event.target.parentElement.nextSibling);
}

// function for dropdown, make selected structure element visible, hide others
function changeStructureElement(name){
    for(let structureElement of document.getElementsByClassName('structure-element')){
        if(structureElement.id != name)
            structureElement.hidden = true;
        else
            structureElement.hidden = false;
    }
}

// function, that adds new textarea into enumeration (on blured)
function enumerationOnblur(){
    let children = event.target.parentElement.children;
    if(children[children.length - 1].value != '')
        event.target.parentElement.insertAdjacentHTML("beforeend", enumerationElement);
    for(let i = 1; i < children.length - 1; i++){
        if(children[i].value == ''){
            children[i].remove();
            break;
        }
    }
}

// on load new image file
function onImageLoad(){
    let input = event.target;
    // check MIME type of file
    const mimes = ["image/jpeg", "image/jpg", "image/png", ".jpg", ".jpeg", ".png"];
    if(mimes.indexOf(input.files[0].type) == -1)
        input.value = '';
    // read file, and create preview
    let reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    reader.onload = function(){
        input.parentElement.children[1].src = reader.result;
    }
}

// if file is uncorrect image
function onUncorrectImage(){
    event.target.src = "";
    event.target.parentElement.children[2].value = "";
}

function removeImage(){
    event.target.parentElement.children[1].src = '';
}

// function allows roll up section content
function rollUp(){
    let contentContainer = event.target.parentElement.parentElement.children[1];
    if(contentContainer.style.display == 'none'){
        contentContainer.style.display = 'flex';
        event.target.textContent = "▼";
    }
    else{
        contentContainer.style.display = 'none';
        event.target.textContent = "◆";
    }
}

// save textarea value into data-* attribute
function dumpValue(){
    event.target.setAttribute('data-value', event.target.value);
}

// load into all children textarea's value from special data attribute
function loadValue(element){
    for(let textarea of element.getElementsByTagName('textarea')){
        let value = textarea.getAttribute('data-value');
        if(value != null)
            textarea.value = value;
    }
}

// inner clipboard for element
let clipboard = null;

// copy element into clipboard
function copyEditorElement(){
    let target = event.target, depth=2;
    if(event.target.parentElement.parentElement.matches('.heading')) depth = 3;
    while(depth){
        target = target.parentElement;
        depth--;
    }
    clipboard = target.outerHTML;
}

// copy element into clipboard & remove
function cutEditorElement(){
    let target = event.target, depth=2;
    if(event.target.parentElement.parentElement.matches('.heading')) depth = 3;
    while(depth){
        target = target.parentElement;
        depth--;
    }
    clipboard = target.outerHTML;
    target.nextSibling.remove();
    target.remove();
}

// remove element
function deleteEditorElement(){
    let target = event.target, depth=2;
    if(event.target.parentElement.parentElement.matches('.heading')) depth = 3;
    while(depth){
        target = target.parentElement;
        depth--;
    }
    target.nextSibling.remove();
    target.remove();
}

function openTableEditor(){
    event.target.parentElement.children[3].hidden = false;
}

function removeTableColumn(){
    let targetColumn = event.target.parentElement.parentElement;
    if(targetColumn.parentElement.children.length != 1)
        targetColumn.remove();
}

// decrease table column width
function decreaseTableColumn(){
    let targetColumn = event.target.parentElement.parentElement;
    let width = Number.parseInt(targetColumn.style.width.substr(0, targetColumn.style.width.length - 1));
    if(width != 10)
        targetColumn.style.width = (width - 10) + '%';
}

// increase table column width
function increaseTableColumn(){
    let targetColumn = event.target.parentElement.parentElement, sum = 0;
    for(let column of targetColumn.parentElement.children){
        let width = Number.parseInt(column.style.width.substr(0, column.style.width.length - 1));
        sum += width;
    }
    if(sum < 100){
        targetColumn.style.width = (Number.parseInt(targetColumn.style.width.substr(0, targetColumn.style.width.length - 1)) + 10) + '%';
    }
}

// handle keyframe in table cell
function tableCellKeyframeHandler(){
    let target = event.target, targetColumn = event.target.parentElement;
    // Alt + Arrow*
    if(event.altKey && /Arrow*/.test(event.code)){
        event.preventDefault();
        if(event.code[5] == 'L' || event.code[5] == 'R'){
            let sum = 0;
            for(let column of targetColumn.parentElement.children){
                let width = Number.parseInt(column.style.width.substr(0, column.style.width.length - 1));
                sum += width;
            }
            if(sum < 100){
                let newColumn = targetColumn.cloneNode(true);
                newColumn.style.width = '10%';
                if(event.code[5] == 'L')
                    targetColumn.parentElement.insertBefore(newColumn, targetColumn);
                else
                    targetColumn.parentElement.insertBefore(newColumn, targetColumn.nextSibling);
            }
            
            return;
        }
        else{
            let pos = -1, i = 0;
            for(let c of targetColumn.children){
                if(c == target){
                    pos = i;
                    break;
                }
                i++;
            }
            if(event.code[5] == 'U'){
                for(let column of targetColumn.parentElement.children){
                    column.children[pos].insertAdjacentHTML('beforebegin', tableCell)
                }
            }
            else{
                for(let column of targetColumn.parentElement.children){
                    column.children[pos].insertAdjacentHTML('afterend', tableCell)
                }
            }
            return;
        }
    }
    // Alt + Delete
    if(event.altKey && event.code == 'Delete')
    {
        event.preventDefault();
        if(targetColumn.children.length < 4)
            return;
        let pos = -1, i = 0;
        for(let c of targetColumn.children){
            if(c == target){
                pos = i;
                break;
            }
            i++;
        }
        for(let column of targetColumn.parentElement.children){
            column.children[pos].remove();
        }
        return;
    }
}

const svgScaleFactor = 4;

// render latex formula
function renderFormulaPreview(){
    let time = performance.now();
    let math = event.target.value;
    if(!event.target.previousSibling.matches('.mini-toolbar'))
        event.target.parentElement.children[1].remove();
    if(math == ''){
        event.target.parentElement.cache = null;
        upd();
        return;
    }
    let node = MathJax.tex2svg(math);
    event.target.parentElement.insertBefore(node, event.target);
    let svg = node.children[0];
    let svgData = new XMLSerializer().serializeToString(svg);
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.setAttribute('width', svg.width.baseVal.value * svgScaleFactor);
    canvas.setAttribute('height', svg.height.baseVal.value * svgScaleFactor);
    let img = document.createElement('img');
    img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData))));
    img.onload = function(){
        context.drawImage(img, 0, 0, svg.width.baseVal.value * svgScaleFactor, svg.height.baseVal.value * svgScaleFactor);
        png = '<img class="formula-png" onload="CacheWriter.formula(event.target.parentElement);" src="' + canvas.toDataURL( "image/png" ) + '"></img>';
        node.insertAdjacentHTML('afterend', png);
        node.remove();
        console.log('Rendered formula:', performance.now() - time, 'ms');
        upd();
    }
}

function escapeTableEditor(){
    event.target.parentElement.hidden = true;
}

// Resize observer for textarea (table cell)
let observer = new ResizeObserver(onResizeTableCell);
// state variable to prevent first activation of resize observer
let blocked = 1;
// reference for current observable object
let observable = null;

// on resize table cell handler
function onResizeTableCell(entry){
    if(blocked){
        blocked = 0;
        return;
    }
    blocked = 1;
    let pos = 0, i = 0;
    for(let child of entry[0].target.parentElement.children){
        if(child == entry[0].target){
            pos = i;
            break;
        }
        i++;
    }
    for(let column of entry[0].target.parentElement.parentElement.children)
        column.children[pos].style.height = entry[0].borderBoxSize[0].blockSize + 'px';
    blocked = 0;
}

// register observer for textarea
function tableCellOnMouseDown(){
    observer.observe(event.target);
    observable = event.target;
    document.addEventListener('mouseup', tableCellOnMouseUp);
}

// unregister observer for textarea
function tableCellOnMouseUp(){
    observer.unobserve(observable);
    let pos = 0, i = 0;
    for(let cell of observable.parentElement.children){
        if(cell == observable){ 
            pos = i;
            break;
        }
        i++;
    }
    for(let column of observable.parentElement.parentElement.children)
        column.children[pos].style.height = observable.style.height;
    document.removeEventListener('mouseup', tableCellOnMouseUp);
    observable = null;
    blocked = 1;
}

// this class contains static functions that creates cache for editor elements
class CacheWriter{
    static paragraph(editorElement){
        editorElement.cache = {
            text: line_divide('\t' + editorElement.getElementsByTagName('textarea')[0].value, TimesNewRoman, 14, 481000),
        }
        console.log(editorElement.cache);
    }

    static codeSnippet(editorElement){
        let caption = editorElement.getElementsByClassName('code-snippet-caption')[0];
        let code = editorElement.getElementsByClassName('code-snippet-text')[0];
        editorElement.cache = {
            caption: line_divide('Листинг 0000 – ' + caption.value, TimesNewRoman, 14, 481000),
            code: code.value.split(/[\n\r]+/),
        }
        console.log(editorElement.cache);
    }

    static enumeration(editorElement){
        let textareas = [...editorElement.getElementsByClassName('enumeration-text')];
        textareas = textareas.filter(textarea => textarea.value != '');
        if(textareas.length < 1){
            editorElement.cache = null;
            return;
        }
        for(let i = 0; i < textareas.length - 1; i++)
            textareas[i] = line_divide('\t- ' + textareas[i].value + ';', TimesNewRoman, 14, 481000);
        textareas[textareas.length - 1] = line_divide('\t- ' + textareas[textareas.length - 1].value + '.', TimesNewRoman, 14, 481000);
        editorElement.cache = {
            text: textareas,
        }
        console.log(editorElement.cache);
    }

    static image(editorElement){
        let img = editorElement.getElementsByClassName('image-preview')[0];
        if(img.src == '' || img.src[0] == 'f' || img.src[0] == 'h'){
            editorElement.cache = null;
            return;
        }
        let caption = editorElement.getElementsByClassName('image-caption-text')[0].value;
        editorElement.cache = {
            src: img.src,
            caption: line_divide('Рисунок 0000 – ' + caption, TimesNewRoman, 14, 481000),
            width: img.naturalWidth,
            height: img.naturalHeight,
        }
        console.log(editorElement.cache);
    }

    static table(editorElement){
        let area = editorElement.getElementsByClassName('table-area')[0], rows = [], widths = [];
        for(let i = 0; i < area.children[0].children.length - 1; i++){
            rows.push([]);
        }
        for(let j =0; j < area.children.length; j++){
            let percentage = Number.parseInt(area.children[j].style.width);
            let width = percentage * 17 / 10;
            widths.push(width);
            width = convert_millimeters(width);
            for(let i = 1; i < area.children[j].children.length; i++){
                rows[i - 1][j] = line_divide(area.children[j].children[i].value, TimesNewRoman, 12, width);
            }
        }
        let caption = editorElement.getElementsByClassName('table-caption')[0];
        editorElement.cache = {
            rows: rows,
            caption: line_divide('Таблица 0000 – ' + caption.value, TimesNewRoman, 14, 481000),
            widths: widths,
        }
        console.log(editorElement.cache);
    }

    static section(editorElement){
        let textarea = editorElement.getElementsByClassName('heading-text')[0];
        editorElement.cache = {
            text: line_divide('\t00.00.00.00 '+ textarea.value, TimesNewRomanBold, 14, 481000),
        }
        console.log(editorElement.cache);
    }

    static formula(editorElement){
        let math = editorElement.getElementsByClassName('formula-text')[0].value;
        let png = editorElement.getElementsByClassName('formula-png')[0];
        if(png == undefined){
            editorElement.cache = null;
            return;
        }
        editorElement.cache = {
            png: png.src, 
            math: math,
            width: png.naturalWidth,
            height: png.naturalHeight,
        }
        console.log(editorElement.cache);
    }

    static abbrList(editorElement){
        let textareas = [...editorElement.getElementsByClassName('enumeration-text')];
        textareas = textareas.filter(textarea => textarea.value != '');
        if(textareas.length < 1){
            editorElement.cache = null;
            return;
        }
        textareas = textareas.sort(function(a, b){
            if(a.value > b.value)
                return 1
            if(a.value < b.value)
                return -1
            return 0;
        });
        for(let i = 0; i < textareas.length; i++)
            textareas[i] = line_divide('\t' + textareas[i].value, TimesNewRoman, 14, 481000);
        editorElement.cache = {
            text: textareas,
        }
        console.log(editorElement.cache);
    }
}

// collect data from other container (main part in editor for example)
function collectFromContainer(container){
    let elements = [];
    for(let element of container.children){
        if(element.matches('.insert'))
            continue;
        if(element.matches('.section')){
            if(element.cache === undefined)
                CacheWriter.section(element);
            elements.push(Object.assign(element.cache, {type: 'section', node: element, elements: collectFromContainer(element.children[1].children[1])}));
            continue;
        }
        if(element.matches('.enumeration')){
            if(element.cache === undefined)
                CacheWriter.enumeration(element);
            if(element.cache === null)
                continue;
            elements.push(Object.assign(element.cache, {type: 'enumeration', node: element}));
            continue;
        }
        if(element.matches('.paragraph')){
            if(element.cache === undefined)
                CacheWriter.paragraph(element);
            elements.push(Object.assign(element.cache, {type: 'paragraph', node: element}));
            continue;
        }
        if(element.matches('.code-snippet')){
            if(element.cache === undefined)
                CacheWriter.codeSnippet(element);
            elements.push(Object.assign(element.cache, {type: 'snippet', node: element}));
            continue;
        }
        if(element.matches('.image')){
            if(element.cache === undefined)
                CacheWriter.image(element);
            if(element.cache === null)
                continue;
            elements.push(Object.assign(element.cache, {type: 'image', node: element}));
            continue;
        }
        if(element.matches('.formula')){
            if(element.cache === undefined)
                CacheWriter.formula(element);
            if(element.cache === null)
                continue;
            elements.push(Object.assign(element.cache, {type: 'formula', node: element}));
            continue;
        }
        if(element.matches('.table')){
            if(element.cache === undefined)
                CacheWriter.table(element);
            elements.push(Object.assign(element.cache, {type: 'table', node: element}));
            continue;
        }
    }
    return elements;
}

function collect(){
    // collect title data
    let title = document.getElementById('title');
    let titleType = title.children[0].children[0].selectedOptions[0].getAttribute('name');
    let common = {};
    for(let child of title.children[1].children){
        common[child.getAttribute('name')] = child.value;
    }
    let special = {}, selected = document.getElementById('title-types-container').querySelector(`[name="${titleType}"]`);
    for(let child of selected.children){
        special[child.getAttribute('name')] = child.value;
    }
    // collect abbr-list data
    let abbrListContainer = document.getElementById('abbr-list-container'), abbrListCollResult = [];
    if(abbrListContainer.cache != undefined)
        abbrListCollResult.push(Object.assign({type: 'enumeration', node: abbrListContainer}, abbrListContainer.cache));
    return {
        main: collectFromContainer(document.getElementById('main')),
        introduction: collectFromContainer(document.getElementById('introduction')),
        conclusion: collectFromContainer(document.getElementById('conclusion')),
        abbrList: abbrListCollResult,
        tlist: Object.assign({type: 'tlist', titleType: titleType}, common, special),
    };
}

function onPreviewResize(){
    let preview = document.getElementById('preview');
    let body = preview.contentDocument.body, bodyWidth = body.scrollWidth, frameWidth = preview.offsetWidth;
    let scaleFactor = (frameWidth - 17) / bodyWidth;
    body.style.transform = `scale(${scaleFactor})`;
    body.style.transformOrigin = '0 0';
    renderCheck(preview.contentDocument.body);
}

let previewResizeObserver = new ResizeObserver(onPreviewResize);
window.onload = function(){
    upd();
    previewResizeObserver.observe(document.getElementById('preview'));
}

function changeTitleType(e){
    let container = document.getElementById('title-types-container');
    for(let child of container.children){
        if(child.getAttribute('name') != e.target.selectedOptions[0].getAttribute('name'))
            child.hidden = true;
        else
            child.hidden = false;
    }
}

function abbrListOnblur(){
    let children = event.target.parentElement.children;
    if(children[children.length - 1].value != '')
        event.target.parentElement.insertAdjacentHTML("beforeend", '<textarea class="enumeration-text" onblur="CacheWriter.abbrList(event.target.parentElement);upd();abbrListOnblur();dumpValue();"></textarea>');
    for(let i = 0; i < children.length - 1; i++){
        if(children[i].value == ''){
            children[i].remove();
            break;
        }
    }
}

function limitTextarea(){
    let width = Number.parseInt(event.target.getAttribute('data-width'));
    event.target.value = line_divide(event.target.value, TimesNewRoman, 14, convert_millimeters(width))[0];
}
