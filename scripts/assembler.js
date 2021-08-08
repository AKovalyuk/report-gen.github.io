const 
    TEXT_BEFORE = 0, 
    TEXT_AFTER = 0,
    TNR_14PT_HEIGHT = 17000,
    PAGE_HEIGHT = 728500,
    PRE_TABLE_TEXT_BEFORE = 6000,
    TNR_12PT_HEIGHT = 14000,
    BORDER_TABLE_SIZE = 500,
    PRE_TABLE_TEXT_AFTER = 6000,
    TABLE_AFTER = 12000,
    HEADING_BEFORE = 7000,
    HEADING_AFTER = 7000,
    PICTURE_BEFORE = 12000,
    PICTURE_AFTER = 6000,
    PICTURE_TEXT_BEFORE = 6000,
    PICTURE_TEXT_AFTER = 12000,
    PUNCTS_PER_PIXEL = 750,
    ENUM_BEFORE = 0,
    ENUM_AFTER = 0,
    SNIPPET_BEFORE = 6000,
    SNIPPET_AFTER = 12000,
    CNEW_LINE_LIMIT = 80,
    PRE_SNIPPET_TEXT_BEFORE = 6000,
    PRE_SNIPPET_TEXT_AFTER = 6000,
    CNEW_10PT_HEIGHT = 12000,
    FORMULA_BEFORE = 7000,
    FORMULA_AFTER = 7000,
    MAX_FORMULA_HEIGHT = 120,
    SPACE_SIZE = 250
    ;

let buildResult = null;

function upd(){
    let time = performance.now();
    buildResult = build(collect());
    console.log('Build in', performance.now() - time, 'ms');
    preview(buildResult);
    console.log('Preview in', performance.now() - time, 'ms');
}

function build(uiData){
    let main = uiData.main, 
        introduction = uiData.introduction, 
        conclusion = uiData.conclusion, 
        tlist = uiData.tlist,
        abbrList = uiData.abbrList;
    let introductionPos = new Position(), introductionResult = [];
    buildSequence((introduction.length > 0 ? [{type: 'title', text: 'ВВЕДЕНИЕ'}] : []).concat(introduction), introductionResult, introductionPos);
    let mainPos = new Position(), mainResult = [];
    buildSequence(main, mainResult, mainPos);
    let conclusionPos = new Position(), conclusionResult = [];
    buildSequence((conclusion.length > 0 ? [{type: 'title', text: 'ЗАКЛЮЧЕНИЕ'}] : []).concat(conclusion), conclusionResult, conclusionPos);
    let abbrListPos = new Position(), abbrListResult = [];
    buildSequence((abbrList.length > 0 ? [{type: 'title', text: 'СПИСОК СОКРАЩЕНИЙ'}] : []).concat(abbrList), abbrListResult, abbrListPos);
    if(introductionResult[0] && introductionResult[0].length != 1)
        introductionPos.tocData.unshift([1, 'ВВЕДЕНИЕ']);
    if(conclusionResult[0] && conclusionResult[0].length != 1)
        conclusionPos.tocData.unshift([1, 'ЗАКЛЮЧЕНИЕ']);
    if(abbrListResult[0] && abbrListResult[0].length != 1)
        abbrListPos.tocData.unshift([1, 'СПИСОК СОКРАЩЕНИЙ']);
    if(!introductionResult.length)
        introductionPos.pageNumber = 0;
    if(!conclusionResult.length)
        conclusionPos.pageNumber = 0;
    if(!mainResult.length)
        mainPos.pageNumber = 0;
    if(!abbrListResult.length)
        abbrListPos.pageNumber = 0;
    let toc = createTableOfContents(mergeTocData([
        introductionPos,
        mainPos,
        conclusionPos,
        abbrListPos
    ]));
    if(toc.length > 0)
        toc.unshift({type: 'title', text: 'СОДЕРЖАНИЕ'});
    return [[tlist]]
        .concat(packPages(toc))
        .concat(packPages(introductionResult))
        .concat(packPages(mainResult)
        .concat(packPages(conclusionResult)))
        .concat(packPages(abbrListResult));
}

