function generate(){
    if(buildResult == null){
        console.log('Nothing to show, document is empty');
        return;
    }
    let generationStart = performance.now();
    let sections = [
        // title page
        {
            children: parsePages(buildResult.slice(0, 1)),
            properties: {
                page: {
                    margin: {
                        top: docx.convertMillimetersToTwip(20),
                        right: docx.convertMillimetersToTwip(10),
                        bottom: docx.convertMillimetersToTwip(20),
                        left: docx.convertMillimetersToTwip(30),
                    },
                },
            }
        },
        // other content
        {
            children: parsePages(buildResult.slice(1)),
            properties: {
                page: {
                    margin: {
                        top: docx.convertMillimetersToTwip(20),
                        right: docx.convertMillimetersToTwip(10),
                        bottom: docx.convertMillimetersToTwip(20),
                        left: docx.convertMillimetersToTwip(30),
                    },
                },
            },
            footers: {
                default: new docx.Footer({
                    children: [
                        new docx.Paragraph({
                            children: [new docx.TextRun({ children: [docx.PageNumber.CURRENT] })],
                            alignment: docx.AlignmentType.CENTER,
                            style: "BaseStyle",
                        }),
                    ],
                }),
            },
        }   
    ];
    let doc = new docx.Document({
        styles: {
            paragraphStyles: [
                {
                    id: "BaseStyle",
                    name: "Base style",
                    basedOn: "Normal",
                    next: "NoIdentation",
                    quickFormat: true,
                    run: {
                        font: "Times New Roman",
                        size: 14 * 2,
                    },
                    paragraph: {
                        spacing: { line: 276, before: 0, after: 0 },
                        rightTabStop: 0,
                        leftTabStop: 0,
                        alignment: docx.AlignmentType.JUSTIFIED,
                    },
                },
                {
                    id: "BaseTinyStyle",
                    name: "Base Tiny",
                    basedOn: "WithoutIntervaks",
                    next: "NoIdentation",
                    quickFormat: true,
                    run: {
                        font: "Times New Roman",
                        size: 10 * 2,
                    },
                    paragraph: {
                        spacing: { line: 276, before: 0, after: 0 },
                        rightTabStop: 0,
                        leftTabStop: 0,
                    },
                },
                {
                    id: "BaseTable",
                    name: "BaseStyle",
                    basedOn: "WithoutIntervaks",
                    next: "NoIdentation",
                    quickFormat: true,
                    run: {
                        font: "Times New Roman",
                        size: 12 * 2,
                    },
                    paragraph: {
                        spacing: { line: 276, before: 0, after: 0 },
                        rightTabStop: 0,
                        leftTabStop: 0,
                    },
                },
                {
                    id: "Listing",
                    name: "Listing",
                    basedOn: "Normal",
                    next: "NoIdentation",
                    quickFormat: true,
                    run: {
                        font: "Courier New",
                        size: 10 * 2,
                    },
                    paragraph: {
                        spacing: { line: 240, before: 0, after: 0, lineRule: "exact" },
                        rightTabStop: 0,
                        leftTabStop: 0,
                        alignment: docx.AlignmentType.LEFT,
                    },
                },
            ],
        },
        sections: sections
    });
    docx.Packer.toBlob(doc).then((blob) => {
        saveAs(blob, 'Отчет.docx');
        console.log('Document created in', performance.now() - generationStart, 'ms');
    })
}

