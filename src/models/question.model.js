const mongoose = require("mongoose");


const questionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        priority: {
            type: String,
            enum: ["none", "low", "medium", "high" ],
            default: "none",
        },
        options: [
            {
                title: {
                    type: String,
                    required: true,
                },
                isTrue: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        type: {
            type: String,
            enum: ["SINGLECHOICE", "MULTIPLECHOICE", "TEXT"],
            required: true,
        },
    },
    { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