class Position{
    constructor(){
        this.position = 0;
        this.image = 1;
        this.table = 1;
        this.snippet = 1;
        this.pageNumber = 1;
        this.spacingBefore = 0;
        this.nestingLevel = 0;
        this.chapter = 1;
        this.subchapter = 1;
        this.section = 1;
        this.subsection = 1;
        this.tocData = [];
    }
}

function insertText(element, output, pos){
    let spacingBefore = Math.max(pos.spacingBefore, TEXT_BEFORE);
    let i = 0, accomulator = [];
    for(let line of element.text){
        if(TNR_14PT_HEIGHT + pos.position + (i == 0 ? spacingBefore : 0) >= PAGE_HEIGHT){
            if(accomulator.length != 0)
                output.push({type: 'text', text: accomulator, sb: (i != 0 ? 0 : spacingBefore), firstLineIndent: i == 0});
            output.push({type: 'pb'});
            pos.pageNumber += 1;
            accomulator = [];
            pos.position = 0;
            i += 1;
        }
        accomulator.push(line);
        pos.position += TNR_14PT_HEIGHT;
    }
    output.push({type: 'text', text: accomulator, 'sb': (i == 0 ? spacingBefore : 0), firstLineIndent: i == 0})
    pos.spacingBefore = TEXT_AFTER;
    pos.position += (i == 0 ? spacingBefore : 0);
}

function insertTable(element, output, pos){
    let spacingBefore = Math.max(pos.spacingBefore, PRE_TABLE_TEXT_BEFORE);
    let header = element.rows[0];
    let rows = element.rows.slice(1);
    let headerHeight = 0;
    for(let headerElement of header){
        headerHeight = Math.max(headerElement.length, headerHeight); 
    }
    headerHeight *= TNR_12PT_HEIGHT;
    let rowsHeight = [];
    for(let row of rows){
        let maxHeight = 0;
        for(let i = 0; i < row.length; i++){
            maxHeight = Math.max(maxHeight, row[i].length);
        }
        rowsHeight.push(maxHeight * TNR_12PT_HEIGHT);
    }
    let preTableText = [...element.caption];
    preTableText[0] = `Таблица ${pos.table}` + preTableText[0].slice(12);
    if(headerHeight + 
        rowsHeight[0] + 
        3 * BORDER_TABLE_SIZE + 
        preTableText.length * TNR_14PT_HEIGHT +
        PRE_TABLE_TEXT_AFTER >= PAGE_HEIGHT ||
        headerHeight + 
        Math.max.apply(null, rowsHeight) +
        3 * BORDER_TABLE_SIZE + TNR_14PT_HEIGHT +
        PRE_TABLE_TEXT_AFTER >= PAGE_HEIGHT){
            if(preTableText.length > 6){
                preTableText = preTableText.slice(0, 5);
                preTableText.push('...');
            }
            for(let i = 0; i < header.length; i++){
                if(header[i].length > 6){
                    header[i] = header[i].slice(0, 5);
                    header[i].push('...');
                }
            }
            for(let i = 0; i < rows.length; i++)
                for(let j = 0; j < rows[i].length; j++){
                    if(rows[i][j].length > 21){
                        rows[i][j] = rows[i][j].slice(0, 20);
                        rows[i][j].push('...');
                    }
                }
            headerHeight = 0;
            for(let headerElement of header){
                headerHeight = Math.max(headerElement.length, headerHeight); 
            }
            headerHeight *= TNR_12PT_HEIGHT;
            rowsHeight = [];
            for(let row of rows){
                let maxHeight = 0;
                for(let i = 0; i < row.length; i++){
                    maxHeight = Math.max(maxHeight, row[i].length);
                }
                rowsHeight.push(maxHeight * TNR_12PT_HEIGHT);
            }
        }
    let firstPB = false;
    if(headerHeight + rowsHeight[0] +
        3 * BORDER_TABLE_SIZE + preTableText.length * TNR_14PT_HEIGHT +
        PRE_TABLE_TEXT_AFTER + spacingBefore >= PAGE_HEIGHT - pos.position){
        output.push({type: 'pb'});
        pos.pageNumber += 1;
        pos.position = 0;
        firstPB = true;
    }
    output.push({type: 'caption', text: preTableText, sb: (firstPB ? 0 : spacingBefore)});
    let rowsAccomulator = [header, rows[0]];
    pos.position += headerHeight + rowsHeight[0] + 
        preTableText.length * TNR_14PT_HEIGHT +
        PRE_TABLE_TEXT_AFTER + (firstPB ? 0 : spacingBefore) +
        3 * BORDER_TABLE_SIZE;
    let tableContinue = [`Продолжение таблицы ${pos.table}`]
    for(let i = 1; i < rows.length; i++){
        if(rowsHeight[i] + pos.position >= PAGE_HEIGHT){
            if(rowsAccomulator.length)
                output.push({type: 'table', rows: rowsAccomulator, widths: element.widths});
            output.push({type: 'pb'});
            pos.pageNumber += 1;
            output.push({type: 'caption', text: tableContinue, sb: 0});
            rowsAccomulator = [header];
            pos.position = TNR_14PT_HEIGHT + PRE_TABLE_TEXT_AFTER + headerHeight + 2 * BORDER_TABLE_SIZE;
        }
        rowsAccomulator.push(rows[i]);
        pos.position += rowsHeight[i] + BORDER_TABLE_SIZE;
    }
    if(rowsAccomulator.length)
        output.push({type: 'table', rows: rowsAccomulator, widths: element.widths});
    for(let i = output.length - 1; i >= 0; i--){
        if(output[i].type == 'caption'){
            if(output[i].text == tableContinue)
                output[i].text = [`Окончание таблицы ${pos.table}`];
            break;
        }
    }
    pos.table++;
    pos.spacingBefore = TABLE_AFTER;
}

