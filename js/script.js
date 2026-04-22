const API_URL = "https://telephone-api-crud.vercel.app/api/phones";
let contacts = [];

//------------------------ Fetch All Contacts-----------
async function fetchContacts() {
    try {
        document.getElementById("contactList").innerHTML = "Loading...";
        const res = await fetch(API_URL);

        if (!res.ok) throw new Error("Failed to fetch data");

        contacts = await res.json();
        displayContacts(contacts);

    } catch (error) {
        showMessage(error.message, true);
        console.error(error);
    }
}

// --------------------Displaying Contacts----------------------
function displayContacts(data) {
    const list = document.getElementById("contactList");
    list.innerHTML = "";

    if (data.length === 0) {
        list.innerHTML = "No contacts found";
        return;
    }
    data.forEach(contact => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span>${contact.name} - ${contact.phoneNumber}</span>
            <div class="actions">
                <button onclick="editContact('${contact._id}')">Edit</button>
                <button onclick="deleteContact('${contact._id}')">Delete</button>
            </div>
        `;

        list.appendChild(li);
    });
}

// -------------------- Add / Update Contact--------------
async function saveContact() {
    const id = document.getElementById("contactId").value;
    const name = document.getElementById("name").value.trim();
    const phoneNumber = document.getElementById("phone").value.trim();

    if (!name || !phoneNumber) {
        showMessage("Please fill all fields", true);
        return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
        showMessage("Enter valid 10-digit phone number", true);
        return;
    }

    try {
        if (id) {
            // --------UPDATE----------
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, phoneNumber })
            });

            if (!res.ok) throw new Error("Update failed");

            showMessage("Contact updated successfully");

        } else {
            // -----Create-----------
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, phoneNumber })
            });

            if (!res.ok) throw new Error("Creation failed");

            showMessage("Contact added successfully");
        }

        clearForm();
        fetchContacts();

    } catch (error) {
        showMessage(error.message, true);
        console.error(error);
    }
}

//------Edit Contact---------
async function editContact(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);

        if (!res.ok) throw new Error("Contact not found");

        const contact = await res.json();

        document.getElementById("contactId").value = contact._id;
        document.getElementById("name").value = contact.name;
        document.getElementById("phone").value = contact.phoneNumber;
        document.getElementById("saveBtn").textContent = "Update Contact";

    } catch (error) {
        showMessage(error.message, true);
        console.error(error);
    }
}

// --------- Delete Contact--------
async function deleteContact(id) {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error("Delete failed");

        showMessage("Contact deleted successfully");
        fetchContacts();

    } catch (error) {
        showMessage(error.message, true);
        console.error(error);
    }
}

// ----------Search Contact--------
function searchContact() {
    const query = document.getElementById("search").value.trim().toLowerCase();

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.phoneNumber.includes(query)
    );

    displayContacts(filtered);
}


function clearForm() {
    document.getElementById("contactId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("saveBtn").textContent = "Save Contact";
}

// ------Show Message----------------
function showMessage(msg, isError = false) {
    const message = document.getElementById("message");
    message.textContent = msg;
    message.style.color = isError ? "red" : "green";

    setTimeout(() => {
        message.textContent = "";
    }, 3000);
}

// ------ Loading Data------------
fetchContacts();