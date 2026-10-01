window.completeFarm = function() {

    const completionScreen =
        document.getElementById("completionScreen");

    if (!completionScreen) {
        console.error("completionScreen is missing from HTML.");
        return;
    }
    updateFinalStats();
    completionScreen.classList.remove("hidden");
    completionScreen.style.display = "flex";

    document.querySelectorAll("button").forEach(button => {

        if (!button.closest("#completionScreen")) {
            button.disabled = true;
        }

    });

    const farmStatus =
        document.getElementById("farmStatus");

    if (farmStatus) {
        farmStatus.textContent =
            "🏆 Farm completed successfully!";
    }
};

let playerName = "";
let playerDate = "";
let selectedCrop = "";

let gameEnded = false;
let certificateShown = false;

let stats = {
    money: 70,
    soil: 70,
    air: 70,
    productivity: 70,
    sustainability: 70
};

function removeBiomassPanel() {

    const panel =
        document.getElementById("biomassPanel");

    if (panel) {
        panel.remove();
    }

    const output =
        document.getElementById("biomassOutput");

    if (output) {
        output.remove();
    }

    const collector =
        document.getElementById("collectorUI");

    if (collector) {
        collector.remove();
    }

    const machine =
        document.getElementById("biomassCollector");

    if (machine) {
        machine.remove();
    }

    const baler =
        document.getElementById("biomassBaler");

    if (baler) {
        baler.remove();
    }

    const moisture =
        document.getElementById("moistureMeter");

    if (moisture) {
        moisture.remove();
    }
}

function updateStats(changes) {

    if (gameEnded) return false;

    for (const stat in changes) {

        if (Object.prototype.hasOwnProperty.call(stats, stat)) {

            stats[stat] += changes[stat];

            stats[stat] =
                Math.max(0, Math.min(100, stats[stat]));
        }
    }

    updateStatsDisplay();

    if (checkGameOver()) {
        return false;
    }

    return true;
}

function updateStatsDisplay() {

    const statElements = {
        money: document.getElementById("moneyStat"),
        soil: document.getElementById("soilStat"),
        air: document.getElementById("airStat"),
        productivity: document.getElementById("productivityStat"),
        sustainability: document.getElementById("sustainabilityStat")
    };

    const barElements = {
        money: document.getElementById("moneyBar"),
        soil: document.getElementById("soilBar"),
        air: document.getElementById("airBar"),
        productivity: document.getElementById("productivityBar"),
        sustainability: document.getElementById("sustainabilityBar")
    };

    for (const stat in stats) {

        if (statElements[stat]) {
            statElements[stat].textContent = stats[stat];
        }

        if (barElements[stat]) {

            barElements[stat].style.width =
                stats[stat] + "%";

            barElements[stat].classList.remove(
                "low",
                "critical"
            );

            if (stats[stat] <= 25) {

                barElements[stat].classList.add("critical");

            } else if (stats[stat] <= 50) {

                barElements[stat].classList.add("low");
            }
        }
    }
}

function checkGameOver() {

    for (const stat in stats) {

        if (stats[stat] <= 0) {

            gameOver(stat);
            return true;
        }
    }

    return false;
}

function gameOver(stat) {

    if (gameEnded) return;

    gameEnded = true;

    const statNames = {
        money: "💰 Money",
        soil: "🌱 Soil Health",
        air: "🌫️ Air Quality",
        productivity: "🌾 Productivity",
        sustainability: "♻️ Sustainability"
    };

    const screen =
        document.getElementById("gameOverScreen");

    const message =
        document.getElementById("gameOverMessage");

    if (message) {

        message.textContent =
            `${statNames[stat]} reached zero. Your farm can no longer continue.`;
    }

    if (screen) {

        screen.classList.remove("hidden");
        screen.style.display = "flex";
        screen.style.zIndex = "99999";
    }

    document.querySelectorAll("button").forEach(button => {

        if (!button.closest("#gameOverScreen")) {
            button.disabled = true;
        }
    });
}


/* =========================
   COMPOST STATE
========================= */

let compostState = {
    residue: false,
    green: false,
    brown: false,
    water: false,
    air: false
};

function registerPlayer() {

    const nameInput =
        document.getElementById("playerNameInput");

    const dateInput =
        document.getElementById("gameDate");

    const error =
        document.getElementById("playerInfoError");

    const name =
        nameInput.value.trim();

    const date =
        dateInput.value;

    if (!name) {

        error.textContent =
            "⚠️ Please enter your name.";

        nameInput.focus();

        return;
    }

    if (!date) {

        error.textContent =
            "⚠️ Please select a date.";

        dateInput.focus();

        return;
    }

    // Save player information
    playerName = name;
    playerDate = date;

    // Clear error
    error.textContent = "";

    // Start the game
    startFarm();
}


/* =========================
   START FARM
========================= */

function startFarm() {

    gameEnded = false;
    certificateShown = false;

    stats = {
        money: 70,
        soil: 70,
        air: 70,
        productivity: 70,
        sustainability: 70
    };

    compostState = {
        residue: false,
        green: false,
        brown: false,
        water: false,
        air: false
    };

    biomassState = {
        stage: 1,
        collected: 0,
        total: 8,
        dried: false,
        shredded: false,
        densified: false,
        cooled: false
    };

    updateStatsDisplay();

    const startScreen =
        document.getElementById("startScreen");

    const farmScreen =
        document.getElementById("farmScreen");

    const cropScreen =
        document.getElementById("cropScreen");

    if (startScreen) {
        startScreen.classList.add("hidden");
    }

    if (farmScreen) {
        farmScreen.classList.remove("hidden");
    }

    if (cropScreen) {
        cropScreen.classList.remove("hidden");
    }

    ["episodeScreen", "erosionScreen", "smokeScreen",
     "residueScreen", "gameOverScreen",
     "completionScreen"].forEach(id => {

        const element = document.getElementById(id);

        if (element) {
            element.classList.add("hidden");
            element.style.display = "none";
        }
    });

    const compostStation =
        document.getElementById("compostStation");

    if (compostStation) {

        compostStation.classList.add("compost-hidden");
        compostStation.style.display = "none";
    }

    removeBiomassPanel();
    removeBiomassVisuals();

    document.querySelectorAll(
        "#burnPile, .burn-game-fire, .burn-game-smoke, " +
        "#biomassCollector, #biomassBaler, #collectorUI"
    ).forEach(element => element.remove());
}


/* =========================
   CHOOSE CROP
========================= */

function chooseCrop(crop) {

    selectedCrop = crop;

    const cropNames = {
        rice: "Rice 🌾",
        wheat: "Wheat 🌾",
        maize: "Maize 🌽"
    };

    document.getElementById("cropName").textContent =
        cropNames[crop];

    document.getElementById("cropScreen").classList.add("hidden");

    document.getElementById("farmStatus").textContent =
        "🌱 Planting your crop...";

    document.getElementById("farmDescription").textContent =
        "Take care of your farm and survive the challenges ahead.";

    startCropGrowth();
}


/* =========================
   CROP GROWTH
========================= */

function startCropGrowth() {

    const field =
        document.getElementById("farmField");

    field.querySelectorAll(".farm-crop, .farmer, .pest, .natural-spray, .flood-water, .rain-cloud, .rain-drop, .soil-particle, .erosion-runoff, .episode-smoke, .burn-effect, .smoke-effect, .biomass-effect, .residue-effect").forEach(el => el.remove());

    const farmer =
        document.createElement("div");

    farmer.className = "farmer";
    farmer.textContent = "👨‍🌾";

    field.appendChild(farmer);

    const rows = 5;
    const columns = 7;

    const cropEmoji = {
        rice: "🌾",
        wheat: "🌾",
        maize: "🌽"
    };

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < columns; col++) {

            const crop =
                document.createElement("div");

            crop.className = "farm-crop";
            crop.textContent = "🌱";

            crop.style.left =
                `${8 + col * 13}%`;

            crop.style.bottom =
                `${20 + row * 50}px`;

            crop.style.fontSize = "25px";

            crop.style.transform =
                "translateX(-50%) scale(0.4)";

            field.appendChild(crop);

            const delay =
                (row * columns + col) * 120;

            setTimeout(() => {

                crop.style.fontSize = "40px";

                crop.style.transform =
                    "translateX(-50%) scale(0.7)";

            }, 500 + delay);

            setTimeout(() => {

                crop.style.fontSize = "55px";

                crop.style.transform =
                    "translateX(-50%) scale(0.9)";

            }, 1500 + delay);

            setTimeout(() => {

                crop.textContent =
                    cropEmoji[selectedCrop];

                crop.style.fontSize = "65px";

                crop.style.transform =
                    "translateX(-50%) scale(1)";

            }, 2500 + delay);
        }
    }

    setTimeout(() => {

        document.getElementById("farmStatus").textContent =
            "🌾 Your crop has matured!";

        showPestEpisode();

    }, 5000 + (rows * columns * 120));
}


/* =========================
   EPISODE 1
   PEST ATTACK
========================= */

function showPestEpisode() {
    const episode = document.getElementById("episodeScreen");

    episode.classList.remove("hidden");
    episode.style.display = "block";
    episode.style.zIndex = "2000";

    document.getElementById("pestMessage").textContent =
        "🐛 Pests are attacking your crops! Choose how to respond.";

    createPests();
}


/* =========================
   CREATE PESTS
========================= */

function createPests() {

    const field =
        document.getElementById("farmField");

    const crops =
        field.querySelectorAll(".farm-crop");

    for (let i = 0; i < 8; i++) {

        const pest =
            document.createElement("div");

        pest.className = "pest";
        pest.textContent = "🐛";

        const targetCrop =
            crops[Math.floor(Math.random() * crops.length)];

        pest.style.left =
            targetCrop.style.left;

        pest.style.bottom =
            `${parseInt(targetCrop.style.bottom) + 35}px`;

        field.appendChild(pest);
    }
}


/* =========================
   PEST CHOICES
========================= */

function handlePestChoice(choice) {

    const message =
        document.getElementById("pestMessage");

    const episodeScreen =
        document.getElementById("episodeScreen");

    const erosionScreen =
        document.getElementById("erosionScreen");

    if (choice === "biological") {

        message.textContent =
            "🌿 Biological pest control worked! Your crops survived the pest attack.";

        playBiologicalControl();
        removePests();
        updateStats({
    soil: 5,
    productivity: 10,
    sustainability: 8
});
    }

    else if (choice === "flood") {

        message.textContent =
            "💧 Flooding did not control the pests, but the farming season continues.";

        playFloodAnimation();
        damageCrops();
        updateStats({
    money: -25,
    soil: -35,
    productivity: -30,
    sustainability: -25
});
    }

    else if (choice === "ignore") {

        message.textContent =
            "⚠️ Ignoring the pests allowed some damage, but you must continue.";

        damageCrops();
        addMorePests();
        updateStats({
    money: -25,
    productivity: -40,
    sustainability: -30
});
    }

    setTimeout(() => {

        if (episodeScreen) {

            episodeScreen.classList.add("hidden");
            episodeScreen.style.display = "none";
        }

        if (erosionScreen) {

            erosionScreen.classList.remove("hidden");
            erosionScreen.style.display = "block";
            erosionScreen.style.visibility = "visible";
            erosionScreen.style.opacity = "1";
        }

        const erosionMessage =
            document.getElementById("erosionMessage");

        if (erosionMessage) {

            erosionMessage.textContent =
                "🌧️ Heavy rain is beginning! Protect your soil.";
        }

        startErosionAnimation();

    }, 1800);
}


