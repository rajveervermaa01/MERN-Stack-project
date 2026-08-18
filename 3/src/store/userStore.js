/**
 * In-memory user store (file-backed persistence)
 * Simulates a database so MongoDB is not required.
 * In production, replace with Mongoose User model.
 */
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'users.json');

function readUsers() {
    if (!fs.existsSync(DB_PATH)) return [];
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch {
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

function findByEmail(email) {
    return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

function findById(id) {
    return readUsers().find((u) => u.id === id) || null;
}

function createUser({ id, name, email, passwordHash, role, createdAt }) {
    const users = readUsers();
    const user = { id, name, email, passwordHash, role, createdAt };
    users.push(user);
    writeUsers(users);
    return user;
}

module.exports = { findByEmail, findById, createUser, readUsers };