function insertrHeader(element, output, pos){
    let spacingBefore = (pos.nestingLevel == 0 && pos.chapter == 1) ? 0 : Math.max(pos.spacingBefore, HEADING_BEFORE);
    let chapterName = [...element.text];
    let nestingLevel = pos.nestingLevel, numbering = '';
    let tocData = [];
    if(nestingLevel == 0){
        numbering = `\t${pos.chapter}`;
        tocData[2] = pos.chapter;
    }
    if(nestingLevel == 1){
        numbering = `\t${pos.chapter}.${pos.subchapter}`;
        tocData[2] = pos.chapter;
        tocData[3] = pos.subchapter;
    }
    if(nestingLevel == 2){
        numbering = `\t${pos.chapter}.${pos.subchapter}.${pos.section}`;
        tocData[2] = pos.chapter;
        tocData[3] = pos.subchapter;
        tocData[4] = pos.section;
    }
    if(nestingLevel == 3){
        numbering = `\t${pos.chapter}.${pos.subchapter}.${pos.section}.${pos.subsection}`;
        tocData[2] = pos.chapter;
        tocData[3] = pos.subchapter;
        tocData[4] = pos.section;
        tocData[5] = pos.subsection;
    }
    if(chapterName.length >= 15){
        chapterName = chapterName.slice(15);
    }
    tocData[1] = chapterName[0].slice(12) + chapterName.slice(1).join(' ');
    chapterName[0] = numbering + chapterName[0].slice(12);
    if(TNR_14PT_HEIGHT * chapterName.length + spacingBefore >= PAGE_HEIGHT - pos.position){
        output.push({type: 'pb'});
        pos.pageNumber += 1;
        pos.position = 0;
        output.push({type: 'heading', text: chapterName, sb: 0});
        pos.position += TNR_14PT_HEIGHT * chapterName.length;
    }
    else{
        output.push({type: 'heading', text: chapterName, sb: spacingBefore});
        pos.position += spacingBefore + TNR_14PT_HEIGHT * chapterName.length;
    }
    pos.spacingBefore = HEADING_AFTER;
    tocData[0] = pos.pageNumber;
    pos.tocData.push(tocData);
    pos.nestingLevel += 1;
    buildSequence(element.elements, output, pos);
    pos.nestingLevel -= 1;
    if(nestingLevel == 0){
        pos.chapter++;
        pos.subsection = pos.subchapter = pos.section = 1;
    }
    if(nestingLevel == 1){
        pos.subchapter++;
        pos.section = pos.subsection = 1;
    }
    if(nestingLevel == 2){
        pos.section++;
        pos.subsection = 1;
    }
    if(nestingLevel == 3){
        pos.subsection++;
    }
}