function parsePages(pages){
    let paragraphs = [];
    let headingIndex = 0;
    let tocIndex = 0;
    for(let pageNumber = 0; pageNumber < pages.length; pageNumber++){
        let requrePB = pageNumber != 0;
        for(let i = 0; i< pages[pageNumber].length; i++){
            let element = pages[pageNumber][i];
            if(element.type == 'text'){
                let runs = [];
                requrePB = false;
                for(let j = 0; j < element.text.length; j++){
                    if(j == 0)
                        runs.push(new docx.TextRun({text: element.text[j], break: 0}))
                    else
                        runs.push(new docx.TextRun({text: element.text[j], break: 1}));
                }
                let lastLineJustify = i == pages[pageNumber].length - 1 && pageNumber != pages.length - 1 && pages[pageNumber + 1][0].type == 'text' && !pages[pageNumber + 1][0].firstLineIndent;
                paragraphs.push(new docx.Paragraph({
                    children: runs,
                    alignment: lastLineJustify ? docx.AlignmentType.DISTRIBUTE : docx.AlignmentType.JUSTIFIED,
                    style: 'BaseStyle',
                    spacing: {
                        before: Math.floor(element.sb / 50),
                        line: 340, 
                        lineRule: 'exact'
                    }
                }));
                continue;
            }
            if(element.type == 'heading'){
                let runs = [];
                for(let j = 0; j < element.text.length; j++){
                    runs.push(new docx.TextRun({text: element.text[j], break: j != 0, bold: true}));
                    paragraphs.push(new docx.Paragraph({
                        children: [new docx.Bookmark({children: runs, id: 'heading' + headingIndex})],
                        alignment: docx.AlignmentType.JUSTIFIED,
                        style: 'BaseStyle',
                        spacing: {
                            line: 340,
                            lineRule: 'exact',
                            before: Math.floor(element.sb / 50)
                        },
                        pageBreakBefore: requrePB,
                    }));
                    requrePB = false;
                    headingIndex++;
                }
                continue;
            }
            if(element.type == 'caption'){
                let runs = [];
                for(let j = 0; j < element.text.length; j++){
                    runs.push(new docx.TextRun({text: element.text[j], break: j != 0}));
                }
                paragraphs.push(new docx.Paragraph({
                    children: runs,
                    alignment: docx.AlignmentType.LEFT,
                    style: 'BaseStyle',
                    spacing: {
                        line: 340, 
                        lineRule: 'exact',
                        before: Math.floor(element.sb / 50),
                        after: 120
                    },
                    pageBreakBefore: requrePB
                }));
                requrePB = false;
                continue;
            }
            if(element.type == 'table'){
                let rows = [];
                for(let i = 0; i < element.rows.length; i++){
                    let row = [];
                    for(let j = 0; j < element.rows[i].length; j++){
                        let rns = [];
                        for(let k = 0; k < element.rows[i][j].length; k++){
                            rns.push(new docx.TextRun({text: element.rows[i][j][k], break: k != 0}));
                        }
                        row.push(new docx.TableCell({
                            children: [
                                new docx.Paragraph({
                                    children: rns,
                                    spacing: {
                                        line: 280,
                                        lineRule: 'exact'
                                    },
                                    style: 'BaseTable',
                                    alignment: docx.AlignmentType.CENTER
                                })
                            ],
                            width: {
                                size: docx.convertMillimetersToTwip(element.widths[j]),
                                type: docx.WidthType.DXA
                            },
                            verticalAlign: docx.VerticalAlign.CENTER,
                            borders: {
                                top: {style: docx.BorderStyle.SINGLE, size: 3, color: 'black'},
                                left: {style: docx.BorderStyle.SINGLE, size: 3, color: 'black'},
                                right: {style: docx.BorderStyle.SINGLE, size: 3, color: 'black'},
                                bottom: {style: i == 0 ? docx.BorderStyle.DOUBLE : docx.BorderStyle.SINGLE, size: 3, color: 'black'}
                            }
                        }));
                    }
                    rows.push(new docx.TableRow({children: row}));
                }
                paragraphs.push(new docx.Table({
                    rows: rows,
                    alignment: docx.AlignmentType.CENTER
                }));
                continue;
            }
            if(element.type == 'image'){
                paragraphs.push(new docx.Paragraph({
                    spacing:{
                        before: Math.floor(element.sb / 50),
                        after: 120
                    },
                    alignment: docx.AlignmentType.CENTER,
                    children: [new docx.ImageRun({
                        data: element.src,
                        transformation: {width: element.width, height: element.height}
                    })],
                    pageBreakBefore: requrePB
                }));
                requrePB = false;
                let runs = [];
                for(let j = 0; j < element.caption.length; j++)
                    runs.push(new docx.TextRun({text: element.caption[j], break: j != 0}));
                paragraphs.push(new docx.Paragraph({
                    children: runs,
                    style: 'BaseStyle',
                    spacing: {
                        line: 340,
                        lineRule: 'exact'
                    },
                    alignment: docx.AlignmentType.CENTER
                }));
                continue;
            }
            if(element.type == 'snippet'){
                let runs = [];
                for(let j = 0; j < element.text.length; j++){
                    runs.push(new docx.TextRun({text: element.text[j], break: j ? 1 : 0}));
                }
                paragraphs.push(new docx.Paragraph({
                    children: runs,
                    style: 'Listing'
                }));
                continue;
            }
            if(element.type == 'line'){
                let runs = [];
                for(let j = 0; j < element.text.length; j++)
                    runs.push(new docx.TextRun({text: element.text[j], break: j ? 1 : 0}));
                paragraphs.push(new docx.Paragraph({
                    children: runs,
                    style: 'BaseStyle',
                    spacing:{line: 340, lineRule: 'exact', before: Math.floor(element.sb / 50)},
                    pageBreakBefore: requrePB,
                }));
                tocIndex++;
                requrePB = false;
                continue;
            }
            if(element.type == 'title'){
                paragraphs.push(new docx.Paragraph({
                    children: [new docx.TextRun({text: element.text, bold: true})],
                    style: 'BaseStyle',
                    spacing: {line: 340, lineRule: 'exact'},
                    pageBreakBefore: true,
                    alignment: docx.AlignmentType.CENTER
                }));
                pageBreakBefore = false;
                continue;
            }
            if(element.type == 'formula'){
                paragraphs.push(new docx.Paragraph({
                    children: [
                        new docx.TextRun('\t'),
                        new docx.ImageRun({
                            data: element.png,
                            transformation: {width: element.width, height: element.height}
                        })
                    ],
                    pageBreakBefore: requrePB,
                    spacing: {before: Math.floor(element.sb / 50)},
                }));
                requrePB = false;
            }
            if(element.type == 'tlist'){
                let map = {
                    practiceWorkReport: [generatePracticeTitle, 'ОТЧЕТ О ПРАКТИЧЕСКОЙ РАБОТЕ', element],
                    laboratoryWorkReport: [generatePracticeTitle, 'ОТЧЕТ ПО ЛАБОРАТОРНОЙ РАБОТЕ', element],
                    projectReport: [generatePracticeTitle, 'ОТЧЕТ О ВЫПОЛНЕНИИ ПРОЕКТА', element],
                    referat: [generatePracticeTitle, 'РЕФЕРАТ', element],
                    essay: [generatePracticeTitle, 'ЭССЕ', element],
                    calculationTask: [generatePracticeTitle, 'РАСЧЕТНОЕ ЗАДАНИЕ', element],
                    controlWork: [generatePracticeTitle, 'КОНТРОЛЬНАЯ РАБОТА', element],
                    calculationGraphicTask: [generatePracticeTitle, 'РАСЧЕТНО-ГРАФИЧЕСКОЕ ЗАДАНИЕ (РАБОТА)', element],
                };
                paragraphs = paragraphs.concat(map[element.titleType][0](...map[element.titleType].slice(1)));
                continue;
            }
        }
    }
    return paragraphs;
}