/* =========================
   BIOLOGICAL CONTROL
========================= */

function playBiologicalControl() {

    const field =
        document.getElementById("farmField");

    const spray =
        document.createElement("div");

    spray.className = "natural-spray";
    spray.textContent = "🌿✨💨";

    spray.style.left = "45%";
    spray.style.top = "45%";

    field.appendChild(spray);

    setTimeout(() => {
        spray.remove();
    }, 1500);
}


/* =========================
   FLOOD ANIMATION
========================= */

function playFloodAnimation() {

    const field =
        document.getElementById("farmField");

    const water =
        document.createElement("div");

    water.className = "flood-water";

    field.appendChild(water);

    setTimeout(() => {
        water.remove();
    }, 3000);
}


/* =========================
   CROP DAMAGE
========================= */

function damageCrops() {

    const crops =
        document.querySelectorAll(".farm-crop");

    crops.forEach(crop => {
        crop.classList.add("crop-damage");
    });

    setTimeout(() => {

        crops.forEach(crop => {
            crop.classList.remove("crop-damage");
        });

    }, 3000);
}


/* =========================
   REMOVE PESTS
========================= */

function removePests() {

    const pests =
        document.querySelectorAll(".pest");

    pests.forEach(pest => {

        pest.style.opacity = "0";
        pest.style.transform = "scale(0)";

    });

    setTimeout(() => {

        pests.forEach(pest => {
            pest.remove();
        });

    }, 700);
}


/* =========================
   MORE PESTS
========================= */

function addMorePests() {

    const field =
        document.getElementById("farmField");

    const crops =
        field.querySelectorAll(".farm-crop");

    for (let i = 0; i < 5; i++) {

        const pest =
            document.createElement("div");

        pest.className = "pest";
        pest.textContent = "🐛";

        const targetCrop =
            crops[Math.floor(Math.random() * crops.length)];

        pest.style.left =
            targetCrop.style.left;

        pest.style.bottom =
            `${parseInt(targetCrop.style.bottom) + 35}px`;

        field.appendChild(pest);
    }
}


/* =========================
   EPISODE 2
   SOIL EROSION
========================= */

function startErosionAnimation() {

    const field =
        document.getElementById("farmField");

    const cloud =
        document.createElement("div");

    cloud.className = "rain-cloud";
    cloud.textContent = "☁️";
    cloud.style.left = "40%";

    field.appendChild(cloud);

    for (let i = 0; i < 25; i++) {

        const rain =
            document.createElement("div");

        rain.className = "rain-drop";
        rain.textContent = "💧";

        rain.style.left =
            `${5 + Math.random() * 90}%`;

        rain.style.animationDelay =
            `${Math.random() * 1.5}s`;

        field.appendChild(rain);
    }

    const runoff =
        document.createElement("div");

    runoff.className = "erosion-runoff";

    field.appendChild(runoff);

    createSoilParticles();
}


/* =========================
   SOIL PARTICLES
========================= */

function createSoilParticles() {

    const field =
        document.getElementById("farmField");

    for (let i = 0; i < 25; i++) {

        const particle =
            document.createElement("div");

        particle.className = "soil-particle";
        particle.textContent = "🟫";

        particle.style.left =
            `${5 + Math.random() * 85}%`;

        particle.style.bottom =
            `${20 + Math.random() * 140}px`;

        particle.style.animationDelay =
            `${Math.random() * 1.5}s`;

        field.appendChild(particle);
    }
}


/* =========================
   EROSION CHOICES
========================= */

function handleErosionChoice(choice) {

    const message =
        document.getElementById("erosionMessage");

    if (choice === "cover") {

        message.textContent =
            "🌱 Soil cover is protecting the fertile topsoil from runoff!";

        protectSoil();

        setTimeout(() => {

            message.textContent =
                "✅ Episode 2 Complete! Your soil has been protected.";

        }, 1800);
        updateStats({
    soil: 10,
    productivity: 6,
    sustainability: 8
});
    }

    else if (choice === "bare") {

        message.textContent =
            "🚜 The soil was left bare! Rainwater is carrying away fertile topsoil.";

        createSoilParticles();
        damageCrops();
        updateStats({
    soil: -45,
    productivity: -30,
    sustainability: -35
});
    }

    else if (choice === "water") {

        message.textContent =
            "💧 More water creates stronger runoff and increases soil erosion!";

        createSoilParticles();
        createSoilParticles();
        updateStats({
    money: -25,
    soil: -40,
    productivity: -25,
    sustainability: -30
});
    }

    setTimeout(() => {

        stopErosionAnimation();

        const erosionScreen =
            document.getElementById("erosionScreen");

        erosionScreen.classList.add("hidden");
        erosionScreen.style.display = "none";

        showSmokeEpisode();

    }, 3500);
}


/* =========================
   PROTECT SOIL
========================= */

function protectSoil() {

    const field =
        document.getElementById("farmField");

    const particles =
        field.querySelectorAll(".soil-particle");

    particles.forEach(particle => {

        particle.style.opacity = "0";

        particle.style.animationPlayState =
            "paused";
    });

    const runoff =
        field.querySelector(".erosion-runoff");

    if (runoff) {

        runoff.style.animationPlayState =
            "paused";

        runoff.style.opacity = "0";
    }
}


/* =========================
   STOP EROSION
========================= */

function stopErosionAnimation() {

    const field =
        document.getElementById("farmField");

    field.querySelectorAll(
        ".rain-cloud, .rain-drop, .erosion-runoff, .soil-particle"
    ).forEach(element => {
        element.remove();
    });
}


/* =========================
   EPISODE 3
   TOXIC SMOKE
========================= */

function showSmokeEpisode() {

    const smokeScreen =
        document.getElementById("smokeScreen");

    const smokeChoices =
        document.getElementById("smokeChoices");

    const smokeMessage =
        document.getElementById("smokeMessage");

    smokeScreen.classList.remove("hidden");
    smokeScreen.style.display = "block";

    smokeChoices.style.display = "block";

    smokeMessage.textContent =
        "🌫️ Crop residue remains after harvest. Choose how to manage it.";

    startToxicSmokeAnimation();
}


/* =========================
   TOXIC SMOKE ANIMATION
========================= */

function startToxicSmokeAnimation() {

    const field =
        document.getElementById("farmField");

    for (let i = 0; i < 30; i++) {

        const smoke =
            document.createElement("div");

        smoke.className = "episode-smoke";
        smoke.textContent = "🌫️";

        smoke.style.left =
            `${Math.random() * 95}%`;

        smoke.style.top =
            `${20 + Math.random() * 55}%`;

        smoke.style.fontSize =
            `${35 + Math.random() * 45}px`;

        smoke.style.animationDelay =
            `${Math.random() * 2}s`;

        field.appendChild(smoke);
    }
}


/* =========================
   STOP SMOKE
========================= */

function stopToxicSmokeAnimation() {

    const field =
        document.getElementById("farmField");

    field.querySelectorAll(
        ".episode-smoke"
    ).forEach(smoke => {
        smoke.remove();
    });
}


/* =========================
   EPISODE 3 CHOICES
========================= */

function handleSmokeChoice(choice) {

    const smokeScreen =
        document.getElementById("smokeScreen");

    const smokeChoices =
        document.getElementById("smokeChoices");

    const message =
        document.getElementById("smokeMessage");

    if (choice === "biomass") {

        message.textContent =
            "🏭 The residue is being processed instead of burned!";

        playBiomassAnimation();
        updateStats({
    money: 7,
    air: 10,
    soil: 5,
    sustainability: 10
});
    }

    else if (choice === "burn") {

        message.textContent =
            "🔥 Burning the residue releases harmful smoke into the air.";

        playBurnAnimation();
        updateStats({
    air: -50,
    soil: -35,
    productivity: -25,
    sustainability: -45
});
    }

    else if (choice === "ignore") {

        message.textContent =
            "⚠️ The residue remains on the field and the pollution problem continues.";

        playIgnoreAnimation();
        updateStats({
    air: -35,
    soil: -25,
    productivity: -30,
    sustainability: -40
});
    }

    smokeChoices.style.display = "none";

    setTimeout(() => {

        stopToxicSmokeAnimation();

        smokeScreen.classList.add("hidden");
        smokeScreen.style.display = "none";

        document.getElementById("farmStatus").textContent =
            "🌾 Your farm survived all three challenges!";

        startHarvest();

    }, 3000);
}


/* =========================
   BURN ANIMATION
========================= */

function playBurnAnimation() {

    const field =
        document.getElementById("farmField");

    const fire =
        document.createElement("div");

    fire.className = "burn-effect";
    fire.textContent = "🔥";

    field.appendChild(fire);

    const smoke =
        document.createElement("div");

    smoke.className = "smoke-effect";
    smoke.textContent = "💨";

    field.appendChild(smoke);

    setTimeout(() => {

        fire.remove();
        smoke.remove();

    }, 3000);
}


/* =========================
   BIOMASS ANIMATION
========================= */

function playBiomassAnimation() {

    const field =
        document.getElementById("farmField");

    const machine =
        document.createElement("div");

    machine.className = "biomass-effect";
    machine.textContent = "🏭 ⚙️";

    field.appendChild(machine);

    setTimeout(() => {
        machine.textContent = "♻️✨";
    }, 1000);

    setTimeout(() => {
        machine.remove();
    }, 3000);
}


/* =========================
   IGNORE ANIMATION
========================= */

function playIgnoreAnimation() {

    const field =
        document.getElementById("farmField");

    const residue =
        document.createElement("div");

    residue.className = "residue-effect";
    residue.textContent = "🌾🌾🌾";

    field.appendChild(residue);

    setTimeout(() => {
        residue.remove();
    }, 3000);
}


/* =========================
   HARVEST
========================= */

function startHarvest() {

    const field =
        document.getElementById("farmField");

    const crops =
        field.querySelectorAll(".farm-crop");

    document.getElementById("farmStatus").textContent =
        "🚜 Harvesting your crops...";

    document.getElementById("farmDescription").textContent =
        "Your crops are being harvested.";

    crops.forEach((crop, index) => {

        setTimeout(() => {

            crop.style.transform =
                "translateY(60px) scale(0.7)";

            crop.style.opacity = "0";

        }, index * 80);
    });

    setTimeout(() => {

        document.getElementById("farmStatus").textContent =
            "🌾 Harvest complete!";

        document.getElementById("farmDescription").textContent =
            "Crop residue remains on the field.";

        createResidue();

    }, 2500);
}


/* =========================
   CREATE RESIDUE
========================= */

function createResidue() {

    const field =
        document.getElementById("farmField");

    const residueTypes = [
        "〰️",
        "⌁",
        "∿",
        "≋"
    ];

    for (let i = 0; i < 30; i++) {

        const residue =
            document.createElement("div");

        residue.className =
            "crop-residue";

    

        residue.textContent =
            residueTypes[
                Math.floor(
                    Math.random() * residueTypes.length
                )
            ];

        residue.style.left =
            `${5 + Math.random() * 90}%`;

        residue.style.bottom =
            `${15 + Math.random() * 45}px`;

        residue.style.transform =
            `rotate(${Math.random() * 180 - 90}deg)`;

        field.appendChild(residue);
    }

    setTimeout(() => {

        showResidueScreen();

    }, 1200);
}


