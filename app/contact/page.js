'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/Setup.module.css';
import { Client, Databases, ID } from 'appwrite';

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [databases, setDatabases] = useState(null);

    useEffect(() => {
        // Restore email from localStorage (browser only)
        const localEmail = localStorage.getItem('Email');
        if (localEmail) setEmail(localEmail);

        // Initialize Appwrite client (browser only)
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

        const db = new Databases(client);
        setDatabases(db);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!databases) {
            alert('App is still initializing. Please try again shortly.');
            return;
        }

        try {
            await databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_COUNTACTPAGE_COLLECTION_ID,
                ID.unique(),
                {
                    Name: name,
                    Email: email,
                    Message: message
                }
            );

            setName('');
            setMessage('');
            alert('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') setName(value);
        else if (name === 'email') setEmail(value);
        else if (name === 'message') setMessage(value);
    };

    return (
        <main className={styles.main}>
            <div className={styles.login}>
                <h2 className={styles.Heading}>Feel free while contacting us!</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Enter your name..."
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Enter your email..."
                        required
                    />
                    <textarea
                        name="message"
                        value={message}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Enter your message..."
                        required
                        rows="4"
                    />
                    <input
                        type="submit"
                        value="Submit"
                        className={styles.btn}
                    />
                </form>
            </div>
        </main>
    );
}