function generateCommonPart(element){
    return [new docx.Paragraph({text:"Федеральное государственное автономное",style:"BaseStyle",alignment:docx.AlignmentType.CENTER}),new docx.Paragraph({text:"образовательное учреждение",style:"BaseStyle",alignment:docx.AlignmentType.CENTER,}),new docx.Paragraph({text:"Высшего образования",style:"BaseStyle",alignment:docx.AlignmentType.CENTER}),new docx.Paragraph({text:"«СИБИРСКИЙ ФЕДЕРАЛЬНЫЙ УНИВЕРСИТЕТ»",style:"BaseStyle",alignment:docx.AlignmentType.CENTER}),new docx.Table({alignment:docx.AlignmentType.CENTER,rows:[new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({text:element.institute,style:"BaseStyle",alignment:docx.AlignmentType.CENTER,})],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(170),type:docx.WidthType.DXA,},}),],}),new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({text:"институт",alignment:docx.AlignmentType.CENTER,verticalAlign:docx.VerticalAlign.TOP,style:"BaseTinyStyle",})],borders:{top:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(170),type:docx.WidthType.DXA,},}),],}),new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({text:element.department,style:"BaseStyle",alignment:docx.AlignmentType.CENTER,})],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(170),type:docx.WidthType.DXA,},}),],}),new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({text:"кафедра",alignment:docx.AlignmentType.CENTER,verticalAlign:docx.VerticalAlign.TOP,style:"BaseTinyStyle",})],borders:{top:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(170),type:docx.WidthType.DXA,},}),],}),],})];
}