/* =========================
   RESIDUE MANAGEMENT SCREEN
========================= */

function showResidueScreen() {

    const residueScreen =
        document.getElementById("residueScreen");

    residueScreen.classList.remove("hidden");
    residueScreen.style.display = "block";

    document.getElementById("residueChoices").style.display =
        "block";

    document.getElementById("residueMessage").textContent =
        "🌾 Crop residue remains after harvesting. Choose how to manage it.";

    /* IMPORTANT:
       Compost station stays hidden here.
       It appears ONLY after Compost is selected.
    */

    const compostStation =
        document.getElementById("compostStation");

    if (compostStation) {

        compostStation.classList.add("compost-hidden");
        compostStation.style.display = "none";
    }
}


/* =========================
   CHOOSE RESIDUE METHOD
========================= */

function chooseResidueMethod(method) {

    const message =
        document.getElementById("residueMessage");

    const choices =
        document.getElementById("residueChoices");

    if (choices) {
        choices.style.display = "none";
    }


    /* =====================
       MULCH
    ===================== */

    if (method === "mulch") {

        message.textContent =
            "🪴 Mulching Task: Cut the crop residue into smaller pieces and spread them across the field.";

        setTimeout(() => {
            startMulchingGame();
        }, 1000);

        return;

    }


    /* =====================
       COMPOST
    ===================== */

    if (method === "compost") {

        message.textContent =
            "♻️ Compost selected! Add the crop residue and compost ingredients.";

        showCompostArea();

        return;
    }


    /* =====================
       BIOMASS
    ===================== */

    if (method === "biomass") {
    message.textContent =
        "🏭 Biomass Processing: Collect the crop residue and convert it into biomass fuel.";
    
    setTimeout(() => {
        startBiomassGame();
    }, 800);

    return;
}


    /* =====================
       BURN
    ===================== */

    if (method === "burn") {

    message.textContent =
        "🔥 Burning selected! Gather the residue into a pile before lighting it.";

    setTimeout(() => {
        startBurnGame();
    }, 800);

    return;
}
}
let draggedResidue=null;

/* =========================================================
   COMPOST SYSTEM
========================================================= */

function showCompostArea() {

    const compostStation =
        document.getElementById("compostStation");

    if (!compostStation) {
        console.error("Compost station not found.");
        return;
    }

    compostStation.classList.remove("compost-hidden");
    compostStation.classList.add("compost-visible");

    enableCompostDragging();
}


/* =========================
   DRAG ACTUAL RESIDUE
========================= */

function enableCompostDragging() {

    const residues =
        document.querySelectorAll(".crop-residue");

    const compostBin =
        document.getElementById("compostBin");

    if (!compostBin) {
        console.error("Compost bin not found.");
        return;
    }


    residues.forEach(residue => {

        if (residue.dataset.compostDrag === "true") {
            return;
        }

        residue.dataset.compostDrag = "true";

        residue.draggable = true;


        residue.addEventListener(
            "dragstart",
            function(event) {

                draggedResidue = residue;

                event.dataTransfer.setData(
                    "text/plain",
                    "crop-residue"
                );

                event.dataTransfer.effectAllowed =
                    "move";

                residue.style.opacity = "0.5";
            }
        );


        residue.addEventListener(
            "dragend",
            function() {

                residue.style.opacity = "0.9";

            }
        );

    });


    /* BIN DRAG OVER */

    compostBin.addEventListener(
        "dragover",
        function(event) {

            event.preventDefault();

            compostBin.style.transform =
                "scale(1.08)";
        }
    );


    /* BIN DROP */

    compostBin.addEventListener(
        "drop",
        function(event) {

            event.preventDefault();

            compostBin.style.transform =
                "scale(1)";

            if (!draggedResidue) {
                return;
            }

            addResidueToCompost();
        }
    );
}


/* =========================
   ADD RESIDUE TO BIN
========================= */

function addResidueToCompost() {

    if (!draggedResidue) {
        return;
    }

    const residue =
        draggedResidue;

    residue.remove();

    draggedResidue = null;

    compostState.residue = true;


    /* Put visual residue INSIDE the bin */

    addIngredientToPile("🌾");


    const status =
        document.getElementById("compostStatus");

    if (status) {

        status.textContent =
            "🌾 Crop residue added! Now add green, brown, water and air.";
    }


    updateCompostButton();
}


/* =========================
   ADD COMPOST INGREDIENT
========================= */

function addCompostIngredient(
    ingredient,
    event
) {

    if (!compostState.residue) {

        const status =
            document.getElementById("compostStatus");

        if (status) {

            status.textContent =
                "🌾 Drag the crop residue into the compost bin first.";
        }

        return;
    }


    if (compostState[ingredient]) {
        return;
    }


    compostState[ingredient] = true;


    const icons = {

        green: "🌿",
        brown: "🍂",
        water: "💧",
        air: "💨"

    };


    const names = {

        green: "Green materials",
        brown: "Brown materials",
        water: "Water",
        air: "Air"

    };


    const ingredientElement =
        document.createElement("div");

    ingredientElement.style.position =
        "fixed";

    ingredientElement.style.fontSize =
        "35px";

    ingredientElement.style.zIndex =
        "9999";

    ingredientElement.textContent =
        icons[ingredient];

    document.body.appendChild(
        ingredientElement
    );


    /* Start at the button */

    if (event && event.currentTarget) {

        const buttonRect =
            event.currentTarget.getBoundingClientRect();

        ingredientElement.style.left =
            buttonRect.left + "px";

        ingredientElement.style.top =
            buttonRect.top + "px";
    }


    const bin =
        document.getElementById("compostBin");


    if (bin) {

        const binRect =
            bin.getBoundingClientRect();

        setTimeout(() => {

            ingredientElement.style.left =
                (
                    binRect.left +
                    binRect.width / 2
                ) + "px";

            ingredientElement.style.top =
                (
                    binRect.top +
                    binRect.height / 2
                ) + "px";

            ingredientElement.style.transform =
                "scale(0.4)";

            ingredientElement.style.opacity =
                "0";

        }, 50);
    }


    setTimeout(() => {

        ingredientElement.remove();

        addIngredientToPile(
            icons[ingredient]
        );

        const status =
            document.getElementById("compostStatus");

        if (status) {

            status.textContent =
                `${icons[ingredient]} ${names[ingredient]} added!`;
        }

        updateCompostButton();

    }, 850);
}


/* =========================
   ADD VISUAL TO BIN
========================= */

function addIngredientToPile(icon) {

    const pile =
        document.getElementById("compostPile");

    if (!pile) {
        return;
    }


    const item =
        document.createElement("span");

    item.textContent =
        icon;

    item.className =
        "compost-added-piece";

    pile.appendChild(item);
}


/* =========================
   CHECK COMPOST
========================= */

function updateCompostButton() {

    const complete =
        compostState.residue &&
        compostState.green &&
        compostState.brown &&
        compostState.water &&
        compostState.air;


    const button =
        document.getElementById(
            "startCompostButton"
        );


    if (button) {

        button.disabled =
            !complete;
    }


    const status =
        document.getElementById(
            "compostStatus"
        );


    if (!status) {
        return;
    }


    if (complete) {

        status.textContent =
            "🌱 Perfect! Everything is ready. Start composting!";

    }

    else if (!compostState.residue) {

        status.textContent =
            "🌾 Drag the crop residue into the compost bin first.";

    }

    else {

        status.textContent =
            "🌿 Add all four compost ingredients.";
    }
}


/* =========================
   START COMPOSTING
========================= */

function startCompostingProcess() {

    const complete =
        compostState.residue &&
        compostState.green &&
        compostState.brown &&
        compostState.water &&
        compostState.air;

    if (!complete) {
        return;
    }

    const pile =
        document.getElementById("compostPile");

    const button =
        document.getElementById("startCompostButton");

    const status =
        document.getElementById("compostStatus");

    if (button) {
        button.disabled = true;
        button.textContent = "♻️ Composting...";
    }

    if (status) {
        status.textContent = "🌱 Composting in progress...";
    }

    if (pile) {
        pile.classList.add("composting");
    }

    setTimeout(() => {

        if (pile) {
            pile.classList.remove("composting");

            pile.innerHTML =
                '<span class="finished-compost">🟫 🟫 🟫</span>';
        }

        if (button) {
            button.disabled = true;
            button.textContent = "✅ Compost Complete!";
        }

        if (status) {
            status.textContent =
                "🌱 Finished compost is ready!";
        }

        const residueMessage =
            document.getElementById("residueMessage");

        if (residueMessage) {
            residueMessage.textContent =
                "🌱 Compost Complete! The crop residue has been converted into nutrient-rich compost.";
        }

        document.getElementById("farmStatus").textContent =
            "🌱 Compost successfully created!";
            updateStats({
    money: 5,
    soil: 10,
    productivity: 8,
    sustainability: 10
});

if (!gameEnded) {

    setTimeout(() => {
        completeFarm();
    }, 1500);
}

    }, 3500);
    
}
/* =========================================================
   MULCHING GAME
========================================================= */

