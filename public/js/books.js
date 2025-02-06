function addResource() {
    var response = "";

    var jsonData = new Object();
    jsonData.name = document.getElementById("name").value;
    jsonData.shelf_no = document.getElementById("shelf_no").value;
    jsonData.category = document.getElementById("category").value;
    jsonData.author = document.getElementById("author").value;

    // Validation checks
    if (jsonData.name == "") {
        document.getElementById("message").innerHTML = 'Name is required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }
    if (jsonData.shelf_no == "" || isNaN(jsonData.shelf_no)) {
        document.getElementById("message").innerHTML = 'Shelf number must be a valid number!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }
    if (jsonData.category == "") {
        document.getElementById("message").innerHTML = 'Category is required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }
    if (jsonData.author == "") {
        document.getElementById("message").innerHTML = 'Author is required!';
        document.getElementById("message").setAttribute("class", "text-danger");
        return;
    }

    var request = new XMLHttpRequest();

    request.open("POST", "/add-resource", true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        console.log(response);

        if (response.message == undefined) {
            // Success message and clear fields
            document.getElementById("message").innerHTML = 'Added Resource: ' + jsonData.name + '!';
            document.getElementById("message").setAttribute("class", "text-success");

            // Clear the fields after successful submission
            document.getElementById("name").value = "";
            document.getElementById("shelf_no").value = "";
            document.getElementById("category").value = "";
            document.getElementById("author").value = "";
            
            // Redirect to index.html after a successful add
            window.location.href = 'index.html';
        } else {
            // Error message
            document.getElementById("message").innerHTML = 'Unable to add resource!';
            document.getElementById("message").setAttribute("class", "text-danger");
        }
    };

    request.send(JSON.stringify(jsonData));
}

function viewResources() {
    var response = '';
    var request = new XMLHttpRequest();

    request.open('GET', '/view-resources', true);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        response = JSON.parse(request.responseText);
        
        var html = '';
        for (var i = 0; i < response.length; i++) {
            html += '<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + response[i].name + '</td>' +
                '<td>' + response[i].shelf_no + '</td>' +
                '<td>' + response[i].category + '</td>' +
                '<td>' + response[i].author + '</td>' +
                '<td>' +
                    '<button type="button" class="btn btn-warning" onclick="editResource(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') + '\')">Edit </button> ' + 
                    '<button type="button" class="btn btn-danger" onclick="deleteResource(' + response[i].id + ')"> Delete</button>' + 
                '</td>' +
            '</tr>';
        }

        document.getElementById('tableContent').innerHTML = html;
    };

    request.send();
}
