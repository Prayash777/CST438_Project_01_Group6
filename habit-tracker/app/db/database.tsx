import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';

// creating the sqlite database
const createDbIfNeeded = async (db: SQLiteDatabase) => {
    console.log("Creating database");

    let response;

    try {
        // for developement purposes to get a clean table
        // comment out to save tables per expo app start
        // response = await db.execAsync(
        //     "DROP TABLE IF EXISTS users"
        // );

        // Create a table
        response = await db.execAsync(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT NOT NULL,
                password TEXT NOT NULL,
                graph TEXT
            );

            CREATE TABLE IF NOT EXISTS graphs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                graph_id TEXT NOT NULL UNIQUE,
                graph_data TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
            `);
        console.log("Database created", response);
    } catch (error) {
        console.error("Error creating database:", error);
    }
};

// Insert a new user
export const insertUser = async (username: string, email: string, password: string) => {
    try {
        await database.runAsync(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, password]
        );
        console.log("User inserted successfully!");
    } catch (error) {
        console.error("Error inserting user:", error);
    }
};

// Get all users
export const getAllUsers = async () => {
    try {
        const users = await database.getAllAsync(`SELECT * FROM users`);
        console.log("Users fetched:::", users);
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

// insert graphs
export const insertGraph = async (graph: string) => {
    try {
        const graph = await database.runAsync(`
            INSERT INTO graphs (user_id, graph_id, graph_data)
            VALUES (1, 'habit-tracker', {"name: })
            `)
    } catch (error) {
        console.error("Error inserting graph: ", error);
    }
}

// get graphs
export const getGraphs = async () => {
    try {
        const graphs = await database.getAllSync('SELECT * FROM graphs');
        console.log("Graph fetched:::", graphs);
        return graphs;
    } catch (error) {
        console.error("Error inserting graph: ", error);
    }
}

const database = openDatabaseSync('habit-tracker.db');
createDbIfNeeded(database);

export default database;