function insertImage(element, output, pos){
    let spacingBefore = Math.max(pos.spacingBefore, PICTURE_BEFORE);
    let targetWidth = 400, width = element.width, height = element.height;
    let originalAspectRaito = 1. * width / height, destWidth = targetWidth, destHeight = Math.floor(targetWidth / originalAspectRaito);
    let caption = [...element.caption];
    caption[0] = `Рисунок ${pos.image}` + caption[0].slice(12);
    let constructionSize = caption.length * TNR_14PT_HEIGHT + destHeight * PUNCTS_PER_PIXEL + PICTURE_BEFORE + spacingBefore + PICTURE_AFTER;
    if(constructionSize - spacingBefore >= PAGE_HEIGHT){
        destWidth = destWidth * (400 / destHeight);
        destHeight = 400;
        if(caption.length > 6){
            caption = caption.slice(0, 5);
            caption.push('...');
        }
        constructionSize = caption.length * TNR_14PT_HEIGHT + destHeight * PUNCTS_PER_PIXEL + PICTURE_BEFORE + spacingBefore + PICTURE_AFTER;
    }
    if(constructionSize >= PAGE_HEIGHT - pos.position){
        output.push({type: 'pb'})
        pos.pageNumber += 1;
        pos.position = constructionSize - spacingBefore;
        output.push({type: 'image', width: destWidth, height: destHeight, caption: caption, src: element.src, sb: 0});
    }
    else{
        pos.position += constructionSize;
        output.push({type: 'image', width: destWidth, height: destHeight, caption: caption, src: element.src, sb: spacingBefore});
    }
    pos.spacingBefore = PICTURE_TEXT_AFTER;
    pos.image++;
}

function insertEnumeration(element, output, pos){
    let spacingBefore = Math.max(pos.spacingBefore, ENUM_BEFORE), enumElements = [];
    for(let i = 0; i < element.text.length; i++){
        let el = element.text[i];
        if(pos.position + el.length * TNR_14PT_HEIGHT + (i == 0 ? spacingBefore : 0) >= PAGE_HEIGHT){
            if(el.length * TNR_14PT_HEIGHT >= PAGE_HEIGHT){
                insertText({text: el}, output, pos);
            }
            else{
                output.push({type: 'pb'});
                pos.pageNumber += 1;
                output.push({type: 'text', text: el, sb: 0, firstLineIndent: true});
                pos.position = el.length * TNR_14PT_HEIGHT;
            }
        }
        else{
            output.push({type: 'text', text: el, sb: (i == 0 ? spacingBefore : 0), firstLineIndent: true});
            pos.position += el.length * TNR_14PT_HEIGHT + (i == 0 ? spacingBefore : 0);
        }
    }
    pos.spacingBefore = ENUM_AFTER;
}

