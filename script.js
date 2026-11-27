// DATA STORAGE
let patients = JSON.parse(localStorage.getItem("patients")) || [];
let doctors = JSON.parse(localStorage.getItem("doctors")) || [];
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let bills = JSON.parse(localStorage.getItem("bills")) || [];

function saveData() {
    localStorage.setItem("patients", JSON.stringify(patients));
    localStorage.setItem("doctors", JSON.stringify(doctors));
    localStorage.setItem("appointments", JSON.stringify(appointments));
    localStorage.setItem("bills", JSON.stringify(bills));
}

// SAFE TEXT DISPLAY
function safe(value) {
    return String(value).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[c]);
}

// LOGIN
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("appPage").classList.remove("hidden");
        document.getElementById("loginError").innerText = "";
        showSection("dashboard");
    } else {
        document.getElementById("loginError").innerText =
            "Invalid username or password!";
    }
});

// LOGOUT
function logout() {
    document.getElementById("appPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("loginForm").reset();
}

// SECTION NAVIGATION
function showSection(section) {
    if (section === "dashboard") dashboard();
    if (section === "patients") patientPage();
    if (section === "doctors") doctorPage();
    if (section === "appointments") appointmentPage();
    if (section === "billing") billingPage();
}

// DASHBOARD
function dashboard() {
    document.getElementById("content").innerHTML = `
        <h2>Dashboard Overview</h2>

        <div class="cards">
            <div class="card">
                <h3>Total Patients</h3>
                <h1>${patients.length}</h1>
            </div>

            <div class="card">
                <h3>Total Doctors</h3>
                <h1>${doctors.length}</h1>
            </div>

            <div class="card">
                <h3>Appointments</h3>
                <h1>${appointments.length}</h1>
            </div>

            <div class="card">
                <h3>Total Bills</h3>
                <h1>${bills.length}</h1>
            </div>
        </div>

        <div class="panel" style="margin-top:25px">
            <h2>Welcome, Admin!</h2>
            <p>Manage hospital patients, doctors, appointments and bills.</p>
        </div>
    `;
}

// PATIENT MANAGEMENT
function patientPage() {
    document.getElementById("content").innerHTML = `
        <h2>Patient Management</h2>

        <div class="panel">
            <div class="form-grid">
                <input id="pname" placeholder="Patient Name">
                <input id="page" type="number" placeholder="Age">
                <input id="pphone" placeholder="Phone Number">
                <input id="disease" placeholder="Disease">
                <button onclick="addPatient()">Add Patient</button>
            </div>
        </div>

        <div class="panel">
            <input class="search" id="psearch"
                placeholder="Search patient..."
                oninput="displayPatients()">
            <div id="patientList"></div>
        </div>
    `;

    displayPatients();
}

function addPatient() {
    let name = document.getElementById("pname").value.trim();
    let age = document.getElementById("page").value;
    let phone = document.getElementById("pphone").value.trim();
    let disease = document.getElementById("disease").value.trim();

    if (!name || !age || Number(age) < 1 || !phone || !disease) {
        alert("Please enter valid patient information!");
        return;
    }

    patients.push({ name, age, phone, disease });
    saveData();
    patientPage();
}

function displayPatients() {
    let search = document.getElementById("psearch").value.toLowerCase();

    let rows = patients.map((p, i) => ({p, i}))
        .filter(x => x.p.name.toLowerCase().includes(search))
        .map(({p, i}) => `
            <tr>
                <td>${safe(p.name)}</td>
                <td>${safe(p.age)}</td>
                <td>${safe(p.phone)}</td>
                <td>${safe(p.disease)}</td>
                <td><button class="delete"
                    onclick="deletePatient(${i})">Delete</button></td>
            </tr>
        `).join("");

    document.getElementById("patientList").innerHTML = `
        <table>
            <tr><th>Name</th><th>Age</th><th>Phone</th>
            <th>Disease</th><th>Action</th></tr>
            ${rows}
        </table>
    `;
}

function deletePatient(i) {
    if (confirm("Delete this patient?")) {
        patients.splice(i, 1);
        saveData();
        patientPage();
    }
}

// DOCTOR MANAGEMENT
function doctorPage() {
    document.getElementById("content").innerHTML = `
        <h2>Doctor Management</h2>

        <div class="panel">
            <div class="form-grid">
                <input id="dname" placeholder="Doctor Name">
                <input id="specialty" placeholder="Specialization">
                <input id="dphone" placeholder="Phone Number">
                <button onclick="addDoctor()">Add Doctor</button>
            </div>
        </div>

        <div class="panel" id="doctorList"></div>
    `;

    displayDoctors();
}

function addDoctor() {
    let name = document.getElementById("dname").value.trim();
    let specialty = document.getElementById("specialty").value.trim();
    let phone = document.getElementById("dphone").value.trim();

    if (!name || !specialty || !phone) {
        alert("Enter all doctor information!");
        return;
    }

    doctors.push({ name, specialty, phone });
    saveData();
    doctorPage();
}

function displayDoctors() {
    document.getElementById("doctorList").innerHTML = `
        <table>
            <tr><th>Name</th><th>Specialization</th>
            <th>Phone</th><th>Action</th></tr>

            ${doctors.map((d, i) => `
                <tr>
                    <td>${safe(d.name)}</td>
                    <td>${safe(d.specialty)}</td>
                    <td>${safe(d.phone)}</td>
                    <td><button class="delete"
                        onclick="deleteDoctor(${i})">Delete</button></td>
                </tr>
            `).join("")}
        </table>
    `;
}

function deleteDoctor(i) {
    if (confirm("Delete this doctor?")) {
        doctors.splice(i, 1);
        saveData();
        doctorPage();
    }
}

// APPOINTMENT MANAGEMENT
function appointmentPage() {
    document.getElementById("content").innerHTML = `
        <h2>Appointment Management</h2>

        <div class="panel">
            <div class="form-grid">
                <input id="apname" placeholder="Patient Name">
                <input id="adname" placeholder="Doctor Name">
                <input id="adate" type="date">
                <button onclick="addAppointment()">Book Appointment</button>
            </div>
        </div>

        <div class="panel" id="appointmentList"></div>
    `;

    displayAppointments();
}

function addAppointment() {
    let patient = document.getElementById("apname").value.trim();
    let doctor = document.getElementById("adname").value.trim();
    let date = document.getElementById("adate").value;

    if (!patient || !doctor || !date) {
        alert("Complete all appointment fields!");
        return;
    }

    appointments.push({ patient, doctor, date });
    saveData();
    appointmentPage();
}

function displayAppointments() {
    document.getElementById("appointmentList").innerHTML = `
        <table>
            <tr><th>Patient</th><th>Doctor</th>
            <th>Date</th><th>Action</th></tr>

            ${appointments.map((a, i) => `
                <tr>
                    <td>${safe(a.patient)}</td>
                    <td>${safe(a.doctor)}</td>
                    <td>${safe(a.date)}</td>
                    <td><button class="delete"
                        onclick="deleteAppointment(${i})">Delete</button></td>
                </tr>
            `).join("")}
        </table>
    `;
}

function deleteAppointment(i) {
    if (confirm("Delete this appointment?")) {
        appointments.splice(i, 1);
        saveData();
        appointmentPage();
    }
}

// BILLING MANAGEMENT
function billingPage() {
    document.getElementById("content").innerHTML = `
        <h2>Patient Billing</h2>

        <div class="panel">
            <div class="form-grid">
                <input id="bpatient" placeholder="Patient Name">
                <input id="bservice" placeholder="Service Description">
                <input id="bamount" type="number" placeholder="Amount (BDT)">
                <button onclick="addBill()">Generate Bill</button>
            </div>
        </div>

        <div class="panel" id="billList"></div>
    `;

    displayBills();
}

function addBill() {
    let patient = document.getElementById("bpatient").value.trim();
    let service = document.getElementById("bservice").value.trim();
    let amount = Number(document.getElementById("bamount").value);

    if (!patient || !service || !Number.isFinite(amount) || amount <= 0) {
        alert("Enter valid billing information!");
        return;
    }

    bills.push({
        patient,
        service,
        amount,
        date: new Date().toLocaleDateString()
    });

    saveData();
    billingPage();
}

function displayBills() {
    let total = bills.reduce((sum, b) => sum + b.amount, 0);

    document.getElementById("billList").innerHTML = `
        <h3>Total Billing: BDT ${total.toFixed(2)}</h3>

        <table>
            <tr><th>Patient</th><th>Service</th>
            <th>Amount</th><th>Date</th><th>Action</th></tr>

            ${bills.map((b, i) => `
                <tr>
                    <td>${safe(b.patient)}</td>
                    <td>${safe(b.service)}</td>
                    <td>BDT ${b.amount.toFixed(2)}</td>
                    <td>${safe(b.date)}</td>
                    <td><button class="delete"
                        onclick="deleteBill(${i})">Delete</button></td>
                </tr>
            `).join("")}
        </table>
    `;
}

function deleteBill(i) {
    if (confirm("Delete this bill?")) {
        bills.splice(i, 1);
        saveData();
        billingPage();
    }
}