function startMulchingGame() {

    const field =
        document.getElementById(
            "farmField"
        );

    const message =
        document.getElementById(
            "residueMessage"
        );

    const residues =
        field.querySelectorAll(
            ".crop-residue"
        );


    message.textContent =
        "✂️ Step 1: Click each piece of crop residue to cut it into smaller pieces.";


    residues.forEach(residue => {

        residue.style.pointerEvents =
            "auto";

        residue.style.zIndex = "150";

        residue.style.cursor =
            "pointer";


        residue.onclick =
            function() {

                if (
                    residue.dataset.cut === "true"
                ) {
                    return;
                }


                residue.dataset.cut =
                    "true";


                residue.style.fontSize =
                    "16px";


                residue.style.transform +=
                    " rotate(45deg)";


                const piece =
                    document.createElement(
                        "div"
                    );

                piece.className =
                    "crop-residue mulch-piece";

                piece.dataset.cut =
                    "true";

                piece.textContent =
                    "╱";


                piece.style.left =
                    residue.style.left;

                piece.style.bottom =
                    residue.style.bottom;

                piece.style.fontSize =
                    "16px";

                piece.style.pointerEvents =
                    "auto";

                piece.style.cursor =
                    "grab";


                field.appendChild(piece);


                residue.classList.add(
                    "cut-residue"
                );


                enableResidueDragging();

                checkCuttingComplete();
            };
    });


    function checkCuttingComplete() {

        const cutCount =
            field.querySelectorAll(
                '.crop-residue[data-cut="true"]'
            ).length;


        if (cutCount >= 3) {

            message.textContent =
                "✂️ All residue has been cut! Now drag the pieces around and spread them evenly across the field.";

            enableResidueDragging();
        }
    }


    function enableResidueDragging() {

        const pieces =
            field.querySelectorAll(
                ".crop-residue"
            );


        pieces.forEach(piece => {

            if (
                piece.dataset.dragEnabled === "true"
            ) {
                return;
            }


            piece.dataset.dragEnabled =
                "true";

            piece.style.pointerEvents =
                "auto";

            piece.style.cursor =
                "grab";


            piece.addEventListener(
                "pointerdown",
                function(event) {

                    event.preventDefault();

                    const rect =
                        field.getBoundingClientRect();

                    const pieceRect =
                        piece.getBoundingClientRect();

                    const offsetX =
                        event.clientX -
                        pieceRect.left;

                    const offsetY =
                        event.clientY -
                        pieceRect.top;


                    piece.style.cursor =
                        "grabbing";

                    piece.setPointerCapture(
                        event.pointerId
                    );


                    function movePiece(e) {

                        let x =
                            e.clientX -
                            rect.left -
                            offsetX;

                        let y =
                            e.clientY -
                            rect.top -
                            offsetY;


                        x =
                            Math.max(
                                0,
                                Math.min(
                                    x,
                                    rect.width -
                                    pieceRect.width
                                )
                            );


                        y =
                            Math.max(
                                0,
                                Math.min(
                                    y,
                                    rect.height -
                                    pieceRect.height
                                )
                            );


                        piece.style.left =
                            `${x}px`;

                        piece.style.top =
                            `${y}px`;

                        piece.style.right =
                            "auto";

                        piece.style.bottom =
                            "auto";
                    }


                    function stopDragging() {

                        piece.style.cursor =
                            "grab";

                        piece.removeEventListener(
                            "pointermove",
                            movePiece
                        );

                        piece.removeEventListener(
                            "pointerup",
                            stopDragging
                        );

                        piece.removeEventListener(
                            "pointercancel",
                            stopDragging
                        );

                        checkSpreadProgress();
                    }


                    piece.addEventListener(
                        "pointermove",
                        movePiece
                    );

                    piece.addEventListener(
                        "pointerup",
                        stopDragging
                    );

                    piece.addEventListener(
                        "pointercancel",
                        stopDragging
                    );
                }
            );
        });
    }


    function checkSpreadProgress() {

        const pieces =
            field.querySelectorAll(
                ".crop-residue"
            );

        const positions = [];


        pieces.forEach(piece => {

            const rect =
                piece.getBoundingClientRect();

            positions.push({

                x: rect.left,
                y: rect.top

            });
        });


        if (positions.length < 3) {
            return;
        }


        const fieldRect =
            field.getBoundingClientRect();


        const occupiedAreas =
            new Set();


        positions.forEach(pos => {

            const column =
                Math.floor(
                    (
                        (pos.x -
                        fieldRect.left) /
                        fieldRect.width
                    ) * 5
                );


            const row =
                Math.floor(
                    (
                        (pos.y -
                        fieldRect.top) /
                        fieldRect.height
                    ) * 3
                );


            occupiedAreas.add(
                `${column}-${row}`
            );
        });


        if (occupiedAreas.size >= 10) {

            message.textContent =
                "🌱 Mulching complete! The crop residue has been cut and spread evenly across the field, protecting the soil.";


            pieces.forEach(piece => {

                piece.style.pointerEvents =
                    "none";

                piece.style.cursor =
                    "default";
            });
            updateStats({
    soil: 10,
    productivity: 7,
    sustainability: 10
});

if (!gameEnded) {

    setTimeout(() => {
        completeFarm();
    }, 1500);
}
        }
    }
    
}

/* =========================================================
   BIOMASS PROCESSING MINI-GAME
========================================================= */

function removeBiomassVisuals() {

    document.querySelectorAll(
        ".biomass-bale, .shredded-piece, .treated-piece, .pressed-pellet, #biomassOutput"
    ).forEach(element => {
        element.remove();
    });
}

let biomassState = {
    stage: 1,
    collected: 0,
    total: 8,
    dried: false,
    shredded: false,
    densified: false,
    cooled: false
};


/* START BIOMASS GAME */

function startBiomassGame() {

    const oldUI = document.getElementById("collectorUI");

if (oldUI) {
    oldUI.remove();
}

    const field = document.getElementById("farmField");
    const message = document.getElementById("residueMessage");

    biomassState = {
        stage: 1,
        collected: 0,
        total: 8,
        dried: false,
        shredded: false,
        densified: false,
        cooled: false
    };

    /* Remove old biomass panel */
    removeBiomassPanel();

    /* Hide the residue-choice card */
    const residueScreen = document.getElementById("residueScreen");
    if (residueScreen) {
        residueScreen.classList.add("hidden");
    }

    /*
       ============================
       PHYSICAL COLLECTION AREA
       ============================
    */

    const machine = document.createElement("div");

    machine.id = "biomassCollector";

    machine.innerHTML = `
    <div class="collector-tractor">
    🚜
    </div>
    ';`

    field.appendChild(machine);

const collectorUI = document.createElement("div");
collectorUI.id = "collectorUI";

const info = document.createElement("div");
info.className = "collector-info";

const title = document.createElement("strong");
title.textContent = "RESIDUE COLLECTOR";

const instruction = document.createElement("small");
instruction.textContent =
    "Click the residue pieces to collect them";

info.appendChild(title);
info.appendChild(instruction);


const counter = document.createElement("div");
counter.className = "collector-counter";

counter.innerHTML =
    '🌾 Collected: <span id="physicalCollectionCount">0/8</span>';


collectorUI.appendChild(info);
collectorUI.appendChild(counter);

document.body.appendChild(collectorUI);




    /*
       ============================
       MAKE RESIDUE PHYSICALLY CLICKABLE
       ============================
    */

    const residues =
        field.querySelectorAll(".crop-residue");

    let usableResidues = 0;

    residues.forEach((residue, index) => {
        residue.style.zIndex = "200";
residue.style.pointerEvents = "auto";

        if (usableResidues >= 8) {
            residue.style.display = "none";
            return;
        }

        usableResidues++;

        residue.style.pointerEvents = "auto";
        residue.style.cursor = "pointer";
        residue.dataset.collected = "false";

        residue.onclick = function () {

            if (residue.dataset.collected === "true") {
                return;
            }

            residue.dataset.collected = "true";

            biomassState.collected++;

            /*
               Make the residue fly toward
               the collection machine.
            */

            const machineRect =
                machine.getBoundingClientRect();

            const residueRect =
                residue.getBoundingClientRect();

            const targetX =
                machineRect.left +
                machineRect.width / 2 -
                residueRect.left;

            const targetY =
                machineRect.top +
                machineRect.height / 2 -
                residueRect.top;

            residue.style.transition =
                "transform 0.5s ease, opacity 0.5s ease";

            residue.style.transform =
    "translate(" + targetX + "px, " + targetY + "px) scale(0.2)";

            residue.style.opacity = "0";

            setTimeout(() => {
                residue.remove();
            }, 500);

            updatePhysicalCollection();
        };
    });

    message.textContent =
        "🚜 Stage 1: Collect the crop residue from the field.";

    updatePhysicalCollection();
}

function updatePhysicalCollection() {

    const counter =
        document.getElementById("physicalCollectionCount");

    if (counter) {
        counter.textContent =
    biomassState.collected + "/" + biomassState.total;
    }

    if (biomassState.collected >= biomassState.total) {

        const collectorUI =
    document.getElementById("collectorUI");

if (collectorUI) {
    collectorUI.remove();
}

const machine =
    document.getElementById("biomassCollector");

if (machine) {
    machine.remove();
}

    const message =
        document.getElementById("residueMessage");

    if (message) {
        message.textContent =
            "✅ All residue collected! Now compress it into biomass bales.";
    }

    setTimeout(() => {
        startBiomassBaling();
    }, 1200);
}
    }



/* COLLECTION STAGE */

function updateBiomassCollection() {

    const counter =
        document.getElementById("physicalCollectionCount");

    if (counter) {
        counter.textContent =
            biomassState.collected + "/" + biomassState.total;
    }

    if (biomassState.collected >= biomassState.total) {

        const machine =
            document.getElementById("biomassCollector");

        if (machine) {
            machine.classList.add("collection-complete");
        }

        const message =
            document.getElementById("residueMessage");

        if (message) {
            message.textContent =
                "✅ All residue collected! It is ready for drying.";
        }

        setTimeout(function() {
            startBiomassDrying();
        }, 1200);
    }
}


/* BIOMASS PANEL */


/* NEXT STAGE */

function biomassNextStage() {

    if (biomassState.stage === 2) {
        startBiomassDrying();
    }

    else if (biomassState.stage === 3) {
        startBiomassShredding();
    }

    else if (biomassState.stage === 4) {
        startBiomassDensification();
    }

    else if (biomassState.stage === 5) {
        startBiomassCooling();
    }
}


/* =========================================================
   STAGE 2: DRYING
========================================================= */
function createBiomassPanel() {

    const oldPanel =
        document.getElementById("biomassPanel");

    if (oldPanel) {
        oldPanel.remove();
    }

    const panel =
        document.createElement("div");

    panel.id = "biomassPanel";

    panel.innerHTML = `
        <div id="biomassStage">
            STAGE 2: DRYING ☀️
        </div>

        <p id="biomassStatus">
            ☀️ Prepare the biomass for processing.
        </p>

        <div class="biomass-progress">
            <div id="biomassProgress"></div>
        </div>

        <button id="biomassAction">
            ☀️ Start Drying
        </button>
    `;

    document.body.appendChild(panel);
}


function startBiomassDrying() {

    biomassState.stage = 2;
    createBiomassPanel();

    const stage =
        document.getElementById("biomassStage");

    const status =
        document.getElementById("biomassStatus");

    const button =
        document.getElementById("biomassAction");

    stage.textContent =
        "STAGE 2: DRYING ☀️";

    status.textContent =
        "☀️ Dry the collected residue until moisture reaches the target zone.";

    button.disabled = true;
    button.textContent = "☀️ Drying...";

    createMoistureMeter();

    let moisture = 100;

    const interval =
        setInterval(() => {

            moisture -= 5;

            const meter =
                document.getElementById("moistureFill");

            const value =
                document.getElementById("moistureValue");

            if (meter) {
                meter.style.width = moisture + "%" ;
            }

            if (value) {
                value.textContent =
                    "moisture: " + moisture + "%";
            }

            if (moisture <= 20) {

    clearInterval(interval);

    biomassState.dried = true;

    status.textContent =
        "☀️ Perfect! The residue has dried sufficiently.";

    button.disabled = true;
    button.textContent =
        "📦 Moving dried bales...";

    transformDriedBales();

    setTimeout(() => {

        biomassState.stage = 3;

        stage.textContent =
            "STAGE 3: SIZE REDUCTION ⚙️";

        status.textContent =
            "⚙️ The dried bales are ready for size reduction.";

        button.disabled = false;
        button.textContent =
            "⚙️ Start Size Reduction";

        button.onclick =
            startBiomassShredding;

    }, 1800);
}

        }, 500);
}

