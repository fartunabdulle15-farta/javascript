const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

// Load students when page opens
displayStudents();

studentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("studentId").value.trim();
    const name = document.getElementById("studentName").value.trim();
    const age = parseInt(document.getElementById("studentAge").value);
    const course = document.getElementById("studentCourse").value.trim();

    // Validation
    if (!validateStudent(id, name, age, course)) {
        return;
    }

    const student = { id, name, age, course };

    if (editIndex === -1) {
        students.push(student);
        showMessage("Student Registered Successfully", "success");
    } else {
        students[editIndex] = student;
        editIndex = -1;
        showMessage("Student Updated Successfully", "success");
    }

    saveStudents();
    displayStudents();
    studentForm.reset();
});

function validateStudent(id, name, age, course) {

    // Student ID
    if (id.length < 3) {
        showMessage("Student ID must be at least 3 characters.", "error");
        return false;
    }

    // Duplicate IDs
    const duplicate = students.find(
        (student, index) =>
            student.id === id && index !== editIndex
    );

    if (duplicate) {
        showMessage("Student ID already exists.", "error");
        return false;
    }

    // Name validation
    const nameRegex = /^[A-Za-z ]+$/;

    if (!nameRegex.test(name)) {
        showMessage("Name should contain letters only.", "error");
        return false;
    }

    if (name.length < 3) {
        showMessage("Name must be at least 3 characters.", "error");
        return false;
    }

    // Age validation
    if (age < 16 || age > 100) {
        showMessage("Age must be between 16 and 100.", "error");
        return false;
    }

    // Course validation
    if (course.length < 2) {
        showMessage("Course name is too short.", "error");
        return false;
    }

    return true;
}

function displayStudents() {

    studentTableBody.innerHTML = "";

    students.forEach((student, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>
                <button onclick="editStudent(${index})">
                    Edit
                </button>

                <button onclick="deleteStudent(${index})">
                    Delete
                </button>
            </td>
        `;

        studentTableBody.appendChild(row);
    });

    updateStatistics();
}

function editStudent(index) {

    const student = students[index];

    document.getElementById("studentId").value =
        student.id;

    document.getElementById("studentName").value =
        student.name;

    document.getElementById("studentAge").value =
        student.age;

    document.getElementById("studentCourse").value =
        student.course;

    editIndex = index;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function deleteStudent(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {
        students.splice(index, 1);

        saveStudents();
        displayStudents();

        showMessage("Student Deleted Successfully", "success");
    }
}

function saveStudents() {
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}

function showMessage(message, type) {

    let msg = document.getElementById("message");

    if (!msg) {
        msg = document.createElement("div");
        msg.id = "message";
        document.querySelector(".container")
            .prepend(msg);
    }

    msg.textContent = message;

    msg.className = type;

    setTimeout(() => {
        msg.textContent = "";
        msg.className = "";
    }, 3000);
}

function updateStatistics() {

    let stats = document.getElementById("stats");

    if (!stats) {
        stats = document.createElement("div");
        stats.id = "stats";
        document.querySelector(".container")
            .appendChild(stats);
    }

    const totalStudents = students.length;

    const averageAge =
        students.length > 0
            ? (
                  students.reduce(
                      (sum, student) =>
                          sum + Number(student.age),
                      0
                  ) / students.length
              ).toFixed(1)
            : 0;

    stats.innerHTML = `
        <h3>Statistics</h3>
        <p>Total Students: ${totalStudents}</p>
        <p>Average Age: ${averageAge}</p>
    `;
}

// Search functionality
function searchStudents() {

    const keyword = document
        .getElementById("search")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll("tbody tr");

    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();

        row.style.display =
            text.includes(keyword)
                ? ""
                : "none";
    });
}

// Sort by Name
function sortStudents() {

    students.sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    saveStudents();
    displayStudents();
}

// Export CSV
function exportCSV() {

    let csv =
        "ID,Name,Age,Course\n";

    students.forEach(student => {
        csv += `${student.id},${student.name},${student.age},${student.course}\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download = "students.csv";

    a.click();
}

// Real-time Name Validation
document
    .getElementById("studentName")
    .addEventListener("input", function () {

        const regex = /^[A-Za-z ]*$/;

        if (!regex.test(this.value)) {
            this.style.border =
                "2px solid red";
        } else {
            this.style.border =
                "2px solid green";
        }
    });