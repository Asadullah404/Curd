   // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
        import { getDatabase, ref, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDi1nm_ZbI5rwDvxDAcqVw5YUnDRbn3qB0",
            authDomain: "project1-b2bef.firebaseapp.com",
            projectId: "project1-b2bef",
            storageBucket: "project1-b2bef.appspot.com",
            messagingSenderId: "201961798602",
            appId: "1:201961798602:web:242bcb79072a0adebd2d33",
            measurementId: "G-4V3BV8D1R1"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        // Get a reference to the database service
        const db = getDatabase(app);

        // Function to save student data
        function saveStudent(name, fatherName, rollNumber) {
            set(ref(db, 'students/' + rollNumber), {
                name: name,
                fatherName: fatherName,
                rollNumber: rollNumber
            });
            alert("Data saved successfully!");
            document.getElementById("studentForm").reset();
            displayData();
        }

        // Function to display all student data
        function displayData() {
            const dataContainer = document.getElementById("dataContainer");
            dataContainer.innerHTML = "";
            const studentsRef = ref(db, 'students');
            onValue(studentsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    let html = `<table>
                                <tr>
                                    <th>Name</th>
                                    <th>Father Name</th>
                                    <th>Roll Number</th>
                                    <th>Actions</th>
                                </tr>`;
                    for (let rollNumber in data) {
                        html += `<tr>
                                    <td>${data[rollNumber].name}</td>
                                    <td>${data[rollNumber].fatherName}</td>
                                    <td>${data[rollNumber].rollNumber}</td>
                                    <td>
                                        <span class="edit" data-roll="${rollNumber}">Edit</span> | 
                                        <span class="delete" data-roll="${rollNumber}">Delete</span>
                                    </td>
                                 </tr>`;
                    }
                    html += `</table>`;
                    dataContainer.innerHTML = html;

                    // Add event listeners for edit and delete
                    document.querySelectorAll(".edit").forEach(button => {
                        button.addEventListener('click', function () {
                            editData(this.getAttribute("data-roll"));
                        });
                    });
                    document.querySelectorAll(".delete").forEach(button => {
                        button.addEventListener('click', function () {
                            deleteData(this.getAttribute("data-roll"));
                        });
                    });
                } else {
                    dataContainer.innerHTML = "<p>No data available</p>";
                }
            });
        }

        // Function to edit student data
        function editData(rollNumber) {
            const studentRef = ref(db, 'students/' + rollNumber);
            get(studentRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    document.getElementById("name").value = data.name;
                    document.getElementById("fatherName").value = data.fatherName;
                    document.getElementById("rollNumber").value = data.rollNumber;
                    document.getElementById("submit").value = "Update";
                    document.getElementById("submit").setAttribute("data-edit", rollNumber);
                }
            });
        }

        // Function to update student data
        function updateData(name, fatherName, rollNumber) {
            const studentRef = ref(db, 'students/' + rollNumber);
            update(studentRef, {
                name: name,
                fatherName: fatherName
            });
            alert("Data updated successfully!");
            document.getElementById("studentForm").reset();
            document.getElementById("submit").value = "Submit";
            document.getElementById("submit").removeAttribute("data-edit");
            displayData();
        }

        // Function to delete student data
        function deleteData(rollNumber) {
            const studentRef = ref(db, 'students/' + rollNumber);
            remove(studentRef);
            alert("Data deleted successfully!");
            displayData();
        }

        // Add event listener to the form
        document.getElementById("submit").addEventListener('click', function (e) {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const fatherName = document.getElementById("fatherName").value;
            const rollNumber = document.getElementById("rollNumber").value;

            if (this.getAttribute("data-edit")) {
                updateData(name, fatherName, rollNumber);
            } else {
                saveStudent(name, fatherName, rollNumber);
            }
        });

        // Display data on page load
        displayData();