function transformDriedBales() {

    const field =
        document.getElementById("farmField");

    const bales =
        field.querySelectorAll(".biomass-bale");

    bales.forEach((bale, index) => {

        /* Make the bale visibly change */
        bale.textContent = "🟫📦";

        bale.style.background = "#8b5a2b";
        bale.style.borderRadius = "8px";

        bale.style.transition =
            "all 1.2s ease";

        /* Move the dried bales to the other side */
        bale.style.left =
            `${62 + index * 10}%`;

        bale.style.bottom =
            "120px";

        bale.style.transform =
            "scale(1.15)";

        /* Small drying/compression effect */
        setTimeout(() => {

            bale.textContent = "🟫🔸";

            bale.style.transform =
                "scale(1)";

        }, 1000);
    });

    /* Show a little label where they moved */
    const label =
        document.createElement("div");

    label.id = "driedBaleLabel";

    label.textContent =
        "☀️ DRIED BIOMASS";

    label.style.position = "absolute";
    label.style.right = "8%";
    label.style.bottom = "190px";
    label.style.padding = "10px 15px";
    label.style.background = "#315c35";
    label.style.color = "white";
    label.style.border = "2px solid #8bcf55";
    label.style.borderRadius = "12px";
    label.style.fontWeight = "bold";
    label.style.zIndex = "300";

    field.appendChild(label);

    setTimeout(() => {

        label.remove();

    }, 1800);
}


/* MOISTURE METER */

function createMoistureMeter() {

    const old =
        document.getElementById("moistureMeter");

    if (old) old.remove();

    const panel =
        document.getElementById("biomassPanel");

    const meter =
        document.createElement("div");

    meter.id = "moistureMeter";

    meter.innerHTML =
    '<div class="meter-label">' +
    '🌞 Moisture ' +
    '<span id="moistureValue">Moisture: 100%</span>' +
    '</div>' +
    '<div class="meter">' +
    '<div id="moistureFill"></div>' +
    '</div>';
    panel.insertBefore(
        meter,
        document.getElementById("biomassStatus")
    );
}


/* =========================================================
   STAGE 3: SIZE REDUCTION
========================================================= */

function startBiomassShredding() {
    transformToShreddedBiomass();

    biomassState.stage = 3;

    const stage =
        document.getElementById("biomassStage");

    const status =
        document.getElementById("biomassStatus");

    const button =
        document.getElementById("biomassAction");

    stage.textContent =
        "STAGE 3: SIZE REDUCTION ⚙️";

    status.textContent =
        "⚙️ Run the mechanical shredder to reduce the residue into smaller pieces.";

    button.textContent =
        "⚙️ Start Shredder";

    button.disabled = false;

    button.onclick =
        operateShredder;
}

function transformToShreddedBiomass() {

    const field = document.getElementById("farmField");

    const bales = field.querySelectorAll(".biomass-bale");

    bales.forEach((bale, index) => {

        bale.style.transition = "all 0.8s ease";

        bale.textContent = "🟤🟤🟤";

        bale.style.left =
            `${60 + index * 8}%`;

        bale.style.bottom = "100px";

        bale.style.fontSize = "28px";

        bale.style.transform =
            "scale(0.8) rotate(" +
            (Math.random() * 20 - 10) +
            "deg)";

        bale.style.background = "transparent";
        bale.style.border = "none";
    });
}

/* SHREDDER */

function operateShredder() {

    const button =
        document.getElementById("biomassAction");

    const status =
        document.getElementById("biomassStatus");

    button.disabled = true;

    status.textContent =
        "⚙️ Shredder running...";

    let progress = 0;

    const interval =
        setInterval(() => {

            progress += 10;

            const bar =
                document.getElementById("biomassProgress");

            if (bar) {
                bar.style.width = progress + "%";
            }

            if (progress >= 100) {

                clearInterval(interval);

                biomassState.shredded = true;
                removeBiomassVisuals();
                createShreddedMaterial();
                biomassState.stage = 4;

                status.textContent =
                    "✅ Size reduction complete! The residue is ready for densification.";

                document.getElementById("biomassStage").textContent =
                    "STAGE 4: DENSIFICATION 🗜️";

                button.disabled = false;

                button.textContent =
                    "🗜️ Start Densification";

                button.onclick =
                    biomassNextStage;
            }

        }, 250);
}

function createShreddedMaterial() {

    const field = document.getElementById("farmField");

    document.querySelectorAll(".shredded-piece").forEach(piece => {
        piece.remove();
    });

    for (let i = 0; i < 18; i++) {

        const piece = document.createElement("div");

        piece.className = "shredded-piece";
        piece.textContent = "🟤";

        piece.style.position = "absolute";
        piece.style.left =
            `${55 + Math.random() * 25}%`;

        piece.style.bottom =
            `${70 + Math.random() * 70}px`;

        piece.style.fontSize =
            `${12 + Math.random() * 10}px`;

        piece.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        piece.style.zIndex = "100";

        field.appendChild(piece);
    }
}


/* =========================================================
   STAGE 4: DENSIFICATION
========================================================= */

function startBiomassDensification() {

    biomassState.stage = 4;

    const stage =
        document.getElementById("biomassStage");

    const status =
        document.getElementById("biomassStatus");

    const button =
        document.getElementById("biomassAction");

    stage.textContent =
        "STAGE 4: PRETREATMENT 🧪";

    status.textContent =
        "🧪 Treating the shredded biomass before pressing.";

    button.textContent =
        "🧪 Start Treatment";

    button.disabled = false;

    button.onclick =
        operateTreatment;
}

function operateTreatment() {

    const button =
        document.getElementById("biomassAction");

    const status =
        document.getElementById("biomassStatus");

    button.disabled = true;

    status.textContent =
        "🧪 Treating and cleaning the shredded biomass...";

    let progress = 0;

    const interval =
        setInterval(() => {

            progress += 10;

            const bar =
                document.getElementById("biomassProgress");

            if (bar) {
                bar.style.width =
                    progress + "%";
            }

            if (progress >= 100) {

                clearInterval(interval);

                removeBiomassVisuals();

                createTreatedBiomass();

                biomassState.stage = 5;

                status.textContent =
                    "🟢 Treatment complete! The biomass is ready for pressing.";

                document.getElementById("biomassStage").textContent =
                    "STAGE 5: DENSIFICATION 🗜️";

                button.disabled = false;

                button.textContent =
                    "🗜️ Start Press";

                button.onclick =
                    operateDensifier;
            }

        }, 250);
}

function createTreatedBiomass() {

    const field =
        document.getElementById("farmField");

    for (let i = 0; i < 18; i++) {

        const piece =
            document.createElement("div");

        piece.className =
            "treated-piece";

        piece.textContent =
            "🟢";

        piece.style.position =
            "absolute";

        piece.style.left =
            `${55 + Math.random() * 25}%`;

        piece.style.bottom =
            `${70 + Math.random() * 90}px`;

        piece.style.fontSize =
            "18px";

        piece.style.zIndex =
            "100";

        field.appendChild(piece);
    }
}


/* DENSIFIER */

function operateDensifier() {

    const button =
        document.getElementById("biomassAction");

    const status =
        document.getElementById("biomassStatus");

    button.disabled = true;

    status.textContent =
        "🗜️ Compressing biomass...";

    let pressure = 0;

    const interval =
        setInterval(() => {

            pressure += 10;

            const bar =
                document.getElementById("biomassProgress");

            if (bar) {
                bar.style.width =
                    pressure + "%";
            }

            if (pressure >= 100) {

                clearInterval(interval);

                biomassState.densified = true;
                removeBiomassVisuals();
                createPressedPellets();
                biomassState.stage = 5;

                status.textContent =
    "🟠 Pressing complete! The biomass has been formed into compact pellets.";

document.getElementById("biomassStage").textContent =
    "STAGE 6: COOLING ❄️";

button.disabled = false;

button.textContent =
    "❄️ Cool Biomass";

button.onclick =
    startBiomassCooling;
            }

        }, 250);
    
}

function transformToTreatedBiomass() {

    document.querySelectorAll(".shredded-piece").forEach(piece => {

        piece.textContent = "🟢";
        piece.style.fontSize = "18px";
        piece.style.filter =
            "drop-shadow(0 0 6px rgba(120,255,120,0.8))";

    });
}

function createPressedPellets() {

    const field = document.getElementById("farmField");

    document.querySelectorAll(".shredded-piece").forEach(piece => {
        piece.remove();
    });

    for (let i = 0; i < 12; i++) {

        const pellet = document.createElement("div");

        pellet.className = "pressed-pellet";
        pellet.textContent = "🟠";

        pellet.style.position = "absolute";
        pellet.style.left =
            `${58 + Math.random() * 22}%`;

        pellet.style.bottom =
            `${70 + Math.random() * 80}px`;

        pellet.style.fontSize = "18px";
        pellet.style.zIndex = "100";

        field.appendChild(pellet);
    }
}


/* =========================================================
   STAGE 5: COOLING
========================================================= */

function startBiomassCooling() {

    biomassState.stage = 5;

    const status =
        document.getElementById("biomassStatus");

    const button =
        document.getElementById("biomassAction");

    button.disabled = true;

    status.textContent =
        "❄️ Cooling the freshly produced biomass pellets...";

    let cooling = 0;

    const interval =
        setInterval(() => {

            cooling += 10;

            const output =
                document.getElementById("biomassOutput");

            if (output) {
                output.style.filter =
    "brightness(" + (1 + cooling / 500) + ")";
            }

            if (cooling >= 100) {

    clearInterval(interval);

    biomassState.cooled = true;

    transformToFinalPellets();

    finishBiomassGame();
}

        }, 250);
}

function transformToFinalPellets() {

    const pellets =
        document.querySelectorAll(".pressed-pellet");

    pellets.forEach((pellet, index) => {

        pellet.textContent =
            "🔴";

        pellet.style.fontSize =
            "20px";

        pellet.style.filter =
            "drop-shadow(0 0 6px rgba(255,120,50,0.8))";

        pellet.style.transition =
            "all 1s ease";

                    pellet.style.transform =
            "scale(1.25)";

        setTimeout(() => {

            pellet.style.transform =
                "scale(1)";

        }, 700);
    });
}


/* =========================================================
   BIOMASS COMPLETE
========================================================= */

