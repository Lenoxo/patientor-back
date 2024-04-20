"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// const cors = require('cors');
app.use(express_1.default.json());
// app.use(cors());
const PORT = 8080;
app.get('/api/ping', (_req, res) => {
    console.log('Something just pinged');
    res.send('pong');
});
app.listen(PORT, () => console.log(`Server open in port: ${PORT}`));
