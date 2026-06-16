const addStudentBtn = document.getElementById("addStudentBtn");
const studentContainer = document.getElementById("studentContainer");
const totalStudents = document.getElementById("totalStudents");
const activeStudents = document.getElementById("activeStudents");
const completedStudents = document.getElementById("completedStudents");

async function loadStudents() {
    try {
        const response = await fetch("http://127.0.0.1:8000/students");
        if (!response.ok) throw new Error(`Failed to load students: ${response.status}`);

        const students = await response.json();

        totalStudents.textContent = students.length;
        activeStudents.textContent = students.length;
        completedStudents.textContent = students.filter(student => student[2] === 30).length;

        studentContainer.innerHTML = "";

        students.forEach(student => {
            const studentId = student[0];
            const studentName = student[1];
            const studentJuz = student[2];
            const progress = Math.round((studentJuz / 30) * 100);

            const card = document.createElement("div");
            card.classList.add("student-card");

            card.innerHTML = `
                <div class="student-info">
                    <h3>${studentName}</h3>
                    <p>Juz ${studentJuz} / 30</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span>${progress}% Complete</span>
                </div>
                <button class="remove-btn">Remove</button>
            `;

            const removeBtn = card.querySelector(".remove-btn");
            removeBtn.addEventListener("click", async () => {
                await fetch(`http://127.0.0.1:8000/students/${studentId}`, { method: "DELETE" });
                await loadStudents();
            });

            studentContainer.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        alert("Unable to load students. Check the backend and console for details.");
    }
}

async function addStudent() {
    const name = document.getElementById("studentName").value.trim();
    const juz = document.getElementById("studentJuz").value;

    if (!name || !juz) {
        alert("Please fill all fields");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, juz: Number(juz) }),
        });

        if (!response.ok) throw new Error(`Add student failed: ${response.status}`);

        document.getElementById("studentName").value = "";
        document.getElementById("studentJuz").value = "";
        await loadStudents();
    } catch (error) {
        console.error(error);
        alert("Unable to add student. Check the backend and console for details.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    addStudentBtn.addEventListener("click", addStudent);
    loadStudents();

    // Sidebar functionality
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarClose = document.getElementById("sidebarClose");
    const navItems = document.querySelectorAll(".nav-item");

    const trackerSection = document.querySelector(".students-section");
    const calculatorSection = document.getElementById("calculatorSection");
    const badgesSection = document.getElementById("badgesSection");
    const studySection = document.getElementById("studySection");

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("closed");
    });

    sidebarClose.addEventListener("click", () => {
        sidebar.classList.add("closed");
    });

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");

            const view = item.getAttribute("data-view");
            
            trackerSection.style.display = "none";
            calculatorSection.style.display = "none";
            badgesSection.style.display = "none";
            studySection.style.display = "none";
            document.querySelector(".hero").style.display = "none";
            document.querySelector(".stats-container").style.display = "none";
            document.querySelector(".form-section").style.display = "none";

            if (view === "tracker") {
                trackerSection.style.display = "block";
                document.querySelector(".hero").style.display = "block";
                document.querySelector(".stats-container").style.display = "grid";
                document.querySelector(".form-section").style.display = "block";
            } else if (view === "calculator") {
                calculatorSection.style.display = "block";
            } else if (view === "badges") {
                badgesSection.style.display = "block";
            } else if (view === "study") {
                studySection.style.display = "block";
            }

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.add("closed");
            }
        });
    });

    // Calculator functionality
    const calculateBtn = document.getElementById("calculateBtn");
    const dailyPages = document.getElementById("dailyPages");
    const totalPages = document.getElementById("totalPages");
    const studyDaysPerWeek = document.getElementById("studyDaysPerWeek");
    const calculatorResult = document.getElementById("calculatorResult");

    calculateBtn.addEventListener("click", () => {
        const daily = parseFloat(dailyPages.value);
        const total = parseFloat(totalPages.value);
        const daysPerWeek = parseFloat(studyDaysPerWeek.value);

        if (daily <= 0 || total <= 0 || daysPerWeek <= 0 || daysPerWeek > 7) {
            alert("Please enter valid values");
            return;
        }

        // Calculate total days needed
        const totalDaysNeeded = Math.ceil(total / daily);
        
        // Calculate actual calendar days (accounting for days off per week)
        const studyRatioPerWeek = daysPerWeek / 7;
        const calendarDaysNeeded = Math.ceil(totalDaysNeeded / studyRatioPerWeek);
        
        // Calculate weeks needed
        const weeksNeeded = Math.ceil(calendarDaysNeeded / 7);
        
        // Calculate completion date
        const today = new Date();
        const completionDate = new Date(today.getTime() + calendarDaysNeeded * 24 * 60 * 60 * 1000);
        const dateString = completionDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        // Update results
        document.getElementById("daysNeeded").textContent = totalDaysNeeded;
        document.getElementById("weeksNeeded").textContent = weeksNeeded;
        document.getElementById("completionDate").textContent = dateString;
        document.getElementById("totalStudyDays").textContent = calendarDaysNeeded;

        calculatorResult.style.display = "block";
    });

    // Allow Enter key to calculate
    [dailyPages, totalPages, studyDaysPerWeek].forEach(input => {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") calculateBtn.click();
        });
    });

    // Study Mode and Mistake Logging
    const openStudyMode = document.getElementById("openStudyMode");
    const surahItems = document.querySelectorAll(".surah-item");
    const mistakeNotes = document.getElementById("mistakeNotes");
    const saveNotesBtn = document.getElementById("saveNotesBtn");

    const savedNotes = JSON.parse(localStorage.getItem("hifzMistakeNotes") || "{}");

    function showStudyOverlay(surahName) {
        const overlay = document.createElement("div");
        overlay.className = "focus-overlay";
        overlay.innerHTML = `
            <div class="focus-top">
                <div>
                    <h2>${surahName}</h2>
                    <p>Immersive focus mode with audio, translation, and tajweed notes.</p>
                </div>
                <button class="focus-close">✕</button>
            </div>
            <div class="focus-text">
                <p><strong>Verse 1:</strong> In the name of Allah, the Entirely Merciful, the Especially Merciful.</p>
                <p><strong>Verse 2:</strong> All praise is due to Allah, Lord of the worlds.</p>
                <p><strong>Translation:</strong> A quiet, distraction-free reading pane with floating recitation support.</p>
                <div class="focus-audio">
                    <span>Audio Playback</span>
                    <button>Play Recitation</button>
                </div>
            </div>
        `;

        const closeButton = overlay.querySelector(".focus-close");
        closeButton.addEventListener("click", () => overlay.remove());

        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) overlay.remove();
        });

        document.body.appendChild(overlay);
    }

    openStudyMode.addEventListener("click", () => {
        const surahName = document.querySelector(".surah-item.active")?.textContent || "Al-Fatiha";
        showStudyOverlay(surahName);
    });

    surahItems.forEach(item => {
        item.addEventListener("click", () => {
            surahItems.forEach(s => s.classList.remove("active"));
            item.classList.add("active");
        });
    });

    saveNotesBtn.addEventListener("click", () => {
        const noteText = mistakeNotes.value.trim();
        savedNotes["latest"] = {
            note: noteText,
            updated: new Date().toISOString()
        };
        localStorage.setItem("hifzMistakeNotes", JSON.stringify(savedNotes));
        alert("Mistake log saved.");
    });
});