function insertCodeSnippet(element, output, pos){
    let spacingBefore = Math.max(pos.spacingBefore, SNIPPET_BEFORE);
    let caption = [...element.caption];
    caption[0] = `Листинг ${pos.snippet}` + caption[0].slice(12);
    let logicalRows = element.code, rows = [];
    for(let row of logicalRows){
        let spacesBefore = 0, i = 0;
        for(i = 0; i < row.length; i++){
            if(row[i] != ' ')
                break;
            else
                spacesBefore = i + 1;
        }
        if(spacesBefore >= 70){
            row = row.slice(spacesBefore);
            spacesBefore = 0;
        }
        /*row = row.slice(spacesBefore);
        if(spacesBefore >= 40){
            spacesBefore = 0;
        }
        let appendix = [], width = CNEW_LINE_LIMIT - spacesBefore, segCount = row.length / width + (row.length % width ? 1 : 0);
        for(let segm = 0; segm < segCount; segm++){
            appendix.push(' '.repeat(spacesBefore) + row.slice(segm, segm + width));
        }*/
        let appendix = [];
        for(let segm = 0; segm < Math.ceil((row.length - spacesBefore) / (CNEW_LINE_LIMIT - spacesBefore)); segm++){
            appendix.push(' '.repeat(spacesBefore) + row.slice(spacesBefore + segm * (CNEW_LINE_LIMIT - spacesBefore), spacesBefore + segm * (CNEW_LINE_LIMIT - spacesBefore) + (CNEW_LINE_LIMIT - spacesBefore)));
        }
        rows = rows.concat(appendix);
    }
    let firstPB = false;
    if(CNEW_10PT_HEIGHT + caption.length * TNR_14PT_HEIGHT + PRE_SNIPPET_TEXT_AFTER + spacingBefore >= PAGE_HEIGHT - pos.position){
        output.push({type: 'pb'});
        pos.pageNumber += 1;
        pos.position = 0;
        firstPB = true;
    }
    output.push({type: 'caption', text: caption, sb: (firstPB ? 0 : spacingBefore)});
    let rowsAccomulator = [rows[0]]
    pos.position += CNEW_10PT_HEIGHT + caption.length * TNR_14PT_HEIGHT + PRE_SNIPPET_TEXT_AFTER + (firstPB ? 0 : spacingBefore);
    let snippetContinue = [`Продолжение листинга ${pos.snippet}`];
    for(let i = 1; i < rows.length; i++){
        if(CNEW_10PT_HEIGHT + pos.position >= PAGE_HEIGHT){
            if(rowsAccomulator.length)
                output.push({type: 'snippet', text: rowsAccomulator});
            rowsAccomulator = [];
            output.push({type: 'pb'});
            pos.pageNumber += 1;
            output.push({type: 'caption', text: snippetContinue, sb: 0});
            pos.position = TNR_14PT_HEIGHT * caption.length + PRE_SNIPPET_TEXT_AFTER;
        }
        rowsAccomulator.push(rows[i]);
        pos.position += CNEW_10PT_HEIGHT;
    }
    if(rowsAccomulator.length)
        output.push({type: 'snippet', text: rowsAccomulator});
    for(let i = output.length - 1; i >= 0; i--){
        if(output[i].type == 'caption'){
            if(output[i].text == snippetContinue)
                output[i].text = [`Окончание листинга ${pos.snippet}`]
            break;
        }
    }
    pos.spacesBefore = SNIPPET_AFTER;
    pos.snippet++;
}

