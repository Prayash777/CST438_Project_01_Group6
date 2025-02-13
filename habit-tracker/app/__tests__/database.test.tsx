// // import 'react-native-console-time-polyfill';
// import React, { useEffect, useState } from "react";
// import { render } from '@testing-library/react-native';
// import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
// import { Text } from "react-native";

// // Mocking expo-sqlite methods
// jest.mock('expo-sqlite', () => ({
//     SQLiteProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
//     useSQLiteContext: () => ({
//         execAsync: jest.fn().mockResolvedValueOnce([{ result: 'some response' }]), // Mock execAsync
//         getAllAsync: jest.fn().mockResolvedValueOnce([{ email: 'test@example.com', password: 'password123' }]), // Mock getAllAsync
//     }),
// }));

// // Define the type for the user object returned by the query
// interface User {
//     email: string;
//     password: string;
// }

// const db = useSQLiteContext();

// // Test component that interacts with SQLite
// function TestDatabase() {
//     const [message, setMessage] = useState("");

//     useEffect(() => {
//         const setupDatabase = async () => {
//             try {
//                 // Drop table and recreate it as per the provided createDbIfNeeded function
//                 await db.execAsync("DROP TABLE IF EXISTS users");
//                 await db.execAsync(
//                     "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)"
//                 );

//                 // Insert a test user
//                 await db.execAsync("INSERT INTO users (email, password) VALUES ('test@example.com', 'password123')");

//                 // Fetch the inserted data
//                 const result = await db.getAllAsync<User>("SELECT email, password FROM users LIMIT 1");

//                 // Set message based on result
//                 if (result.length > 0) {
//                     const { email, password } = result[0];
//                     setMessage(`Email: ${email}, Password: ${password}`);
//                 } else {
//                     setMessage("No data found");
//                 }
//             } catch (error: unknown) {
//                 // Type assertion to handle the error
//                 if (error instanceof Error) {
//                     setMessage("Error: " + error.message);
//                 } else {
//                     setMessage("An unknown error occurred");
//                 }
//             }
//         };

//         setupDatabase();
//     }, [db]);

//     return <Text>{message}</Text>;
// }

// const logTets() => {
//     console.log("User inserted successfully!");
//     const dbref = await db.getAllAsync("SELECT * FROM users");
//     console.log("Users in DB:", dbref);
// }

// // Test suite
// describe("SQLite Database", () => {
//     it("should create a table, insert a record, and retrieve it", async () => {
//         function App() {
//             return (
//                 <SQLiteProvider databaseName="test.db">
//                     <TestDatabase />
//                 </SQLiteProvider>
//             );
//         }

//         // Render the component
//         const { findByText } = render(<App />);

//         // console.log("User inserted successfully!");
//         // const dbref = await db.getAllAsync("SELECT * FROM users");
//         // console.log("Users in DB:", dbref);

//         // Wait for the message to appear on the screen
//         await findByText("Email: test@example.com, Password: password123");

//         // Assert the inserted data is displayed
//         expect(await findByText("Email: test@example.com, Password: password123")).not.toBeNull();
//     });
// });



// mock tempate
// Mocking expo-sqlite methods
// jest.mock('expo-sqlite', () => ({
//     SQLiteProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
//     useSQLiteContext: () => ({
//         execAsync: jest.fn().mockResolvedValueOnce([{ result: 'some response' }]), // Mock execAsync
//         getAllAsync: jest.fn().mockResolvedValueOnce([{ email: 'test@example.com', password: 'password123' }]), // Mock getAllAsync
//     }),
// }));


// function TestDatabase() {
//     const db = useSQLiteContext();
//     const [message, setMessage] = useState("");

//     useEffect(() => {
//         const setupDatabase = async () => {
//             try {
//                 // Drop table and recreate it as per the provided createDbIfNeeded function
//                 await db.execAsync("DROP TABLE IF EXISTS users");
//                 await db.execAsync(
//                     "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)"
//                 );

//                 // Insert a test user
//                 await db.execAsync("INSERT INTO users (email, password) VALUES ('test@example.com', 'password123')");

//                 // Fetch the inserted data
//                 const result = await db.getAllAsync<User>("SELECT email, password FROM users LIMIT 1");

//                 // Log the result here
//                 console.log("Database Query Result:", result);

//                 // Set message based on result
//                 if (result.length > 0) {
//                     const { email, password } = result[0];
//                     setMessage(`Email: ${email}, Password: ${password}`);
//                 } else {
//                     setMessage("No data found");
//                 }
//             } catch (error: unknown) {
//                 // Type assertion to handle the error
//                 if (error instanceof Error) {
//                     setMessage("Error: " + error.message);
//                 } else {
//                     setMessage("An unknown error occurred");
//                 }
//             }
//         };

