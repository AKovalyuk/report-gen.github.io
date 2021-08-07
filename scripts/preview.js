function preview(pages){
    let doc = document.getElementById('preview').contentWindow.document;
    doc.body.innerHTML = '';
    for(let i = 0; i < pages.length; i++){
        let newPage = doc.createElement('div');
        if(i == 0)
            newPage.style.marginTop = '0';
        if(pages[i][0].type != 'tlist')
            newPage.classList.add('numberable');
        newPage.classList.add('page');
        newPage.setAttribute('name', i + 1);
        newPage.ready = true;
        doc.body.appendChild(newPage);
    }
    doc.buildResult = pages;
    renderCheck(doc.body);
}

function renderCheck(body){
    for(let page of body.children){
        if(page.ready){
            let rect = page.getClientRects()[0];
            if(!(rect.bottom < 0 || rect.top > window.innerHeight)){
                renderSelf(page);
                page.ready = false;
            }
        }
    }
}

function drawSimpleTitle(title, newPage, element){
    let doc = newPage.ownerDocument;
    newPage.innerHTML += '<div class="central-align-text">Федеральное государственное автономное\nобразовательное учреждение\nвысшего образования\n«СИБИРСКИЙ ФЕДЕРАЛЬНЫЙ УНИВЕРСИТЕТ»</div>';
    let firstTable = doc.createElement('table');
    firstTable.style.width = '170mm';
    let tr = doc.createElement('tr');
    let td = doc.createElement('td');
    td.textContent = element.institute;
    td.style.height = '17pt';
    td.classList.add('standart-table-cell');
    td.classList.add('title-table-cell');
    tr.appendChild(td);
    firstTable.appendChild(tr);
    tr = doc.createElement('tr');
    td = doc.createElement('td');
    td.classList.add('sub-table-cell');
    td.textContent = 'институт';
    td.style.borderTop = '0.5pt solid black';
    td.classList.add('title-table-cell');
    tr.appendChild(td);
    firstTable.appendChild(tr);
    tr = doc.createElement('tr');
    td = doc.createElement('td');
    td.textContent = element.department;
    td.style.height = '17pt';
    td.classList.add('standart-table-cell');
    td.classList.add('title-table-cell');
    tr.appendChild(td);
    firstTable.appendChild(tr);
    tr = doc.createElement('tr');
    td = doc.createElement('td');
    td.classList.add('sub-table-cell');
    td.textContent = 'кафедра';
    td.style.borderTop = '0.5pt solid black';
    td.classList.add('title-table-cell');
    tr.appendChild(td);
    firstTable.appendChild(tr);
    newPage.appendChild(firstTable);
    let bigTitle = doc.createElement('div');
    bigTitle.textContent = title;
    bigTitle.classList.add('central-align-text');
    bigTitle.style.fontWeight = 'bold';
    bigTitle.style.marginTop = '204pt';
    newPage.appendChild(bigTitle);
    if(!(element.titleType == 'practiceWorkReport' || element.titleType == 'laboratoryWorkReport' || element.titleType == 'projectReport')){
        let secondTable = doc.createElement('table');
        secondTable.style.width = '170mm';
        let tr = doc.createElement('tr');
        let td = doc.createElement('td');
        td.textContent = 'по';
        td.classList.add('title-table-cell');
        td.classList.add('standart-table-cell');
        td.style.width = '5mm';
        tr.appendChild(td);
        td = doc.createElement('td');
        td.textContent = element.subject;
        td.classList.add('title-table-cell');
        td.classList.add('standart-table-cell');
        td.style.width ='165mm'
        tr.appendChild(td);
        secondTable.appendChild(tr);
        tr = doc.createElement('tr');
        td = doc.createElement('td');
        td.classList.add('title-table-cell');
        td.classList.add('sub-table-cell');
        td.textContent = 'наименование дисциплины';
        td.setAttribute('colspan', '2');
        td.style.borderTop = '0.5pt solid black';
        tr.appendChild(td);
        secondTable.appendChild(tr);
        newPage.appendChild(secondTable);
    }
    // theme table
    let thirdTable = doc.createElement('table');
    thirdTable.style.width = '170mm';
    let tr1 = doc.createElement('tr');
    let td1 = doc.createElement('td');
    td1.textContent = element.theme;
    td1.style.height = '17pt';
    td1.classList.add('standart-table-cell');
    td1.classList.add('title-table-cell');
    tr1.appendChild(td1);
    thirdTable.appendChild(tr1);
    tr1 = doc.createElement('tr');
    td1 = doc.createElement('td');
    td1.classList.add('sub-table-cell');
    td1.textContent = 'тема';
    td1.style.borderTop = '0.5pt solid black';
    td1.classList.add('title-table-cell');
    tr1.appendChild(td1);
    thirdTable.appendChild(tr1);
    newPage.appendChild(thirdTable);
    // last table
    let lastTable = doc.createElement('table');
    lastTable.style.marginTop = '204pt';
    // first row
    let tr2 = doc.createElement('tr');
    let td2 = doc.createElement('td');
    td2.setAttribute('colspan', '2');
    td2.style.width = '8cm';
    td2.classList.add('title-table-cell');
    td2.classList.add('standart-table-cell');
    td2.textContent = 'Преподаватель';
    td2.style.textAlign = 'left';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.style.width = '1cm';
    td2.classList.add('title-table-cell');
    td2.classList.add('standart-table-cell');
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('standart-table-cell');
    td2.style.width = '3cm';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('standart-table-cell');
    td2.style.width = '1cm';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('standart-table-cell');
    td2.style.width = '4cm';
    td2.textContent = element.supervisor;
    tr2.appendChild(td2);
    lastTable.appendChild(tr2);
    // second row
    tr2 = doc.createElement('tr');
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('sub-table-cell');
    td2.setAttribute('colspan', '2');
    td2.style.width = '8cm';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('sub-table-cell');
    td2.style.width = '1cm';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('sub-table-cell');
    td2.textContent = 'подпись, дата';
    td2.style.borderTop = '0.5pt solid black';
    td2.style.width = '3cm';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('sub-table-cell');
    td2.style.width = '1cm';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('sub-table-cell');
    td2.style.borderTop = '0.5pt solid black';
    td2.textContent = 'инициалы, фамилия'
    td2.style.width = '4cm';
    tr2.appendChild(td2);
    lastTable.appendChild(tr2);
    // third row
    tr2 = doc.createElement('tr');
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('standart-table-cell');
    td2.style.width = '25mm';
    td2.textContent = 'Студент';
    td2.style.textAlign = 'left';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('standart-table-cell');
    td2.style.width = '55mm';
    td2.textContent = element.groupRecordBook;
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('standart-table-cell');
    td2.style.width = '1cm';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('standart-table-cell');
    td2.style.width = '3cm';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('standart-table-cell');
    td2.style.width = '1cm';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('standart-table-cell');
    td2.textContent = element.student;
    td2.style.width = '4cm';
    tr2.appendChild(td2);
    lastTable.appendChild(tr2);
    // 4-th row
    tr2 = doc.createElement('tr');
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('sub-table-cell');
    td2.style.width = '25mm';
    td2.style.textAlign = 'left';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('sub-table-cell');
    td2.style.borderTop = '0.5pt solid black';
    td2.style.width = '55mm';
    td2.textContent = 'номер группы, зачетной книжки';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('sub-table-cell');
    td2.style.width = '1cm';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('sub-table-cell');
    td2.style.borderTop = '0.5pt solid black';
    td2.style.width = '3cm';
    td2.textContent = 'подпись, дата';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('sub-table-cell');
    td2.style.width = '1cm';
    tr2.appendChild(td2);
    td2 = doc.createElement('td');
    td2.classList.add('title-table-cell');
    td2.classList.add('sub-table-cell');
    td2.style.borderTop = '0.5pt solid black';
    td2.style.width = '4cm';
    td2.textContent = 'инициалы, фамилия';
    tr2.appendChild(td2);
    lastTable.appendChild(tr2);
    newPage.appendChild(lastTable);
    let krsk = doc.createElement('div');
    krsk.classList.add('central-align-text');
    krsk.textContent = `Красноярск ${(new Date()).getFullYear()}`;
    krsk.style.marginTop = '30pt';
    newPage.appendChild(krsk);
}