function insertFormula(element, output, pos){
    let spacingBefore = Math.max(FORMULA_BEFORE, pos.spacingBefore);
    let width = element.width, height = element.height, originalAspectRaito = width / height, targetWidth = 550, mult = 1 / 3.6;
    if(! width < targetWidth){
        width = targetWidth;
        height = Math.floor(targetWidth * 1. / originalAspectRaito);
    }
    else{
        width = Math.floor(width * mult);
        height = Math.floor(height * mult);
    }
    if(height > MAX_FORMULA_HEIGHT){
        width = Math.floor(width * MAX_FORMULA_HEIGHT / height);
        height = MAX_FORMULA_HEIGHT;
    }
    let formula = {type: 'formula', png: element.png, width: width, height: height}
    if(pos.position + spacingBefore + PUNCTS_PER_PIXEL * height >= PAGE_HEIGHT){
        pos.pageNumber += 1;
        output.push({type: 'pb'});
        formula.sb = 0;
        output.push(formula);
    }
    else{
        formula.sb = spacingBefore;
        output.push(formula);
    }
    pos.position = PUNCTS_PER_PIXEL * height + (pos.position + spacingBefore + PUNCTS_PER_PIXEL * height >= PAGE_HEIGHT ? 0 : pos.position + spacingBefore);
    pos.spacingBefore = FORMULA_AFTER
}

function insertTitle(element, output, pos){
    let text = element.text;
    output.push({type: 'title', text: text});
    pos.position += 17000;
    pos.spacingBefore = 14000;
}

function buildSequence(seq, output, pos){
    const map = {
        section: insertrHeader,
        enumeration: insertEnumeration,
        paragraph: insertText,
        snippet: insertCodeSnippet,
        image: insertImage,
        formula: insertFormula,
        table: insertTable,
        title: insertTitle
    }
    for(let element of seq){
        map[element.type](element, output, pos);
    }
}

function packPages(seq){
    if(seq.length == 0)
        return [];
    let pages = [[]];
    for(let element of seq){
        if(element.type == 'pb')
            pages.push([]);
        else{
            pages[pages.length - 1].push(element);
        }
    }
    return pages;
}

function createTableOfContents(toc){
    let leftParts = [], centralParts = [], pbs = new Set();
    for(let tocObj of toc){
        let leftPart = ' '.repeat((tocObj.length - 2) * 2) + tocObj.slice(2).join('.') + (tocObj.length > 2 ? ' ' : '');
        leftParts.push(leftPart);
        let centralPart = line_divide(tocObj[1], TimesNewRoman, 14, convert_millimeters(170) - string_metrics(leftPart, TimesNewRoman) * 14 - 28000);
        centralParts.push(centralPart);
    }
    let currentPageRem = 41;
    for(let i = 0; i < centralParts.length; i++){
        if(currentPageRem - centralParts[i].length < 0){
            currentPageRem = 42;
            pbs.add(i);
        }
        currentPageRem -= centralParts[i].length;
    }
    let totalPagesBeforeToc = 2 + pbs.size;
    for(let i = 0; i < centralParts.length; i++){
        let cp = centralParts[i];
        cp[0] = leftParts[i] + cp[0];
        lpiLength = string_metrics(leftParts[i], TimesNewRoman);
        for(let j = 1; j < cp.length; j++){
            cp[j] = ' '.repeat(Math.floor(lpiLength / SPACE_SIZE)) + cp[j];
        }
        let dots = Math.floor((convert_millimeters(170) - string_metrics(cp[cp.length - 1], TimesNewRoman) * 14 - 28000) / 3500);
        number = totalPagesBeforeToc + toc[i][0];
        cp[cp.length - 1] += '.'.repeat(dots) + ' '.repeat(8 - String(number).length * 2) + number;
    }
    let result = [];
    for(let i = 0; i < centralParts.length; i++){
        if(pbs.has(i)){
            result.push({type: 'pb'});
        }
        result.push({type: 'line', text: centralParts[i], sb: (i == 0 ? 14000 : 0)});
    }
    return result;
}

function mergeTocData(poss){
    let currentShift = 0;
    let result = [];
    for(let pos of poss){
        for(let i = 0; i < pos.tocData.length; i++){
            pos.tocData[i][0] += currentShift;
        }
        result = result.concat(pos.tocData);
        currentShift += pos.pageNumber;
    }
    return result;
}
