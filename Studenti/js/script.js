function person (firstName, lastName, age) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
}

function student (firstName, lastName, age, index) {
	var newStudent = new person(firstName, lastName, age);
	newStudent.index = index;

	return newStudent;
}
/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * * * * * * * * * * * * * * * * */

var Pagination = {

    code: '',

    // --------------------
    // Utility
    // --------------------

    // converting initialize data
    Extend: function(data) {
        data = data || {};
        Pagination.size = data.size || numPages();
        Pagination.page = data.page || 1;
        Pagination.step = data.step || 1;
    },

    // add pages by number (from [s] to [f])
    Add: function(s, f) {
        for (var i = s; i < f; i++) {
            Pagination.code += '<a>' + i + '</a>';
        }
    },

    // add last page with separator
    Last: function() {
        Pagination.code += '<i>...</i><a>' + Pagination.size + '</a>';
    },

    // add first page with separator
    First: function() {
        Pagination.code += '<a>1</a><i>...</i>';
    },



    // --------------------
    // Handlers
    // --------------------

    // change page
    Click: function() {
        Pagination.page = +this.innerHTML;
        Pagination.Start();
    },

    // previous page
    Prev: function() {
        Pagination.page--;
        if (Pagination.page < 1) {
            Pagination.page = 1;
        }
        Pagination.Start();
    },

    // next page
    Next: function() {
        Pagination.page++;
        if (Pagination.page > Pagination.size) {
            Pagination.page = Pagination.size;
        }
        Pagination.Start();
    },



    // --------------------
    // Script
    // --------------------

    // binding pages
    Bind: function() {
        var a = Pagination.e.getElementsByTagName('a');
        for (var i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === Pagination.page) a[i].className = 'current';
            a[i].addEventListener('click', Pagination.Click, false);
        }
    },

    // write pagination
    Finish: function() {
        Pagination.e.innerHTML = Pagination.code;
        Pagination.code = '';
        Pagination.Bind();
        addStudnetsToTable(Pagination.page, recordsPerPage, arr);
    },

    // find pagination type
    Start: function() {
        if (Pagination.size < Pagination.step * 2 + 6) {
            Pagination.Add(1, Pagination.size + 1);
        }
        else if (Pagination.page < Pagination.step * 2 + 1) {
            Pagination.Add(1, Pagination.step * 2 + 4);
            Pagination.Last();
        }
        else if (Pagination.page > Pagination.size - Pagination.step * 2) {
            Pagination.First();
            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
        }
        else {
            Pagination.First();
            Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
            Pagination.Last();
        }

        Pagination.Finish();
    },



    // --------------------
    // Initialization
    // --------------------

    // binding buttons
    Buttons: function(e) {
        var nav = e.getElementsByTagName('a');
        nav[0].addEventListener('click', Pagination.Prev, false);
        nav[1].addEventListener('click', Pagination.Next, false);
    },

    // create skeleton
    Create: function(e) {

        var html = [
            '<a>&#9668;</a>', // previous button
            '<span></span>',  // pagination container
            '<a>&#9658;</a>'  // next button
        ];

        e.innerHTML = html.join('');
        Pagination.e = e.getElementsByTagName('span')[0];
        Pagination.Buttons(e);
    },

    // init
    Init: function(e, data) {
        Pagination.Extend(data);
        Pagination.Create(e);
        Pagination.Start();
    }
};



/* * * * * * * * * * * * * * * * *
* Initialization
* * * * * * * * * * * * * * * * */

var init = function() {
    Pagination.Init(document.getElementById('pagination'), {
        size: 2, // pages size
        page: 1,  // selected page
        step: 1   // pages before and after current
    });
};

document.addEventListener('DOMContentLoaded', init, false);
///////////////////////////////////////////////////////////////

function addStudnetsToTable (page, recordsPerPage, arr) {
	var tbody = document.getElementById("1");
	var condition = 0;
	tbody.innerHTML = '';

	console.log("Usao sam u addStudentsToTable ");
	for(var i = (page-1) * recordsPerPage; i < (page * recordsPerPage) && i < arr.length; i++){
		var element = document.createElement("TR");
		for(var j of Object.keys(arr[i])){
			var row = document.createElement("TD");
			var text = document.createTextNode(arr[i][j]);
		    console.log(i + " => " + arr[i]);
			row.appendChild(text);
			element.appendChild(row);
		}
		var row = document.createElement("TD");
		var deleteRow = document.createElement("TD");

		deleteRow.classList.add('delete')
		deleteRow.dataset.deleteId = i;
		var deleteText = document.createTextNode('delete');
		deleteRow.appendChild(deleteText);

		row.classList.add('edit');
		row.dataset.editId = i;
		var text = document.createTextNode('edit');
		row.appendChild(text);

		element.appendChild(row);
		element.appendChild(deleteRow);
		    
		tbody.appendChild(element);
	}

	Pagination.size = numPages();

	deletes = document.getElementsByClassName('delete')
	for(var i=0;i<deletes.length;i++) {
		deletes[i].addEventListener('click',function(){

			currentI = this.dataset.deleteId;
			deleteStudent(currentI);
		});
	}

	edits = document.getElementsByClassName('edit')
	for(var i=0;i<edits.length;i++) {
		edits[i].addEventListener('click',function(){

			editFormFillField(arr[this.dataset.editId]);
			currentI = this.dataset.editId;
		});
	}
}

