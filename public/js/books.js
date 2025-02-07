(function(window) {
    window.bookOperations = {
        addResource: function() {
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
            if (parseInt(jsonData.shelf_no) <= 0) {
                document.getElementById("message").innerHTML = 'Shelf number should be a positive number!';
                document.getElementById("message").setAttribute("class", "text-danger");
                return;
            }
            if (jsonData.name.length > 255) {
                document.getElementById("message").innerHTML = 'Name is too long!';
                document.getElementById("message").setAttribute("class", "text-danger");
                return;
            }

            var request = new XMLHttpRequest();

            request.open("POST", "/add-resource", true);
            request.setRequestHeader('Content-Type', 'application/json');

            request.onload = function () {
                try {
                    response = JSON.parse(request.responseText);
                    console.log(response);

                    // Explicitly check for successful response
                    if (request.status === 201 || request.status === 200) {
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
                        document.getElementById("message").innerHTML = 'Error: ' + (response.message || 'Unknown error');
                        document.getElementById("message").setAttribute("class", "text-danger");
                    }
                } catch (error) {
                    document.getElementById("message").innerHTML = 'Processing error: ' + error.message;
                    document.getElementById("message").setAttribute("class", "text-danger");
                }
            };

            request.onerror = function() {
                document.getElementById("message").innerHTML = 'Network error occurred!';
                document.getElementById("message").setAttribute("class", "text-danger");
            };

            request.send(JSON.stringify(jsonData));
        },

        viewResources: function() {
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
                            '<button type="button" class="btn btn-warning" onclick="bookOperations.editResource(\'' + JSON.stringify(response[i]).replaceAll('\"', '&quot;') + '\')">Edit </button> ' + 
                            '<button type="button" class="btn btn-danger" onclick="bookOperations.deleteResource(' + response[i].id + ')"> Delete</button>' + 
                        '</td>' +
                    '</tr>';
                }

                document.getElementById('tableContent').innerHTML = html;
            };

            request.send();
        },
    };
})(window);