function generatePracticeTitle(title, element){
    let spaces = 8, colspan = 1;
    let additionTable = null;
    if(element.titleType != 'practiceWorkReport' && element.titleType != 'laboratoryWorkReport' && element.titleType != 'projectReport'){
        spaces = 7;
        colspan = 2;
        additionTable = new docx.Table({
            alignment: docx.AlignmentType.CENTER, 
            rows: [
                new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({text:"по",alignment:docx.AlignmentType.CENTER,style:"BaseStyle",})],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(5),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[new docx.Paragraph({text:element.subject,alignment:docx.AlignmentType.CENTER,style:"BaseStyle",})],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white"}},width:{size:docx.convertMillimetersToTwip(165),type:docx.WidthType.DXA}})]}),
                new docx.TableRow({children:[new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(5),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[new docx.Paragraph({text:"наименование дисциплины",alignment:docx.AlignmentType.CENTER,style:"BaseTinyStyle",})],borders:{top:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(165),type:docx.WidthType.DXA}})]})
            ]
        });
    }
    let table2 = new docx.Table({
        alignment: docx.AlignmentType.CENTER,
        rows: [
            new docx.TableRow({
                children: [new docx.TableCell({columnSpan:colspan,children: [new docx.Paragraph({text: element.theme, style: "BaseStyle", alignment: docx.AlignmentType.CENTER})],borders: {top: {style: docx.BorderStyle.NONE, size: 1, color: "white"}, bottom: {style: docx.BorderStyle.SINGLE, size: 1,color: "black"},left: {style: docx.BorderStyle.NONE, size: 1, color: "white"},right: {style: docx.BorderStyle.NONE,size: 1,color: "white"},},width: {size: docx.convertMillimetersToTwip(170),type: docx.WidthType.DXA}})],
            }),
            new docx.TableRow({
                children: [new docx.TableCell({columnSpan:colspan,children: [new docx.Paragraph({text: "тема", alignment: docx.AlignmentType.CENTER, verticalAlign: docx.VerticalAlign.TOP, style: "BaseTinyStyle"})],borders: {top: {style: docx.BorderStyle.SINGLE, size: 1, color: "black"},bottom: {style: docx.BorderStyle.NONE, size: 1,color: "white"},left: {style: docx.BorderStyle.NONE, size: 1,color: "white"},right: {style: docx.BorderStyle.NONE, size: 1, color: "white"},},width: {size: docx.convertMillimetersToTwip(170), type: docx.WidthType.DXA},})],
            }),
        ]
    });
    return [].
        concat(generateCommonPart(element)).
        concat(new docx.Paragraph({spacing: {line: 340}, alignment: docx.AlignmentType.CENTER, style: 'BaseStyle', children: [new docx.TextRun({text:'', break: spaces})]})).
        concat(new docx.Paragraph({spacing: {line: 340}, alignment: docx.AlignmentType.CENTER, style: "BaseStyle", children:[new docx.TextRun({bold: true, text: title})]})).
        concat(additionTable == null ? [] : additionTable).
        concat(table2).
        concat(new docx.Paragraph({spacing: {line: 340}, alignment: docx.AlignmentType.CENTER, style: 'BaseStyle', children: [new docx.TextRun({text:'', break: spaces - 1})]})).
        concat(new docx.Table({alignment:docx.AlignmentType.CENTER,rows:[new docx.TableRow({children:[new docx.TableCell({columnSpan:2,children:[new docx.Paragraph({text:"Преподаватель",style:"BaseStyle",alignment:docx.AlignmentType.LEFT,})],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(80),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(5),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(30),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(5),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[new docx.Paragraph({text:element.supervisor,style:"BaseStyle",alignment:docx.AlignmentType.CENTER,})],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(50),type:docx.WidthType.DXA,},})]}),new docx.TableRow({children:[new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},columnSpan:2,width:{size:docx.convertMillimetersToTwip(80),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(5),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[new docx.Paragraph({text:"подпись, дата",style:"BaseTinyStyle",alignment:docx.AlignmentType.CENTER,verticalAlign:docx.VerticalAlign.TOP,}),],borders:{top:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(30),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(5),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[new docx.Paragraph({text:"инициалы, фамилия",style:"BaseTinyStyleStyle",alignment:docx.AlignmentType.CENTER,verticalAlign:docx.VerticalAlign.TOP,})],borders:{top:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(50),type:docx.WidthType.DXA,},})]}),new docx.TableRow({children:[new docx.TableCell({children:[new docx.Paragraph({text:"Студент",style:"BaseStyle",alignment:docx.AlignmentType.LEFT,})],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(25),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[new docx.Paragraph({text:element.groupRecordBook,style:"BaseStyle",alignment:docx.AlignmentType.CENTER,})],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(55),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(5),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(30),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(5),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[new docx.Paragraph({text:element.student,style:"BaseStyle",alignment:docx.AlignmentType.CENTER,})],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(50),type:docx.WidthType.DXA,},})]}),new docx.TableRow({children:[new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(25),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[new docx.Paragraph({text:"номер группы, зачётной книжки",style:"BaseTinyStyle",alignment:docx.AlignmentType.CENTER,verticalAlign:docx.VerticalAlign.TOP,}),],borders:{top:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(55),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(5),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[new docx.Paragraph({text:"подпись, дата",style:"BaseTinyStyle",alignment:docx.AlignmentType.CENTER,verticalAlign:docx.VerticalAlign.TOP,}),],borders:{top:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(30),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[],borders:{top:{style:docx.BorderStyle.NONE,size:1,color:"white",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(5),type:docx.WidthType.DXA,},}),new docx.TableCell({children:[new docx.Paragraph({text:"инициалы, фамилия",style:"BaseTinyStyleStyle",alignment:docx.AlignmentType.CENTER,verticalAlign:docx.VerticalAlign.TOP,})],borders:{top:{style:docx.BorderStyle.SINGLE,size:1,color:"black",},bottom:{style:docx.BorderStyle.NONE,size:1,color:"white",},left:{style:docx.BorderStyle.NONE,size:1,color:"white",},right:{style:docx.BorderStyle.NONE,size:1,color:"white",},},width:{size:docx.convertMillimetersToTwip(50),type:docx.WidthType.DXA,},})]}),]})).
        concat(new docx.Paragraph({spacing: {line: 340}, alignment: docx.AlignmentType.CENTER, style: 'BaseStyle', children: [new docx.TextRun({text:'', break: 2})]})).
        concat(new docx.Paragraph({text: `Красноярск ${(new Date()).getFullYear()}`, style: "BaseStyle", alignment: docx.AlignmentType.CENTER}));
}

function generateReferatTitle(title, element){
    let paragraphs = [];
    return paragraphs;
}
