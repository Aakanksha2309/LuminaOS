'use client';

import { useEffect, useState } from 'react'
import styles from '@/styles/Setup.module.css'
import { Client, Databases, ID } from "appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const localEmail = localStorage.getItem('Email');
        if (localEmail) {
            setEmail(localEmail);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            // Clear form after successful submission
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
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'message':
                setMessage(value);
                break;
            default:
                break;
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.login}>
                <h2 className={styles.Heading}>Feel free while contacting us!</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={handleChange}
                        name="name"
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
                    <input
                        type="text"
                        name="message"
                        value={message}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Enter your message..."
                        required
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