function renderSelf(newPage){
    let doc = newPage.ownerDocument;
    let pageIndex = Number.parseInt(newPage.getAttribute('name')) - 1;
    let pages = doc.buildResult;
    let page = doc.buildResult[pageIndex];
    let i = pageIndex;
    for(let j = 0; j < pages[pageIndex].length; j++){
        let element = pages[pageIndex][j];
        if(element.type == 'text'){
            let p = doc.createElement('div');
            p.classList.add('paragraph');
            for(let i = 0; i < element.text.length - 1; i++){
                let line = doc.createElement('div');
                line.textContent = element.text[i];
                p.appendChild(line);
            }
            let lastLine = doc.createElement('div');
            lastLine.textContent = element.text[element.text.length - 1];
            lastLine.style.textAlignLast = 'left';
            if(j != page.length - 1 && page[j + 1].type == 'text' && !page[j + 1].firstLineIndent)
                lastLine.style.textAlignLast = 'justify';
            else
                if(j == page.length - 1 && i != pages.length - 1 && pages[i + 1][0].type == 'text' && !pages[i + 1][0].firstLineIndent)
                    lastLine.style.textAlignLast = 'justify';

            p.appendChild(lastLine);
            if(element.firstLineIndent)
                p.children[0].style.textIndent = '12.5mm';
            p.style = `margin-top: ${element.sb / 1000}pt;`;
            newPage.appendChild(p);
            continue;
        }
        if(element.type == 'heading'){
            let p = doc.createElement('div');
            p.classList.add('heading');
            for(let i = 0; i < element.text.length - 1; i++){
                let line = doc.createElement('div');
                line.textContent = element.text[i];
                p.appendChild(line);
            }
            let lastLine = doc.createElement('div');
            lastLine.textContent = element.text[element.text.length - 1];
            lastLine.style.textAlignLast = 'left';
            p.appendChild(lastLine);
            p.style = `margin-top: ${element.sb / 1000}pt;`;
            newPage.appendChild(p);
            continue;
        }
        if(element.type == 'image'){
            let img = doc.createElement('img');
            img.classList.add('image');
            img.src = element.src;
            img.style.width = element.width + 'px';
            img.style.height = element.height + 'px';
            img.style.marginTop = `${element.sb / 1000}pt`;
            let caption = doc.createElement('div');
            caption.classList.add('image-caption');
            for(let k = 0; k < element.caption.length - 1; k++){
                caption.appendChild(doc.createTextNode(element.caption[k]));
                caption.appendChild(doc.createElement('br'));
            }
            caption.appendChild(doc.createTextNode(element.caption[element.caption.length - 1]));
            caption.style.marginTop = '6pt';
            newPage.appendChild(img);
            newPage.appendChild(caption);
            continue;
        }
        if(element.type == 'caption'){
            let caption = doc.createElement('div');
            for(let k = 0; k < element.text.length - 1; k++){
                caption.appendChild(doc.createTextNode(element.text[k]));
                caption.appendChild(doc.createElement('br'));
            }
            caption.appendChild(doc.createTextNode(element.text[element.text.length - 1]));
            caption.style.marginTop = `${element.sb / 1000}pt`;
            caption.classList.add('caption');
            newPage.appendChild(caption);
            continue;
        }
        if(element.type == 'snippet'){
            let snippet = doc.createElement('div');
            snippet.style.marginTop = '6pt';
            snippet.classList.add('snippet');
            snippet.textContent = element.text.join('\n');
            newPage.appendChild(snippet);
            continue;
        }
        if(element.type == 'formula'){
            let formula = doc.createElement('img');
            formula.src = element.png;
            formula.style.marginTop = `${element.sb / 1000}pt`;
            formula.style.height = `${element.height}px`;
            formula.style.width = `${element.width}px`;
            formula.classList.add('formula');
            newPage.appendChild(formula);
            continue;
        }
        if(element.type == 'table'){
            let table = doc.createElement('table');
            for(let rowNumber = 0; rowNumber < element.rows.length; rowNumber++){
                let tr = doc.createElement('tr'), row = element.rows[rowNumber];
                let cellIndex = 0;
                for(let cell of row){
                    let td = doc.createElement('td');
                    if(rowNumber == 1)
                        tr.style.borderTopStyle = 'double';
                    if(rowNumber == 0)
                        tr.classList.add('table-header');
                    for(let k = 0; k < cell.length - 1; k++){
                        td.appendChild(doc.createTextNode(cell[k]));
                        td.appendChild(doc.createElement('br'));
                    }
                    td.appendChild(doc.createTextNode(cell[cell.length - 1]));
                    td.style.width = `${element.widths[cellIndex]}mm`;
                    tr.appendChild(td);
                    cellIndex++;
                }
                table.appendChild(tr);
            }
            table.style.marginTop = '6pt';
            newPage.appendChild(table);
            continue;
        }
        if(element.type == 'title'){
            let container = doc.createElement('div');
            container.classList.add('title');
            container.textContent = element.text;
            newPage.appendChild(container);
        }
        if(element.type == 'tlist'){
            let map = {
                practiceWorkReport: [drawSimpleTitle, 'ОТЧЕТ О ПРАКТИЧЕСКОЙ РАБОТЕ', newPage, element],
                laboratoryWorkReport: [drawSimpleTitle, 'ОТЧЕТ ПО ЛАБОРАТОРНОЙ РАБОТЕ', newPage, element],
                projectReport: [drawSimpleTitle, 'ОТЧЕТ О ВЫПОЛНЕНИИ ПРОЕКТА', newPage, element],
                referat: [drawSimpleTitle, 'РЕФЕРАТ', newPage, element],
                essay: [drawSimpleTitle, 'ЭССЕ', newPage, element],
                calculationTask: [drawSimpleTitle, 'РАСЧЕТНОЕ ЗАДАНИЕ', newPage, element],
                controlWork: [drawSimpleTitle, 'КОНТРОЛЬНАЯ РАБОТА', newPage, element],
                calculationGraphicTask: [drawSimpleTitle, 'РАСЧЕТНО-ГРАФИЧЕСКОЕ ЗАДАНИЕ (РАБОТА)', newPage, element],
            };
            map[element.titleType][0](...map[element.titleType].slice(1));
            continue;
        }
        if(element.type == 'line'){
            let div = doc.createElement('div');
            div.classList.add('line');
            div.textContent = element.text.join('\n');
            div.style.marginTop = `${element.sb / 1000}pt`;
            newPage.appendChild(div);
        }
    }
}