function deleteStudent (currentI) {

	var firstName = arr[currentI].firstName;
	var lastName = arr[currentI].lastName;

	if(confirm("Delete user: "+ firstName +" " + lastName)) arr.splice(currentI , 1)

	addStudnetsToTable();
	Pagination.Start();
}

function addStudnet (form) {
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var age = document.getElementById("age").value;
	var index = document.getElementById("index").value;

	if(firstName.length == 0 || lastName.length == 0 || age.length == 0 || index.length == 0){
		alert("Empty field");

		return false;
	}

	if(!indexRegex.test(index)){
		alert("Index is not valid");

		return;
	}

	var newStudent = student(firstName, lastName, age , index);

	arr.push(newStudent);
	addStudnetsToTable(1,  recordsPerPage, arr);
	
	Pagination.Start();
}

function editFormFillField (student) {
	
	for(var x in student){
		document.getElementById('edit'+x).value = student[x];
	}
}

function editFormSaveData () {
	var firstName = document.getElementById("editfirstName").value;
	var lastName = document.getElementById("editlastName").value;
	var age = document.getElementById("editage").value;
	var index = document.getElementById("editindex").value;

	var niz = [];
	niz.push(firstName,lastName,age,index);

	if(!indexRegex.test(index)){
		alert("Index is not valid");

		return;
	}

	var attributesCount = 0;
	for(var j of Object.keys(arr[currentI])){

		arr[currentI][j] = niz[attributesCount];
		attributesCount++;
	}

	attributesCount = 0;

	addStudnetsToTable();
	Pagination.Start();
}

function resetForm () {
	document.getElementById("myForm").reset();
}

function listOfAllStudents () {
	var a = arr.length;

	for(var i=0; i<a; i++){
		for(var j of Object.keys(arr[i])){
			console.log(i + " => "+ arr[i] + " j -> "+j + " arr[j] - > "+arr[i][j]);
		}
	}
}

function changeNumberOfRecords () {
	recordsPerPage = document.getElementById("recordsPerPage").value;
}

function allRecordsInOnePage () {
	recordsPerPage = arr.length;
}

function numPages(){
    return Math.ceil(arr.length / recordsPerPage);
}

function searchTable(){
	 var radios = document.getElementsByName('search');
	 var attribute;
	 var searchText = document.getElementById("searchInput").value;
	 var searchRegex = new RegExp(""+searchText, "i");
	 var searchArr = [];
	 var count = 0;

	for (var i = 0, length = radios.length; i < length; i++){
 		
 		if (radios[i].checked){
  			attribute = radios[i].value;
  			break;
 		}
	}
	for(var i = 0; i < arr.length; i++){
		var a = arr[i][attribute];

		if(searchRegex.test(a)){
			searchArr.push(arr[i]);
		}
	}

	addStudnetsToTable(1, recordsPerPage, searchArr);
}

function addSortLisener () {
	var theadElem = document.getElementsByClassName("sort");
 	
 	for(var i = 0;i < theadElem.length;i++) {
		theadElem[i].addEventListener("click", objSort);
 	}
}

 function objSort(){
	
	 if(sortField == '') {
		 sortField = this.dataset.name;
	 }
	 else if( sortField != this.dataset.name) {
		 sortField = this.dataset.name;
		 sortFlag = 1;
	 }
	 
	 var byFirstName = arr.slice(0);
	 byFirstName.sort(function(a,b){
	 	if(isNaN(a[sortField])){
	 		var x = a[sortField].toLowerCase();
         	var y = b[sortField].toLowerCase();
	 	}else{
	 		var x = a[sortField];
         	var y = b[sortField];
	 	}
         return sortFlag * (x < y ? -1 : x > y ? 1 : 0);
	 });

	addStudnetsToTable(1, recordsPerPage, byFirstName);

	 sortFlag *= -1;
	  
}

var sortFlag = 1;
var sortField = '';
var currentI = -1;
var arr = [];
var recordsPerPage = 2;
var indexRegex = /^[A-Z]{2}(-)[0-9]{2,10}(-)[0-9]{2,3}$/;
var seki = student('Stefan', 'Sekeres', 25, 'RN-33-13');
var somi = student('Milos', 'Brankovic', 30, 'RN-55-14');
var rajko = student('Rajko', 'Jegdic', 22, 'RN-55-14');

arr.push(seki);
arr.push(somi);
arr.push(rajko);

addStudnetsToTable();
addSortLisener();


