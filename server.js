require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

app.get("/", (req, res) => {
    res.json({
        message: "BIVAN.EXE backend is alive"
    });
});

app.get("/api/test-db", async (req, res) => {
    const { data, error } = await supabase
        .from("players")
        .select("id")
        .limit(1);

    if (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
       
    }

    res.json({
        success: true,
        message: "Supabase connection works"
    });
});
 app.post("/api/scores", async (req, res) => {
    const { username, gender, score } = req.body;

    if (!username || !gender || score === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    if (!["male", "female"].includes(gender)) {
        return res.status(400).json({
            success: false,
            message: "Invalid gender"
        });
    }

    if (!Number.isInteger(score) || score < 0 || score > 10000) {
        return res.status(400).json({
            success: false,
            message: "Invalid score"
        });
    }

    const { data, error } = await supabase
        .from("players")
        .insert([
            {
                username: username.trim(),
                gender: gender,
                score: score
            }
        ])
        .select()
        .single();

    if (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to save score"
        });
    }

    res.status(201).json({
        success: true,
        player: data
    });
});
app.get("/api/leaderboard", async (req, res) => {
    const { data, error } = await supabase
        .from("players")
        .select("username, gender, score, created_at")
        .order("score", { ascending: false });

    if (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to load leaderboard"
        });
    }

    res.json({
        success: true,
        players: data
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`BIVAN.EXE backend running on port ${PORT}`);
});