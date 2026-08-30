// ================================
// DATA
// ================================

let jadwal = JSON.parse(localStorage.getItem("jadwalPiket")) || [
    {
        id: 1,
        nama: "Rendy",
        hari: "Senin",
        jam: "07:00",
        tugas: "Bersih-bersih",
        status: "Selesai"
    },
    {
        id: 2,
        nama: "Andi",
        hari: "Selasa",
        jam: "07:00",
        tugas: "Merapikan Ruangan",
        status: "Belum"
    },
    {
        id: 3,
        nama: "Budi",
        hari: "Rabu",
        jam: "07:00",
        tugas: "Menyapu",
        status: "Belum"
    }
];


// ================================
// ELEMENT
// ================================

const table = document.getElementById("jadwalTable");
const emptyState = document.getElementById("emptyState");

const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");

const form = document.getElementById("jadwalForm");
const searchInput = document.getElementById("searchInput");


// ================================
// LOCAL STORAGE
// ================================

function saveData() {
    localStorage.setItem("jadwalPiket", JSON.stringify(jadwal));
}


// ================================
// RENDER TABLE
// ================================

function renderTable(data = jadwal) {

    table.innerHTML = "";

    if (data.length === 0) {
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    data.forEach((item, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>

            <td>
                <strong>${item.nama}</strong>
            </td>

            <td>${item.hari}</td>

            <td>${item.jam}</td>

            <td>${item.tugas}</td>

            <td>
                <span class="status ${
                    item.status === "Selesai"
                    ? "done"
                    : "pending"
                }">
                    ${
                        item.status === "Selesai"
                        ? "✓ Selesai"
                        : "⏳ Belum"
                    }
                </span>
            </td>

            <td>

                ${
                    item.status !== "Selesai"
                    ? `
                        <button
                            class="action-btn done-btn"
                            onclick="selesaikan(${item.id})"
                            title="Tandai selesai"
                        >
                            ✓
                        </button>
                    `
                    : ""
                }

                <button
                    class="action-btn delete-btn"
                    onclick="hapusJadwal(${item.id})"
                    title="Hapus"
                >
                    🗑️
                </button>

            </td>
        `;

        table.appendChild(row);
    });
}


// ================================
// STATS
// ================================

function updateStats() {

    const total = jadwal.length;

    const selesai = jadwal.filter(
        item => item.status === "Selesai"
    ).length;

    const belum = jadwal.filter(
        item => item.status !== "Selesai"
    ).length;

    const anggota = new Set(
        jadwal.map(item => item.nama)
    ).size;

    document.getElementById("totalAnggota").textContent = anggota;

    document.getElementById("sudahPiket").textContent = selesai;

    document.getElementById("belumPiket").textContent = belum;

    document.getElementById("totalJadwal").textContent = total;
}


// ================================
// MEMBER
// ================================

function renderMembers() {

    const memberGrid =
        document.getElementById("memberGrid");

    const names = [
        ...new Set(jadwal.map(item => item.nama))
    ];

    memberGrid.innerHTML = "";

    names.forEach(name => {

        const initial = name
            .substring(0, 2)
            .toUpperCase();

        memberGrid.innerHTML += `
            <div class="member-card">

                <div class="member-avatar">
                    ${initial}
                </div>

                <h3>${name}</h3>

                <p>Anggota Piket</p>

            </div>
        `;
    });
}


// ================================
// TAMBAH JADWAL
// ================================

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const nama =
        document.getElementById("nama").value.trim();

    const hari =
        document.getElementById("hari").value;

    const jam =
        document.getElementById("jam").value;

    const tugas =
        document.getElementById("tugas").value;

    if (!nama || !hari || !jam || !tugas) {
        alert("Lengkapi semua data!");
        return;
    }

    const newJadwal = {

        id: Date.now(),

        nama: nama,

        hari: hari,

        jam: jam,

        tugas: tugas,

        status: "Belum"
    };

    jadwal.push(newJadwal);

    saveData();

    renderTable();

    updateStats();

    renderMembers();

    form.reset();

    closeModalWindow();
});


// ================================
// SELESAIKAN PIKET
// ================================

function selesaikan(id) {

    const item = jadwal.find(
        jadwalItem => jadwalItem.id === id
    );

    if (!item) return;

    item.status = "Selesai";

    saveData();

    renderTable();

    updateStats();
}


// ================================
// HAPUS JADWAL
// ================================

function hapusJadwal(id) {

    const yakin = confirm(
        "Yakin ingin menghapus jadwal ini?"
    );

    if (!yakin) return;

    jadwal = jadwal.filter(
        item => item.id !== id
    );

    saveData();

    renderTable();

    updateStats();

    renderMembers();
}


// ================================
// SEARCH
// ================================

searchInput.addEventListener("input", function() {

    const keyword =
        this.value.toLowerCase();

    const filtered =
        jadwal.filter(item =>

            item.nama
                .toLowerCase()
                .includes(keyword)

            ||

            item.hari
                .toLowerCase()
                .includes(keyword)

            ||

            item.tugas
                .toLowerCase()
                .includes(keyword)

        );

    renderTable(filtered);
});


// ================================
// MODAL
// ================================

openModal.addEventListener(
    "click",
    () => modal.classList.add("show")
);

closeModal.addEventListener(
    "click",
    closeModalWindow
);

cancelModal.addEventListener(
    "click",
    closeModalWindow
);

function closeModalWindow() {

    modal.classList.remove("show");

    form.reset();
}


// klik luar modal
modal.addEventListener("click", function(event) {

    if (event.target === modal) {
        closeModalWindow();
    }

});


// ================================
// SIDEBAR MOBILE
// ================================

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

menuBtn.addEventListener("click", function() {

    sidebar.classList.toggle("open");

});


// tutup sidebar setelah klik menu
document.querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener("click", () => {
            sidebar.classList.remove("open");
        });

    });


// ================================
// JAM REALTIME
// ================================

function updateClock() {

    const now = new Date();

    const time =
        now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    const date =
        now.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    document.getElementById("clock")
        .textContent = time;

    document.getElementById("date")
        .textContent = date;
}

setInterval(updateClock, 1000);

updateClock();


// ================================
// INITIAL RENDER
// ================================

renderTable();

updateStats();

renderMembers();