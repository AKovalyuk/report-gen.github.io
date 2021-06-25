function paragraph_update_cache(){
    let time = performance.now();
    event.path[0].parentElement.dataset.cache = line_divide('\t' + event.path[0].value, TimesNewRoman, 14, page_width);
    console.log(performance.now() - time);
}

function show_buttons(e){
    if(e == undefined){
        e = event.target;
    }
    if(!e.matches('.insert') ){
        return;
    }
    let sections = 0, editor_elements = 0, new_html = '';
    for(let el of e.parentElement.children){
        if(el.matches('.section')){
            sections += 1;
        }
        else{
            if(el.matches(".editor-element")){
                editor_elements += 1;
            }
        }
    }
    if(sections == 0){
        new_html += button_add_paragraph + button_add_table + button_add_code_snippet + 
        button_add_formula + button_add_image + button_add_enumeration;
    }
    if(editor_elements == 0){
        let section_level = 0, el = e;
        while(el.nodeName != 'HTML'){
            if(el.className == 'section'){
                section_level += 1;
            }
            el = el.parentElement;
        }
        if(section_level < 4 && !e.matches('.insert-nosections')){
            new_html += button_add_section;
        }
    }
    e.innerHTML = new_html;
}

function hide_buttons(){
    if(event.target.matches('.insert')){
        event.target.innerHTML = '';
    }
}

function add_paragraph(){
    let insert_panel = event.target.parentElement;
    insert_panel.insertAdjacentHTML('afterend', insert);
    insert_panel.insertAdjacentHTML('afterend', paragraph);
}

function add_code_snippet(){
    let insert_panel = event.target.parentElement;
    insert_panel.insertAdjacentHTML('afterend', insert);
    insert_panel.insertAdjacentHTML('afterend', code_snippet);
}

function add_enumeration(){
    let insert_panel = event.target.parentElement;
    insert_panel.insertAdjacentHTML('afterend', insert);
    insert_panel.insertAdjacentHTML('afterend', enumeration);
}

function add_image(){
    let insert_panel = event.target.parentElement;
    insert_panel.insertAdjacentHTML('afterend', insert);
    insert_panel.insertAdjacentHTML('afterend', image);
}

function add_table(){
    let insert_panel = event.target.parentElement;
    insert_panel.insertAdjacentHTML('afterend', insert);
    insert_panel.insertAdjacentHTML('afterend', table);
}

function add_formula(){
    let insert_panel = event.target.parentElement;
    insert_panel.insertAdjacentHTML('afterend', insert);
    insert_panel.insertAdjacentHTML('afterend', formula);
}

function add_section(){
    let insert_panel = event.target.parentElement;
    insert_panel.insertAdjacentHTML('afterend', insert);
    insert_panel.insertAdjacentHTML('afterend', section);
}

function change_structure_element(name){
    for(let structure_element of document.getElementsByClassName('structure-element')){
        if(structure_element.id != name){
            structure_element.hidden = true;
        }
        else{
            structure_element.hidden = false;
        }
    }
}

function dropdown_controller(){
    if(event.target.matches('.dropdown')){
        console.log(event.target);
        event.target.children[0].hidden = ! event.target.children[0].hidden;
    }
}

function reset_dropdown_name(dropdown_id){
    let dropdown = document.getElementById(dropdown_id);
    dropdown.childNodes[0].textContent = event.target.innerText;
}

function enumeration_onblur(){
    let children = event.target.parentElement.children;
    if(children[children.length - 1].value != ''){
        event.target.parentElement.insertAdjacentHTML("beforeend", enumeration_element);
    }
    for(let i = 0; i < children.length - 1; i++){
        if(children[i].value == ''){
            children[i].remove();
            break;
        }
    }
}

function on_image_load(){
    let input = event.target;
    const mimes = ["image/jpeg", "image/jpg", "image/png", ".jpg", ".jpeg", ".png"];
    if(mimes.indexOf(input.files[0].type) == -1){
        input.value = '';
    }
    let reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    reader.onload = function(){
        input.parentElement.children[0].src = reader.result;
    }
}

function on_uncorrect_image(){
    event.target.src = "";
    event.target.parentElement.children[1].value = "";
}

function remove_image(){
    event.target.parentElement.children[0].src = "";
    event.target.parentElement.children[1].value = "";
}

function open_table_editor(){
    event.target.parentElement.children[2].hidden = false;
    let widths = event.target.parentElement.children[2].children[0].dataset.widths.split(/,/);
    for(let i = 0; i < widths.length; i++){
        widths[i] = Number.parseInt(widths[i]);
    }
    set_widths(event.target.parentElement.children[2].children[0], widths);
}

function set_widths(element, widths){
    for(row of element.children){
        for(let i = 0; i < row.children.length; i++){
            row.children[i].style.width = widths[i] / 170 * row.getClientRects()[0].width;
        }
    }
}

function render_formula_preview(){
    let time = performance.now();
    let math = event.target.value;
    let node = MathJax.tex2svg(math);
    console.log(node.clientHeight, node.clientWidth);
    event.target.parentElement.children[0].remove();
    event.target.parentElement.insertAdjacentHTML('afterbegin', node.outerHTML);
    console.log(performance.now() - time);
}

function escape_table_editor(){
    event.target.parentElement.hidden = true;
}

let observer = new ResizeObserver(on_resize_table_cell);
let blocked = 1, min_size = 0.2;
let observable = null;

function on_resize_table_cell(entry){
    if(blocked){
        blocked = 0;
        return;
    }
    let a = 0;
    for(let node of entry[0].target.parentElement.children){
        if(node != entry[0].target){
            node.style.height = entry[0].contentBoxSize[0].blockSize + 'px';
            a++;
        }
    }
    console.log(a);
    let index = -1;
    for(let i = 0; i < entry[0].target.parentElement.children.length; i++){
        if(entry[0].target.parentElement.children[i] == entry[0].target){
            index = i;
            break;
        }
    }
    for(let row of entry[0].target.parentElement.parentElement.children){
        if(row.children[index] != entry[0].target){
            row.children[index].style.width = entry[0].target.style.width;
        }
    }
    let widths = [];
    for(let child of entry[0].target.parentElement.children){
        widths.push(Math.round(170 * child.getClientRects()[0].width / entry[0].target.parentElement.getClientRects()[0].width))
    }
    entry[0].target.parentElement.parentElement.dataset.widths = widths;
}

function table_cell_onmousedown(){
    observer.observe(event.target);
    observable = event.target;
    document.addEventListener('mouseup', table_cell_onmouseup);
}

function table_cell_onmouseup(){
    blocked = 1;
    observer.unobserve(observable);
    observable = null;
    document.removeEventListener('mouseup', table_cell_onmouseup);
}
