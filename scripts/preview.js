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
    }
}
