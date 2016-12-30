/**
 * Created by jeffersonvivanco on 12/12/16.
 */

document.addEventListener('DOMContentLoaded', function (evt) {
    var homesection = document.getElementById('homesection');
    var agendasection = document.getElementById('agendasection');
    var notebooksection = document.getElementById('notebooksection');
    var hometab = document.getElementById('hometab');
    var agendatab = document.getElementById('agendatab');
    var notebooktab = document.getElementById('notebooktab');
    var addReminder = document.getElementById('addReminder');
    var reminderList = document.getElementById('reminderList');
    var reminderListForm = document.getElementById('reminderListForm');
    var addReminderModal = document.getElementById('addReminderModal');
    var modalAddBtn = document.getElementById('modalAddBtn');
    var doneBtn = document.getElementById('doneBtn');
    var tableNotebooks = document.getElementById('notebooks');
    var addNotebook = document.getElementById('addNotebook');
    var addNotebookModal = document.getElementById('addNotebookModal');
    var noteModalAddBtn = document.getElementById('noteModalAddBtn');
    var mynotebooks = document.getElementById('mynotebooks');
    var mydocuments = document.getElementById('mydocuments');
    var backToNotebooks = document.getElementById('backToNotebooks');
    var docModalAddBtn = document.getElementById('docModalAddBtn');

    /* Adding a new document to a notebook or getting a new blank document */
    var customButton2 = document.getElementById('custom-button2');
    var addDocumentModal = document.getElementById('addDocumentModal');
    docModalAddBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        var noteName = document.getElementById('noteName').value;
        var docName = document.getElementById('documentName').value;
        var req = new XMLHttpRequest(),
                      url = 'https://schoolbook2017.herokuapp.com/api/save-doc/';
//             url = 'http://localhost:3000/api/save-doc/';
        req.open('post',url, true);
        req.setRequestHeader('Content-Type','application/json');
        var quillCon = quill.getContents();
        quillCon.notebookname = noteName;
        quillCon.documentname = docName;
        var quillContents = JSON.stringify(quillCon);
        console.log(quillContents);
        req.send(quillContents);
        addDocumentModal.style.display = "none";
    });
    customButton2.addEventListener('click', function (evt) {
        addDocumentModal.style.display = 'block';
    });
    var toolbarOptions = ['save','bold', 'italic', 'underline', 'strike',{'background':[]}];
    var quill = new Quill('#editor', {

        modules: {
            toolbar: '#toolbar'
        },
        theme: 'snow'
    });
    var customButton = document.getElementById('custom-button');
    customButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        document.getElementById('editor').firstElementChild.textContent='';
    });
    /*--------------------------Load initial reminders------------------------------------ */
    var req = new XMLHttpRequest(),
                   url = 'https://schoolbook2017.herokuapp.com/api/reminders';
        // url = 'http://localhost:3000/api/reminders';
    req.open('GET',url, true);
    req.addEventListener('load', function () {
        if(req.status >= 200 && req.status < 400){
            var data  = JSON.parse(req.responseText);
            reminderList.innerHTML = '';
            if(data.length > 0){
                reminderListForm.classList.toggle('hide');
                data.forEach(function (reminder) {
                    var li = document.createElement('li');
                    li.textContent = reminder.reminder+' '+reminder.date+' ';
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'checkedReminders';
                    checkbox.value = reminder._id;
                    li.appendChild(checkbox);
                    reminderList.appendChild(li);
                });
            }
            else{
                //do nothing
            }
        }
    });
    req.send();

    /*------------------------Load initial notebooks---------------------------------------*/
    backToNotebooks.addEventListener('click', function (evt) {
        if(mynotebooks.classList.contains('hide')){
            mynotebooks.classList.toggle('hide');
        }
        if(!mydocuments.classList.contains('hide')){
            mydocuments.classList.toggle('hide');
        }
    });
    var clickedOnANotebook = function (evt) {
        var notebookname = this['data-notebook'];
        if(!mynotebooks.classList.contains('hide')){
            mynotebooks.classList.toggle('hide');
        }
        if(mydocuments.classList.contains('hide')){
            mydocuments.classList.toggle('hide');
        }
        var listOfDoc= document.getElementById('listOfDocs');
        listOfDoc.innerHTML = '';
        var req = new XMLHttpRequest(),
                       url = 'https://schoolbook2017.herokuapp.com/api/documents';
            // url = 'http://localhost:3000/api/documents';
        req.open('post', url, true);
        req.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
        req.send('notebook='+notebookname);
        req.addEventListener('load', function () {
            if(req.status >= 200 && req.status<400){
                var documents = JSON.parse(req.responseText);
                if(documents.length > 0){
                    documents.forEach(function (document2) {
                        var li = document.createElement('li');
                        li.textContent = document2.documentname;
                        li.addEventListener('click', function () {
                            var toWrite = document.getElementById('editor').firstElementChild;
                            toWrite.textContent = document2.data.ops[0]['insert'];

                        });
                        listOfDoc.appendChild(li);
                    });
                }
            }
        });
    };
    var req2  = new XMLHttpRequest(),
                   url2 = 'https://schoolbook2017.herokuapp.com/api/notebooks';
        // url2 = 'http://localhost:3000/api/notebooks';
    req2.open('GET',url2,true);
    req2.addEventListener('load', function () {
        if(req2.status >= 200 && req2.status < 400){
            var data = JSON.parse(req2.responseText);

            if(data.length > 0){

                data.forEach(function (notebook) {
                    var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    td.textContent = notebook.name;
                    var td2 = document.createElement('td');
                    td2.textContent = notebook.year;
                    var td3 = document.createElement('td');
                    var alink = document.createElement('button');
                    alink.id = "moreInfo";
                    alink.textContent = "more";
                    alink['data-notebook'] = notebook.name;
                    alink.addEventListener('click',clickedOnANotebook);
                    td3.appendChild(alink);
                    tr.appendChild(td);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tableNotebooks.appendChild(tr);
                });
            }
            else{
                //do nothing
            }
        }
    });
    req2.send();

    //---------------Event Listeners for buttons and tabs -----------------------//
    doneBtn.addEventListener('click',function (evt) {
        evt.preventDefault();
        var req = new XMLHttpRequest();
              req.open('post','https://schoolbook2017.herokuapp.com/api/delete-reminders', true);
        // req.open('post','http://localhost:3000/api/delete-reminders', true);
        req.setRequestHeader('Content-Type','application/json');
        var checkedInputs = document.getElementsByName('checkedReminders');
        var arrayOfIdCheckedInputs = [];
        for(var i=0; i<checkedInputs.length; i++){
            if(checkedInputs[i].checked){
                arrayOfIdCheckedInputs.push(checkedInputs[i].value);
            }
        }
        console.log(arrayOfIdCheckedInputs);
        var jsonStringInputs = JSON.stringify(arrayOfIdCheckedInputs);
        req.send(jsonStringInputs);
        req.addEventListener('load',function () {
            if(req.status >= 200 && req.status<400){
                var remainingRems = JSON.parse(req.responseText);
                reminderList.innerHTML = '';
                if(remainingRems.length > 0){
                    remainingRems.forEach(function (reminder) {
                        var li = document.createElement('li');
                        li.textContent = reminder.reminder+' '+reminder.date+' ';
                        var checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.name = 'checkedReminders';
                        checkbox.value = reminder._id;
                        li.appendChild(checkbox);
                        reminderList.appendChild(li);
                    });
                }
                else{
                    reminderListForm.classList.toggle('hide');
                }
            }
        });

    });
    agendatab.addEventListener('click',function (evt) {

        if(!agendatab.classList.contains('active')){
            agendatab.classList.toggle('active');
        }
        if(hometab.classList.contains('active')){
            hometab.classList.toggle('active');
        }
        if(notebooktab.classList.contains('active')){
            notebooktab.classList.toggle('active');
        }
        if(agendasection.classList.contains('hide')){
            agendasection.classList.toggle('hide');
        }
        if(!homesection.classList.contains('hide')){
            homesection.classList.toggle('hide');
        }
        if(!notebooksection.classList.contains('hide')){
            notebooksection.classList.toggle('hide');
        }
    });

    hometab.addEventListener('click', function (evt) {
        if(!hometab.classList.contains('active')){
            hometab.classList.toggle('active');
        }
        if(agendatab.classList.contains('active')){
            agendatab.classList.toggle('active');
        }
        if(notebooktab.classList.contains('active')){
            notebooktab.classList.toggle('active');
        }
        if(homesection.classList.contains('hide')){
            homesection.classList.toggle('hide');
        }
        if(!agendasection.classList.contains('hide')){
            agendasection.classList.toggle('hide');
        }
        if(!notebooksection.classList.contains('hide')){
            notebooksection.classList.toggle('hide');
        }

    });
    notebooktab.addEventListener('click', function (evt) {
        if(!notebooktab.classList.contains('active')){
            notebooktab.classList.toggle('active');
        }
        if(agendatab.classList.contains('active')){
            agendatab.classList.toggle('active');
        }
        if(hometab.classList.contains('active')){
            hometab.classList.toggle('active');
        }
        if(notebooksection.classList.contains('hide')){
            notebooksection.classList.toggle('hide');
        }
        if(!homesection.classList.contains('hide')){
            homesection.classList.toggle('hide');
        }
        if(!agendasection.classList.contains('hide')){
            agendasection.classList.toggle('hide');
        }

    });


    noteModalAddBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        var tr = document.createElement('tr');
        var name = document.getElementById('notebookName').value;
        var year = document.getElementById('notebookYear').value;

        var req = new XMLHttpRequest();
               req.open('post','https://schoolbook2017.herokuapp.com/api/notebooks/add', true);
        // req.open('post', 'http://localhost:3000/api/notebooks/add', true);
        req.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
        req.send('name='+name+'&year='+year);
        req.addEventListener('load', function () {
            if(req.status >= 200 && req.status<400){
                var id = JSON.parse(req.responseText);
                var td1 = document.createElement('td');
                td1.textContent = name;
                var td2 = document.createElement('td');
                td2.textContent = year;
                var td3 = document.createElement('td');
                var alink = document.createElement('button');
                alink.id = "moreInfo";
                alink.textContent = "more";
                alink.addEventListener('click',clickedOnANotebook);
                td3.appendChild(alink);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tableNotebooks.appendChild(tr);

            }
        });
        addNotebookModal.style.display = "none";
    });
    modalAddBtn.addEventListener('click',function (evt) {
        evt.preventDefault();

        var li = document.createElement('li');
        var date = document.getElementById('userReminderDate').value;
        var reminder = document.getElementById('userReminderText').value;

        var req = new XMLHttpRequest();
               req.open('post','https://schoolbook2017.herokuapp.com/api/reminders/add', true);
        // req.open('post','http://localhost:3000/api/reminders/add', true);
        req.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
        req.send('reminder='+reminder+'&date='+date);
        req.addEventListener('load',function () {
            if(req.status >= 200 && req.status<400){
                if(reminderList.childNodes.length === 0){
                    reminderListForm.classList.toggle('hide');
                }
                var id = JSON.parse(req.responseText);
                li.textContent = reminder+' '+date+' ';
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'checkedReminders';
                checkbox.value = id.id;
                li.appendChild(checkbox);
                reminderList.appendChild(li);

            }
        });
        addReminderModal.style.display = "none";
    });
    addReminder.addEventListener('click', function (evt) {
        addReminderModal.style.display = 'block';
    });
    addNotebook.addEventListener('click', function (evt) {
        addNotebookModal.style.display = 'block';
    });

    //--------------------------------------------------------------------------------//

    /* When the user clicks anywhere outside of the modal, close it */
    window.onclick = function(event) {
        if (event.target == addReminderModal) {
            addReminderModal.style.display = "none";
        }
        if(event.target == addNotebookModal){
            addNotebookModal.style.display = "none";
        }
        if(event.target == addDocumentModal){
            addDocumentModal.style.display = "none";
        }
    };
    //------------------------------------------------------------//
});
