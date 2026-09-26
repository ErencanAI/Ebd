"use strict";

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// JSON ve form verileri
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "20mb"
}));

// HTML, CSS, JS ve diğer dosyaları yayınla
app.use(express.static(__dirname));

// Ana sayfa
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Sağlık kontrolü
app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        name: "EduMind AI",
        status: "online",
        ai: "local",
        apiKeyRequired: false,
        time: new Date().toISOString()
    });
});

// Basit AI endpoint
app.post("/api/chat", (req, res) => {

    const message =
        typeof req.body.message === "string"
            ? req.body.message.trim()
            : "";

    if (!message) {
        return res.status(400).json({
            ok: false,
            error: "Mesaj boş."
        });
    }

    const answer = localAI(message);

    res.json({
        ok: true,
        answer
    });
});

function localAI(message) {

    const text =
        message.toLocaleLowerCase("tr-TR");

    if (
        text.includes("merhaba") ||
        text.includes("selam")
    ) {
        return "Merhaba! Ben EduMind AI. Ders, konu veya çalışma hakkında konuşabiliriz.";
    }

    if (text.includes("adın ne")) {
        return "Ben EduMind AI, eğitim odaklı yapay zekâ asistanıyım.";
    }

    if (text.includes("fotosentez")) {
        return "Fotosentez, bitkilerin ışık enerjisini kullanarak karbondioksit ve sudan besin üretmesidir. Bu süreçte oksijen açığa çıkar.";
    }

    if (text.includes("html")) {
        return "HTML bir web sayfasının yapısını oluşturur. CSS görünümü, JavaScript ise etkileşimi ve davranışları kontrol eder.";
    }

    if (
        text.includes("matematik") &&
        text.includes("yardım")
    ) {
        return "Matematik sorusunu gönder. Verilenleri belirleyip işlemleri adım adım açıklayabilirim.";
    }

    if (
        text.includes("quiz") ||
        text.includes("test")
    ) {
        return "Quiz oluşturmak için Belge AI bölümüne ders metnini ekleyebilirsin.";
    }

    return `"${message}" mesajını aldım. Bu sunucudaki yerel AI motoru temel eğitim sohbetlerini destekliyor.`;
}


// 404
app.use((req, res) => {

    res.status(404).json({
        ok: false,
        error: "Sayfa veya API bulunamadı."
    });

});

app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("=================================");
    console.log("      EDUMIND AI SERVER");
    console.log("=================================");
    console.log("Server aktif.");
    console.log("Port:", PORT);
    console.log("API key gerekli: HAYIR");
    console.log("=================================");
    console.log("");

});