//         setupDatabase();
//     }, [db]);

//     return <Text>{message}</Text>;
// }

//**
// Testing the Database
//  */
import React, { useEffect, useState } from "react";
import { render, waitFor } from '@testing-library/react-native';
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { Text } from "react-native";

import database from "../db/database";
import { insertUser, getAllUsers } from '../db/database';

jest.mock('expo-sqlite', () => ({
    SQLiteProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useSQLiteContext: () => ({
        execAsync: jest.fn().mockResolvedValue([{ result: 'some response' }]), // Mock execAsync
        getAllAsync: jest.fn().mockResolvedValue([{ email: 'test@example.com', password: 'password123' }]), // Mock getAllAsync
        runAsync: jest.fn().mockResolvedValue({ insertId: 1, rowsAffected: 1 }), // Mock runAsync
    }),
    openDatabaseSync: jest.fn(() => ({
        execAsync: jest.fn().mockResolvedValue([{ result: 'some response' }]),
        getAllAsync: jest.fn().mockResolvedValue([{ email: 'test@example.com', password: 'password123' }]),
        runAsync: jest.fn().mockResolvedValue({ insertId: 1, rowsAffected: 1 }),
    })),
}));

// Define the type for the user object returned by the query
interface User {
    email: string;
    password: string;
}

function TestDatabase() {
    // const db = useSQLiteContext();
    const db = database;
    const [message, setMessage] = useState("");

    useEffect(() => {
        const setupDatabase = async () => {
            try {
                // Use the existing table
                // Insert a test user into the real `users` table
                await db.execAsync("INSERT INTO users (username,email, password) VALUES ('testName', 'test@example.com', 'password123')");

                // Fetch the inserted data from the existing table
                const result = await db.getAllAsync<User>("SELECT email, password FROM users LIMIT 1");

                // Log the result here
                console.log("Database Query Result:", result);

                // Set message based on result
                if (result.length > 0) {
                    const { email, password } = result[0];
                    setMessage(`Email: ${email}, Password: ${password}`);
                } else {
                    setMessage("No data found");
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setMessage("Error: " + error.message);
                } else {
                    setMessage("An unknown error occurred");
                }
            }
        };

        setupDatabase();
    }, [db]);

    return <Text>{message}</Text>;
}

// interface User {
//     id: number;
//     username: string;
//     email: string;
//     password: string;
// }

// describe("SQLite Database", () => {
//     it("should insert a record into the users table and retrieve it", async () => {
//         // Insert a test user
//         await database.runAsync(
//             "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
//             ["testuser", "test@example.com", "password123"]
//         );

//         // Function to fetch users
//         const getAllUsers = async () => {
//             const users = await database.getAllAsync("SELECT * FROM users");
//             console.log("Users in DB:", users); // Debugging log
//             return users;
//         };

//         // Fetch users
//         const users = await getAllUsers();
//         console.log("Users Retrieved:", users); // Debugging log

//         // Ensure at least one user is returned
//         expect(users.length).toBeGreaterThan(0);

//         const user = users[0];

//         // Debugging log
//         console.log("Retrieved User Object:", JSON.stringify(user, null, 2));

//         // Ensure all expected fields are present
//         expect(user).toHaveProperty("username");
//         expect(user).toHaveProperty("email");
//         expect(user).toHaveProperty("password");

//         // Assert user object matches expected values
//         expect(user).toMatchObject({
//             username: "testuser",
//             email: "test@example.com",
//             password: "password123",
//         });
//     });
// });

describe("SQLite Database", () => {
    it("should create a table, insert a record, and retrieve it", async () => {
        function App() {
            return (
                <SQLiteProvider databaseName="habit-tracker.db">
                    <TestDatabase />
                </SQLiteProvider>
            );
        }

        // Render the component
        const { findByText } = render(<App />);

        // Wait for the message to appear on the screen
        await findByText("Email: test@example.com, Password: password123");

        // Log the database result to the console
        // const db = useSQLiteContext();
        // const db = database;
        // const dbref = await db.getAllAsync("SELECT * FROM users");
        // console.log("Users in DB:", dbref); // This will log the mocked value
        console.log("USERS::");
        // testing to see users in database
        getAllUsers();

        // Assert the inserted data is displayed
        expect(await findByText("Email: test@example.com, Password: password123")).not.toBeNull();
    });
});
