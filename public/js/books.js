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
                this.showMessage('Name is required!', 'danger');
                return;
            }
            if (jsonData.shelf_no == "" || isNaN(jsonData.shelf_no)) {
                this.showMessage('Shelf number must be a valid number!', 'danger');
                return;
            }
            if (jsonData.category == "") {
                this.showMessage('Category is required!', 'danger');
                return;
            }
            if (jsonData.author == "") {
                this.showMessage('Author is required!', 'danger');
                return;
            }
            if (parseInt(jsonData.shelf_no) <= 0) {
                this.showMessage('Shelf number should be a positive number!', 'danger');
                return;
            }
            if (jsonData.name.length > 255) {
                this.showMessage('Name is too long!', 'danger');
                return;
            }

            var request = new XMLHttpRequest();
            request.open("POST", "/add-resource", true);
            request.setRequestHeader('Content-Type', 'application/json');

            request.onload = () => {
                try {
                    response = JSON.parse(request.responseText);
                    console.log(response);

                    if (request.status === 201 || request.status === 200) {
                        this.showMessage('Added Book: ' + jsonData.name + '!', 'success');
                        this.clearForm();
                        this.viewResources();
                        
                        // Close modal after delay
                        setTimeout(() => {
                            const modal = bootstrap.Modal.getInstance(document.getElementById('resourceModal'));
                            if (modal) {
                                modal.hide();
                            }
                        }, 1500);
                    } else {
                        this.showMessage('Error: ' + (response.message || 'Unknown error'), 'danger');
                    }
                } catch (error) {
                    this.showMessage('Processing error: ' + error.message, 'danger');
                }
            };

            request.onerror = () => {
                this.showMessage('Network error occurred!', 'danger');
            };

            request.send(JSON.stringify(jsonData));
        },

        viewResources: function() {
            var request = new XMLHttpRequest();
            request.open('GET', '/view-resources', true);
            request.setRequestHeader('Content-Type', 'application/json');

            request.onload = () => {
                try {
                    const response = JSON.parse(request.responseText);
                    
                    var html = '';
                    response.forEach((book, index) => {
                        html += `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${book.name}</td>
                                <td>${book.shelf_no}</td>
                                <td><span class="badge bg-info">${book.category}</span></td>
                                <td>${book.author}</td>
                            </tr>`;
                    });

                    document.getElementById('tableContent').innerHTML = html;
                } catch (error) {
                    console.error('Error loading resources:', error);
                    this.showMessage('Error loading books', 'danger');
                }
            };

            request.onerror = () => {
                this.showMessage('Network error while loading books', 'danger');
            };

            request.send();
        },

        showMessage: function(message, type) {
            const messageElement = document.getElementById("message");
            messageElement.innerHTML = message;
            messageElement.className = `text-${type} mb-0`;
        },

        clearForm: function() {
            document.getElementById("name").value = "";
            document.getElementById("shelf_no").value = "";
            document.getElementById("category").value = "";
            document.getElementById("author").value = "";
            document.getElementById("message").innerHTML = "";
        }
    };

    // Initialize the view on page load
    document.addEventListener('DOMContentLoaded', () => {
        window.bookOperations.viewResources();
    });
})(window);