function finishBiomassGame() {

    const stage =
        document.getElementById("biomassStage");

    const status =
        document.getElementById("biomassStatus");

    const button =
        document.getElementById("biomassAction");

    stage.textContent =
        "✅ BIOMASS PRODUCTION COMPLETE";

    status.textContent =
        "🌾 Crop residue has been converted into compact biomass fuel.";

    button.textContent =
        "📦 Biomass Stored";

    button.disabled = true;

    const message =
        document.getElementById("residueMessage");

    if (message) {
        message.textContent =
            "🎉 Biomass production complete! Crop residue was dried, size-reduced, densified and cooled into biomass fuel.";
    }

    document.getElementById("farmStatus").textContent =
        "🏭 Biomass fuel successfully produced!";

    document.getElementById("farmDescription").textContent =
        "Agricultural residue has been converted into a useful solid biofuel.";
        updateStats({
    money: 10,
    soil: 5,
    air: 8,
    productivity: 5,
    sustainability: 10
});

setTimeout(() => {
    completeFarm();
},1500);

if (!gameEnded) {

    setTimeout(() => {
        completeFarm();
    }, 1500);

}

function startBiomassBaling() {

    biomassState.stage = 2;

    const field = document.getElementById("farmField");
    const status = document.getElementById("biomassStatus");

    if (status) {
        status.textContent =
            "🚜 Stage 2: Compress the collected residue into biomass bales.";
    }

    // Create baler machine
    const baler = document.createElement("div");
    baler.id = "biomassBaler";
    baler.innerHTML = `
        <div class="baler-machine">🚜</div>
        <div class="baler-label">BIOMASS BALER</div>
        <button id="startBalingButton">
            🚜 START BALING
        </button>
        <div class="baling-progress">
            <div id="balingProgress"></div>
        </div>
    `;

    field.appendChild(baler);

    document.getElementById("startBalingButton")
        .addEventListener("click", runBalingProcess);
}

function runBalingProcess() {

    const button = document.getElementById("startBalingButton");
    const progress = document.getElementById("balingProgress");
    const status = document.getElementById("biomassStatus");

    button.disabled = true;
    button.textContent = "⚙️ BALING...";

    if (status) {
        status.textContent =
            "⚙️ The baler is compressing the collected crop residue...";
    }

    let value = 0;

    const interval = setInterval(() => {

        value += 10;

        if (progress) {
            progress.style.width = value + "%";
        }

        if (value >= 100) {

            clearInterval(interval);

            button.textContent = "✅ BALING COMPLETE";

            if (status) {
                status.textContent =
                    "📦 The crop residue has been compressed into biomass bales!";
            }

            createBiomassBales();
        }

    }, 250);
}

function createBiomassBales() {

    const field = document.getElementById("farmField");

    const baler = document.getElementById("biomassBaler");

    if (baler) {
        baler.remove();
    }

    const status = document.getElementById("biomassStatus");

    if (status) {
        status.textContent =
            "📦 Stage 2 complete! Click each biomass bale to load it into the processing unit.";
    }

    biomassState.bales = 3;
    biomassState.loaded = 0;

    for (let i = 0; i < 3; i++) {

        const bale = document.createElement("div");

        bale.className = "biomass-bale";
        bale.textContent = "🌾📦";

        bale.style.left = `${25 + i * 25}%`;
        bale.style.bottom = "80px";

        bale.dataset.loaded = "false";

        bale.addEventListener("click", function () {

            if (bale.dataset.loaded === "true") return;

            bale.dataset.loaded = "true";

            bale.style.transform =
                "translateY(-100px) scale(0.4)";
            bale.style.opacity = "0";

            biomassState.loaded++;

            setTimeout(() => {
                bale.remove();
            }, 500);

            if (biomassState.loaded >= biomassState.bales) {

    setTimeout(() => {
        startBiomassDrying();
    }, 700);
}
        });

        field.appendChild(bale);
    }
}



function showCompletionScreen() {

    let screen =
        document.getElementById("completionScreen");

    /* Create the screen if HTML does not contain it */
    if (!screen) {

        screen =
            document.createElement("section");

        screen.id = "completionScreen";
        screen.className = "completion-screen";

        screen.innerHTML = `
            <div class="completion-card">

                <h1>🏆 FARM RESCUED!</h1>

                <p class="completion-subtitle">
                    Congratulations, Farmer!
                </p>

                <p>
                    You successfully completed the Crop Rescue
                    farming simulation.
                </p>

                <div class="certificate-wrapper">
                    <canvas id="certificateCanvas"></canvas>
                </div>

                <div class="completion-buttons">

                    <button
                        id="downloadCertificateButton"
                        class="main-button">
                        📥 Download Certificate
                    </button>

                    <button
                        id="playAgainButton"
                        class="main-button">
                        🔄 Play Again
                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(screen);
    }

    screen.classList.remove("hidden");
    screen.style.display = "flex";
    screen.style.zIndex = "99999";

    const canvas =
        document.getElementById("certificateCanvas");

    if (canvas) {
        drawCertificate(canvas);
    }

    const downloadButton =
        document.getElementById(
            "downloadCertificateButton"
        );

    if (downloadButton) {

        downloadButton.onclick =
            downloadCertificate;
    }

    const playAgainButton =
        document.getElementById("playAgainButton");

    if (playAgainButton) {

        playAgainButton.onclick = () => {

            screen.classList.add("hidden");
            screen.style.display = "none";

            location.reload();
        };
    }
}

function drawCertificate(canvas) {

    canvas.width = 1600;
    canvas.height = 1100;

    const ctx =
        canvas.getContext("2d");

    const formattedDate =
        new Date(playerDate + "T00:00:00")
            .toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

    /* BACKGROUND */

    ctx.fillStyle = "#f8f1d8";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    /* OUTER BORDER */

    ctx.strokeStyle = "#315c35";
    ctx.lineWidth = 24;

    ctx.strokeRect(
        35,
        35,
        1530,
        1030
    );

    ctx.strokeStyle = "#d5a936";
    ctx.lineWidth = 5;

    ctx.strokeRect(
        65,
        65,
        1470,
        970
    );

    ctx.textAlign = "center";

    /* TITLE */

    ctx.fillStyle = "#315c35";

    ctx.font =
        "bold 65px Georgia";

    ctx.fillText(
        "CERTIFICATE OF COMPLETION",
        800,
        220
    );

    /* GAME NAME */

    ctx.font =
        "bold 35px Georgia";

    ctx.fillText(
        "CROP RESCUE",
        800,
        285
    );

    ctx.font =
        "20px Arial";

    ctx.fillText(
        "SUSTAINABLE FARMING SIMULATION",
        800,
        325
    );

    /* PRESENTED TO */

    ctx.fillStyle = "#543c2b";

    ctx.font =
        "24px Georgia";

    ctx.fillText(
        "This certificate is proudly presented to",
        800,
        420
    );

    /* PLAYER NAME */

    ctx.fillStyle = "#315c35";

    ctx.font =
        "italic 55px Georgia";

    ctx.fillText(
        playerName,
        800,
        500
    );

    /* NAME LINE */

    ctx.strokeStyle = "#d5a936";
    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(450, 525);
    ctx.lineTo(1150, 525);

    ctx.stroke();

    /* DESCRIPTION */

    ctx.fillStyle = "#543c2b";

    ctx.font =
        "24px Georgia";

    ctx.fillText(
        "for successfully completing all challenges",
        800,
        590
    );

    ctx.fillText(
        "in the Crop Rescue game and managing agricultural",
        800,
        630
    );

    ctx.fillText(
        "residue through a sustainable farming strategy.",
        800,
        670
    );

    /* BADGES */

    ctx.font =
        "38px Arial";

    ctx.fillText(
        "💰     🌱     🌫️     🌾     ♻️",
        800,
        775
    );

    ctx.font =
        "16px Arial";

    ctx.fillText(
        "Economic Awareness     Soil Conservation     Cleaner Air     Productive Farming     Sustainable Practices",
        800,
        810
    );

    /* DATE */

    ctx.font =
        "20px Arial";

    ctx.fillText(
        formattedDate,
        400,
        920
    );

    ctx.font =
        "14px Arial";

    ctx.fillText(
        "DATE",
        400,
        950
    );

    /* SEAL */

    ctx.beginPath();

    ctx.arc(
        800,
        920,
        55,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#315c35";
    ctx.fill();

    ctx.strokeStyle = "#d5a936";
    ctx.lineWidth = 7;
    ctx.stroke();

    ctx.font =
        "38px Arial";

    ctx.fillText(
        "🌿",
        800,
        935
    );

    /* CERTIFIED BY */

    ctx.fillStyle = "#543c2b";

    ctx.font =
        "bold 18px Georgia";

    ctx.fillText(
        "CROP RESCUE",
        1200,
        920
    );

    ctx.font =
        "13px Arial";

    ctx.fillText(
        "GAME CERTIFIED",
        1200,
        945
    );
}

let gameEnded = false;
let certificateShown = false;

/* =========================================================
   COMPLETE FARM
========================================================= */

/* =========================================================
   COMPLETE FARM
========================================================= */

function completeFarm() {

    const farmScreen =
        document.getElementById("farmScreen");

    const completionScreen =
        document.getElementById("completionScreen");

    if (farmScreen) {
        farmScreen.classList.add("hidden");
    }

    if (completionScreen) {
        updateFinalStats();
        completionScreen.classList.remove("hidden");
        completionScreen.style.display = "block";
    }

    updateFinalStats();

    createPersonalizedCertificate();
}


/* =========================================================
   FINAL STATS
========================================================= */

/* =========================================================
   FINAL STATS
========================================================= */

function updateFinalStats() {

    document.getElementById("finalMoney").textContent =
        Math.round(stats.money);

    document.getElementById("finalSoil").textContent =
        Math.round(stats.soil);

    document.getElementById("finalAir").textContent =
        Math.round(stats.air);

    document.getElementById("finalProductivity").textContent =
        Math.round(stats.productivity);

    document.getElementById("finalSustainability").textContent =
        Math.round(stats.sustainability);
}


/* =========================================================
   TRY AGAIN
========================================================= */

function tryAgain() {

    location.reload();

}

function setDefaultGameDate() {

    const dateInput =
        document.getElementById("gameDate");

    if (!dateInput) return;

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(today.getDate())
        .padStart(2, "0");

    dateInput.value =
        `${year}-${month}-${day}`;
}



setDefaultGameDate();}

function startBurnGame() {

    const field = document.getElementById("farmField");
    const message = document.getElementById("residueMessage");

    const residues = field.querySelectorAll(".crop-residue");

    let collected = 0;
    const total = Math.min(residues.length, 8);

    message.textContent =
        "🔥 Step 1: Click the residue pieces to gather them into a burning pile.";

    createBurnPile();

    residues.forEach((residue, index) => {

        if (index >= total) {
            residue.style.display = "none";
            return;
        }

        residue.style.pointerEvents = "auto";
        residue.style.cursor = "pointer";
        residue.style.zIndex = "200";

        residue.onclick = function () {

            if (residue.dataset.burned === "true") {
                return;
            }

            residue.dataset.burned = "true";
            collected++;

            const burnCount =
                document.getElementById("burnCount");

            if (burnCount) {
                burnCount.textContent =
                    `🌾 Gathered: ${collected}/${total}`;
            }

            const burnPile =
                document.getElementById("burnPile");

            if (!burnPile) return;

            const pileRect =
                burnPile.getBoundingClientRect();

            const residueRect =
                residue.getBoundingClientRect();

            const moveX =
                pileRect.left +
                pileRect.width / 2 -
                residueRect.left;

            const moveY =
                pileRect.top +
                pileRect.height / 2 -
                residueRect.top;

            residue.style.transition =
                "transform 0.6s ease, opacity 0.6s ease";

            residue.style.transform =
                `translate(${moveX}px, ${moveY}px) scale(0.5)`;

            setTimeout(() => {

                residue.remove();

                const piece =
                    document.createElement("span");

                piece.textContent = "🌾";
                piece.className =
                    "collected-burn-residue";

                const pileResidue =
                    burnPile.querySelector(
                        ".burn-pile-residue"
                    );

                if (pileResidue) {
                    pileResidue.appendChild(piece);
                }

            }, 600);

            if (collected >= total) {

                message.textContent =
                    "🔥 All residue gathered! The pile is ready to ignite.";

                const igniteButton =
                    document.getElementById("igniteButton");

                if (igniteButton) {
                    igniteButton.style.display = "block";
                }
            }
        };
    });
}


function createBurnPile() {

    const field =
        document.getElementById("farmField");

    const old =
        document.getElementById("burnPile");

    if (old) {
        old.remove();
    }

    const pile =
        document.createElement("div");

    pile.id = "burnPile";

    pile.innerHTML = `
        <div class="burn-pile-residue"></div>

        <div id="burnCount">
            🌾 Gathered: 0/8
        </div>

        <button id="igniteButton" style="display:none;">
            🔥 IGNITE RESIDUE
        </button>
    `;

    field.appendChild(pile);

    const igniteButton =
        document.getElementById("igniteButton");

    if (igniteButton) {
        igniteButton.addEventListener(
            "click",
            igniteResidue
        );
    }
}


function igniteResidue() {

    const field =
        document.getElementById("farmField");

    const pile =
        document.getElementById("burnPile");

    const message =
        document.getElementById("residueMessage");

    if (pile) {
        pile.remove();
    }

    message.textContent =
        "🔥 The residue is burning... Harmful smoke is being released into the air!";

    const fire =
        document.createElement("div");

    fire.className =
        "burn-game-fire";

    fire.textContent =
        "🔥🔥🔥";

    field.appendChild(fire);

    const smoke =
        document.createElement("div");

    smoke.className =
        "burn-game-smoke";

    smoke.innerHTML =
        "🌫️ 🌫️ 🌫️";

    field.appendChild(smoke);

    setTimeout(() => {

        message.textContent =
            "☠️ Crop residue burning has caused severe air pollution and reduced soil quality.";

    }, 1800);

    setTimeout(() => {

        fire.remove();
        smoke.remove();

        finishBurnGame();

    }, 4000);
}


function finishBurnGame() {

    const message =
        document.getElementById("residueMessage");

    if (message) {

        message.textContent =
            "🔥 Burning complete. The residue has been destroyed, but air pollution and soil damage have increased.";
    }

    document.getElementById("farmStatus").textContent =
        "🔥 Residue burned.";

    document.getElementById("farmDescription").textContent =
        "Burning removed the residue but harmed air quality and soil health.";

    updateStats({
        money: 3,
        soil: -35,
        air: -50,
        productivity: -25,
        sustainability: -45
    });

    setTimeout(() => {
        completeFarm();
    }, 1500);
}

/* =========================================================
   PERSONALIZED CERTIFICATE
========================================================= */

function createPersonalizedCertificate() {

    const template =
        new Image();

    template.src =
        "certificate.jpeg";

    template.onload = function () {

        const canvas =
            document.createElement("canvas");

        canvas.width =
            template.width;

        canvas.height =
            template.height;

        const ctx =
            canvas.getContext("2d");

        /* Draw certificate template */
        ctx.drawImage(
            template,
            0,
            0
        );

        /*
           PLAYER NAME
        */

        const name =
            playerName || "Farmer";

        /*
           Cover "Your Name"
        */

        ctx.fillStyle =
            "#f4e8cc";

        ctx.fillRect(
            560,
            385,
            420,
            90
        );

        /*
           Redraw decorative line
        */

        ctx.strokeStyle =
            "#7a4b24";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(390, 470);
        ctx.lineTo(1145, 470);

        ctx.stroke();

        /*
           Draw actual player name
        */

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillStyle =
            "#3d2115";

        ctx.font =
            "italic 55px Georgia";

        ctx.fillText(
            name,
            768,
            425
        );

        /*
           DATE
        */

        let formattedDate =
            "";

        if (playerDate) {

            formattedDate =
                new Date(
                    playerDate + "T00:00:00"
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );

        } else {

            formattedDate =
                new Date().toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );
        }

        /*
           Cover existing DATE area
        */

        ctx.fillStyle =
            "#f4e8cc";

        ctx.fillRect(
            430,
            885,
            350,
            70
        );

        /*
           Draw actual date
        */

        ctx.fillStyle =
            "#3d2115";

        ctx.font =
            "22px Georgia";

        ctx.fillText(
            formattedDate,
            605,
            920
        );

        /*
           Show personalized certificate
           on the completion screen
        */

        const certificateImage =
            document.getElementById(
                "certificateImage"
            );

        if (certificateImage) {

            certificateImage.src =
                canvas.toDataURL(
                    "image/png"
                );

        }

        /*
           Store generated certificate
           for downloading
        */

        window.generatedCertificate =
            canvas.toDataURL(
                "image/png"
            );
    };

    template.onerror = function () {

        console.error(
            "Certificate template could not be loaded. Make sure 17552.png is in the same folder as index.html."
        );

    };
}

/* =========================================================
   DOWNLOAD PERSONALIZED CERTIFICATE
========================================================= */

function downloadCertificate() {

    if (!window.generatedCertificate) {

        createPersonalizedCertificate();

        setTimeout(() => {
            downloadCertificate();
        }, 500);

        return;
    }

    const link =
        document.createElement("a");

    link.href =
        window.generatedCertificate;

    link.download =
        "Crop_Rescue_Certificate.png";

    link.click();
}

/* =========================================================
   TRY AGAIN
========================================================= */

function tryAgain() {

    location.reload();

}

/* =========================================================
   COMPLETE BIOMASS PROCESSING FLOW
   Collection -> Baling -> Drying -> Shredding ->
   Pretreatment -> Densification -> Cooling -> Pellets
   ========================================================= */


/* ---------- STAGE 2: BALING ---------- */

function startBiomassBaling() {
    const field = document.getElementById("farmField");
    const message = document.getElementById("residueMessage");

    // Remove old baler if one exists
    const oldBaler = document.getElementById("biomassBaler");
    if (oldBaler) oldBaler.remove();

    if (message) {
        message.textContent =
            "🚜 Stage 2: Compress the collected residue into biomass bales.";
    }

    const baler = document.createElement("div");
    baler.id = "biomassBaler";

    baler.innerHTML = `
        <div class="baler-machine">🚜</div>

        <div class="baler-label">
            BIOMASS BALER
        </div>

        <button id="startBalingButton">
            🚜 START BALING
        </button>

        <div class="baling-progress">
            <div id="balingProgress"></div>
        </div>
    `;

    field.appendChild(baler);

    document
        .getElementById("startBalingButton")
        .addEventListener("click", runBalingProcess);
}


function runBalingProcess() {
    const button = document.getElementById("startBalingButton");
    const progress = document.getElementById("balingProgress");
    const message = document.getElementById("residueMessage");

    if (!button) return;

    button.disabled = true;
    button.textContent = "⚙️ BALING...";

    if (message) {
        message.textContent =
            "⚙️ The baler is compressing the collected crop residue...";
    }

    let value = 0;

    const interval = setInterval(() => {
        value += 10;

        if (progress) {
            progress.style.width = value + "%";
        }

        if (value >= 100) {
            clearInterval(interval);

            button.textContent = "✅ BALING COMPLETE";

            if (message) {
                message.textContent =
                    "📦 Crop residue has been compressed into biomass bales!";
            }

            setTimeout(createBiomassBales, 800);
        }
    }, 200);
}


function createBiomassBales() {
    const field = document.getElementById("farmField");
    const baler = document.getElementById("biomassBaler");
    const message = document.getElementById("residueMessage");

    if (baler) baler.remove();

    if (message) {
        message.textContent =
            "📦 Baling complete! Preparing the biomass for drying...";
    }

    document
        .querySelectorAll(".biomass-bale")
        .forEach(el => el.remove());

    for (let i = 0; i < 3; i++) {
        const bale = document.createElement("div");

        bale.className = "biomass-bale";
        bale.textContent = "🌾📦";

        bale.style.position = "absolute";
        bale.style.left = `${25 + i * 25}%`;
        bale.style.bottom = "90px";
        bale.style.fontSize = "45px";
        bale.style.zIndex = "200";
        bale.style.transition = "all 0.5s ease";

        field.appendChild(bale);
    }

    setTimeout(startBiomassDrying, 1500);
}


/* ---------- STAGE 3: DRYING ---------- */

function startBiomassDrying() {
    createBiomassPanel();

    const stage = document.getElementById("biomassStage");
    const status = document.getElementById("biomassStatus");
    const button = document.getElementById("biomassAction");

    stage.textContent = "STAGE 3: DRYING ☀️";

    status.textContent =
        "☀️ Dry the biomass until its moisture reaches 20%.";

    button.textContent = "☀️ DRYING...";
    button.disabled = true;

    createMoistureMeter();

    let moisture = 100;

    const interval = setInterval(() => {
        moisture -= 5;

        const fill = document.getElementById("moistureFill");
        const value = document.getElementById("moistureValue");

        if (fill) {
            fill.style.width = moisture + "%";
        }

        if (value) {
            value.textContent = "Moisture: " + moisture + "%";
        }

        if (moisture <= 20) {
            clearInterval(interval);

            status.textContent =
                "✅ Moisture target reached. Biomass is ready for size reduction.";

            button.textContent = "⚙️ START SIZE REDUCTION";
            button.disabled = false;

            button.onclick = startBiomassShredding;
        }
    }, 250);
}


function createBiomassPanel() {
    const old = document.getElementById("biomassPanel");

    if (old) old.remove();

    const panel = document.createElement("div");

    panel.id = "biomassPanel";

    panel.innerHTML = `
        <div id="biomassStage">
            BIOMASS PROCESSING
        </div>

        <p id="biomassStatus">
            Processing biomass...
        </p>

        <div class="biomass-progress">
            <div id="biomassProgress"></div>
        </div>

        <button id="biomassAction">
            Continue
        </button>
    `;

    document.body.appendChild(panel);
}


function createMoistureMeter() {
    const panel = document.getElementById("biomassPanel");

    if (!panel) return;

    const old = document.getElementById("moistureMeter");

    if (old) old.remove();

    const meter = document.createElement("div");

    meter.id = "moistureMeter";

    meter.innerHTML = `
        <div class="meter-label">
            ☀️ Biomass Moisture
            <span id="moistureValue">
                Moisture: 100%
            </span>
        </div>

        <div class="meter">
            <div id="moistureFill"
                 style="width:100%;">
            </div>
        </div>
    `;

    panel.insertBefore(
        meter,
        document.getElementById("biomassStatus")
    );
}


/* ---------- STAGE 4: SIZE REDUCTION ---------- */

function startBiomassShredding() {
    const stage = document.getElementById("biomassStage");
    const status = document.getElementById("biomassStatus");
    const button = document.getElementById("biomassAction");

    const moistureMeter =
        document.getElementById("moistureMeter");

    if (moistureMeter) moistureMeter.remove();

    resetBiomassProgress();

    stage.textContent =
        "STAGE 4: SIZE REDUCTION ⚙️";

    status.textContent =
        "⚙️ Shred the dried biomass into smaller particles.";

    button.textContent =
        "⚙️ START SHREDDER";

    button.disabled = false;

    button.onclick = operateShredder;
}


function operateShredder() {
    const button = document.getElementById("biomassAction");
    const status = document.getElementById("biomassStatus");

    button.disabled = true;
    button.textContent = "⚙️ SHREDDING...";

    status.textContent =
        "⚙️ Mechanical size reduction in progress...";

    runBiomassProgress(() => {

        document
            .querySelectorAll(".biomass-bale")
            .forEach(el => el.remove());

        createShreddedMaterial();

        status.textContent =
            "✅ Size reduction complete!";

        button.textContent =
            "🧪 START PRETREATMENT";

        button.disabled = false;

        button.onclick = startBiomassPretreatment;
    });
}


function createShreddedMaterial() {
    const field = document.getElementById("farmField");

    document
        .querySelectorAll(".shredded-piece")
        .forEach(el => el.remove());

    for (let i = 0; i < 20; i++) {
        const piece = document.createElement("div");

        piece.className = "shredded-piece";
        piece.textContent = "🟤";

        piece.style.position = "absolute";
        piece.style.left =
            `${55 + Math.random() * 25}%`;

        piece.style.bottom =
            `${60 + Math.random() * 80}px`;

        piece.style.fontSize =
            `${12 + Math.random() * 10}px`;

        piece.style.zIndex = "150";

        field.appendChild(piece);
    }
}


/* ---------- STAGE 5: PRETREATMENT ---------- */

function startBiomassPretreatment() {
    const stage = document.getElementById("biomassStage");
    const status = document.getElementById("biomassStatus");
    const button = document.getElementById("biomassAction");

    resetBiomassProgress();

    stage.textContent =
        "STAGE 5: PRETREATMENT 🧪";

    status.textContent =
        "🧪 Clean and prepare the shredded biomass before compression.";

    button.textContent =
        "🧪 START TREATMENT";

    button.disabled = false;

    button.onclick = operateBiomassTreatment;
}


function operateBiomassTreatment() {
    const button = document.getElementById("biomassAction");
    const status = document.getElementById("biomassStatus");

    button.disabled = true;
    button.textContent = "🧪 TREATING...";

    status.textContent =
        "🧪 Biomass pretreatment in progress...";

    runBiomassProgress(() => {

        document
            .querySelectorAll(".shredded-piece")
            .forEach(piece => {
                piece.textContent = "🟢";
                piece.classList.add("treated-piece");
            });

        status.textContent =
            "✅ Pretreatment complete! Biomass is ready for densification.";

        button.textContent =
            "🗜️ START DENSIFICATION";

        button.disabled = false;

        button.onclick = startBiomassDensification;
    });
}


/* ---------- STAGE 6: DENSIFICATION ---------- */

function startBiomassDensification() {
    const stage = document.getElementById("biomassStage");
    const status = document.getElementById("biomassStatus");
    const button = document.getElementById("biomassAction");

    resetBiomassProgress();

    stage.textContent =
        "STAGE 6: DENSIFICATION 🗜️";

    status.textContent =
        "🗜️ Compress the treated biomass into dense fuel pellets.";

    button.textContent =
        "🗜️ START PRESS";

    button.disabled = false;

    button.onclick = operateDensifier;
}


function operateDensifier() {
    const button = document.getElementById("biomassAction");
    const status = document.getElementById("biomassStatus");

    button.disabled = true;
    button.textContent = "🗜️ PRESSING...";

    status.textContent =
        "🗜️ High-pressure densification in progress...";

    runBiomassProgress(() => {

        document
            .querySelectorAll(
                ".shredded-piece, .treated-piece"
            )
            .forEach(el => el.remove());

        createPressedPellets();

        status.textContent =
            "🟠 Pellets formed! They must now be cooled.";

        button.textContent =
            "❄️ START COOLING";

        button.disabled = false;

        button.onclick = startBiomassCooling;
    });
}


/* ---------- CREATE HOT PELLETS ---------- */

function createPressedPellets() {
    const field = document.getElementById("farmField");

    document
        .querySelectorAll(".pressed-pellet")
        .forEach(el => el.remove());

    for (let i = 0; i < 15; i++) {
        const pellet = document.createElement("div");

        pellet.className = "pressed-pellet";
        pellet.textContent = "🟠";

        pellet.style.position = "absolute";

        pellet.style.left =
            `${55 + Math.random() * 25}%`;

        pellet.style.bottom =
            `${65 + Math.random() * 90}px`;

        pellet.style.fontSize = "19px";
        pellet.style.zIndex = "160";

        field.appendChild(pellet);
    }
}


/* ---------- STAGE 7: COOLING ---------- */

function startBiomassCooling() {
    const stage = document.getElementById("biomassStage");
    const status = document.getElementById("biomassStatus");
    const button = document.getElementById("biomassAction");

    resetBiomassProgress();

    stage.textContent =
        "STAGE 7: COOLING ❄️";

    status.textContent =
        "❄️ Cooling freshly produced biomass pellets...";

    button.textContent =
        "❄️ COOLING...";

    button.disabled = true;

    runBiomassProgress(() => {

        transformToFinalPellets();

        status.textContent =
            "✅ Cooling complete! Biomass fuel pellets are ready.";

        button.textContent =
            "📦 BIOMASS READY";

        button.disabled = true;

        setTimeout(finishBiomassGame, 1200);
    });
}


/* ---------- FINAL PELLETS ---------- */

function transformToFinalPellets() {
    const pellets =
        document.querySelectorAll(".pressed-pellet");

    pellets.forEach((pellet, index) => {

        setTimeout(() => {
            pellet.textContent = "🟤";
            pellet.style.transform = "scale(1.2)";

            setTimeout(() => {
                pellet.style.transform = "scale(1)";
            }, 300);

        }, index * 50);
    });
}


/* ---------- REUSABLE PROGRESS ---------- */

function resetBiomassProgress() {
    const progress =
        document.getElementById("biomassProgress");

    if (progress) {
        progress.style.width = "0%";
    }
}


function runBiomassProgress(onComplete) {
    const progress =
        document.getElementById("biomassProgress");

    let value = 0;

    const interval = setInterval(() => {
        value += 10;

        if (progress) {
            progress.style.width = value + "%";
        }

        if (value >= 100) {
            clearInterval(interval);

            if (onComplete) {
                onComplete();
            }
        }
    }, 200);
}


/* ---------- BIOMASS COMPLETE ---------- */

function finishBiomassGame() {
    const stage =
        document.getElementById("biomassStage");

    const status =
        document.getElementById("biomassStatus");

    const message =
        document.getElementById("residueMessage");

    if (stage) {
        stage.textContent =
            "✅ BIOMASS PRODUCTION COMPLETE";
    }

    if (status) {
        status.textContent =
            "🌾 Crop residue has been converted into usable biomass fuel pellets.";
    }

    if (message) {
        message.textContent =
            "🎉 Biomass production complete! The residue was collected, baled, dried, shredded, treated, compressed and cooled into fuel pellets.";
    }

    document.getElementById("farmStatus").textContent =
        "🏭 Biomass fuel successfully produced!";

    document.getElementById("farmDescription").textContent =
        "Agricultural residue has been converted into useful solid biofuel.";

    /*
       Put your biomass reward here if you already
       have updateStats().
    */

    if (typeof updateStats === "function") {
        updateStats({
            money: 10,
            soil: 3,
            air: 8,
            productivity: 5,
            sustainability: 10
        });
    }

    setTimeout(() => {

        const panel =
            document.getElementById("biomassPanel");

        if (panel) panel.remove();

        /*
           This calls your existing end-of-farm screen.
        */
        if (typeof completeFarm === "function") {
            completeFarm();
        } else {
            console.error(
                "completeFarm() is not defined."
            );
        }

    }, 2500);
}

function updateFinalStats() {

    document.getElementById("finalMoney").textContent = stats.money;
    document.getElementById("finalSoil").textContent = stats.soil;
    document.getElementById("finalAir").textContent = stats.air;
    document.getElementById("finalProductivity").textContent = stats.productivity;
    document.getElementById("finalSustainability").textContent = stats.sustainability;

}/* =========================================
   CROP RESCUE AI ASSISTANT
========================================= */

let aiChatOpen = false;


function toggleAIChat() {

    const chatWindow =
        document.getElementById("aiChatWindow");

    aiChatOpen = !aiChatOpen;

    if (aiChatOpen) {

        chatWindow.style.display = "block";

        setTimeout(() => {

            document
                .getElementById("aiUserInput")
                .focus();

        }, 100);

    } else {

        chatWindow.style.display = "none";
    }
}


function handleAIEnter(event) {

    if (event.key === "Enter") {
        sendAIMessage();
    }
}


function addAIMessage(text, type) {
    const messages = document.getElementById("aiChatMessages");

    const message = document.createElement("div");
    message.className =
        "ai-message " +
        (type === "user" ? "user-message" : "bot-message");

    // Escape HTML first so Gemini output cannot inject HTML
    let formatted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // Bold: **text** → <strong>text</strong>
    formatted = formatted.replace(
        /\*\*(.*?)\*\*/gs,
        "<strong>$1</strong>"
    );

    // Remove Markdown italic markers: *text* → text
    formatted = formatted.replace(
        /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
        "$1"
    );

    // Remove Markdown headings
    formatted = formatted.replace(
        /^#{1,6}\s+/gm,
        ""
    );

    // Inline code: `text` → text
    formatted = formatted.replace(
        /`([^`]+)`/g,
        "$1"
    );

    // Convert Markdown bullet points into clean bullets
    formatted = formatted.replace(
        /^\s*[\*\-]\s+/gm,
        "• "
    );

    // Make line breaks visible
    formatted = formatted.replace(/\n/g, "<br>");

    message.innerHTML = formatted;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function formatAIResponse(text) {

    // Escape HTML first
    let formatted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // **bold**
    formatted = formatted.replace(
        /\*\*(.*?)\*\*/gs,
        "<strong>$1</strong>"
    );

    // Remove *italic* markdown
    formatted = formatted.replace(
        /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
        "$1"
    );

    // Remove Markdown headings
    formatted = formatted.replace(
        /^#{1,6}\s+/gm,
        ""
    );

    // Inline code
    formatted = formatted.replace(
        /`([^`]+)`/g,
        "$1"
    );

    // Markdown bullets
    formatted = formatted.replace(
        /^\s*[\*\-]\s+/gm,
        "• "
    );

    // Line breaks
    formatted = formatted.replace(
        /\n/g,
        "<br>"
    );

    return formatted;
}

async function sendAIMessage() {

    const input = document.getElementById("aiUserInput");
    const question = input.value.trim();

    if (!question) return;

    // Show user's message
    addAIMessage(question, "user");

    // Clear input
    input.value = "";

    // Show thinking message
    addAIMessage("🌱 Thinking...", "bot");

    const messages = document.getElementById("aiChatMessages");
    const thinkingMessage = messages.lastElementChild;

    try {

        const response = await fetch(
            "https://crop-rescue.onrender.com/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: question
                })
            }
        );

        const data = await response.json();

        thinkingMessage.remove();

        if (!response.ok) {

            addAIMessage(
                "⚠️ I couldn't connect to Gemini right now.",
                "bot"
            );

            return;
        }

        // Add Gemini response with formatting
        const botMessage = document.createElement("div");

        botMessage.className =
            "ai-message bot-message";

        botMessage.innerHTML =
            formatAIResponse(data.reply);

        messages.appendChild(botMessage);

        messages.scrollTop =
            messages.scrollHeight;

    } catch (error) {

        thinkingMessage.remove();

        addAIMessage(
            "⚠️ The AI assistant is currently unavailable. Please check the Gemini connection.",
            "bot"
        );

        console.error(error);
    }
}

function scrollToResearchContent() {

    const researchContent =
        document.getElementById("researchContent");

    if (researchContent) {

        researchContent.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
}
