 'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/SignUp.module.css';
import { Client, Databases, ID } from 'appwrite';
import { useRouter } from 'next/navigation';

// Appwrite client setup
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

// Generate random letter and number
function getRandomLetter() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function getRandomNumber() {
  return Math.floor(Math.random() * 10);
}

// Generate SCode like A123-BCD9-EFG2-HIJ8
function generateRandomCode() {
  const part1 = `${getRandomLetter()}${getRandomNumber()}${getRandomNumber()}${getRandomNumber()}`;
  const part2 = `${getRandomLetter()}${getRandomLetter()}${getRandomLetter()}${getRandomNumber()}`;
  const part3 = `${getRandomLetter()}${getRandomLetter()}${getRandomLetter()}${getRandomNumber()}`;
  const part4 = `${getRandomLetter()}${getRandomLetter()}${getRandomLetter()}${getRandomNumber()}`;
  return `${part1}-${part2}-${part3}-${part4}`;
}

export default function SignUp() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [allEmail, setAllEmail] = useState([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('yourname@sparkus.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sCode, setSCode] = useState('');

  // Set SCode once on mount
  useEffect(() => {
    setSCode(generateRandomCode());
  }, []);

  // Fetch existing account data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
          process.env.NEXT_PUBLIC_APPWRITE_LOGINPAGE_COLLECTION_ID || ''
        );
        setAccounts(response.documents);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchData();
  }, []);

  // Extract all emails
  useEffect(() => {
    setAllEmail(accounts.map((acc) => acc.Email?.toLowerCase()));
  }, [accounts]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (allEmail.includes(email.toLowerCase())) {
      alert('This email already exists!');
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length > 10) {
      alert("Password must be 10 characters or fewer.");
      return;
    }

    if (isNaN(phoneNo) || phoneNo.length !== 10) {
      alert("Phone number must be a valid 10-digit number.");
      return;
    }

    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        process.env.NEXT_PUBLIC_APPWRITE_LOGINPAGE_COLLECTION_ID || '',
        ID.unique(),
        {
          Name: name,
          Email: email,
          Password: password,
          SCode: sCode,
          PhoneNo: parseInt(phoneNo, 10),
          DateOfBirth: dateOfBirth,
          PremiemAccount: 'No'
        }
      );

      localStorage.setItem('Login', 'true');
      localStorage.setItem('Email', email);
      localStorage.setItem('Password', password);
      localStorage.setItem('OSActivated', 'true');

      alert("Thanks for creating an account! You're now logged in to LuminaOS!");
      router.push('/lumina-os');
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'name':
        setName(value);
        const modifiedEmail = value.replace(/\s/g, '').toLowerCase();
        setEmail(`${modifiedEmail}@sparkus.com`);
        break;
      case 'email':
        setEmail(value.toLowerCase());
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'phoneNo':
        setPhoneNo(value);
        break;
      case 'dateofbirth':
        setDateOfBirth(value);
        break;
      default:
        break;
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.login}>
        <h2 className={styles.Heading}>SignUp to LuminaOS</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your Name..."
            required
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            autoComplete="off"
            className={styles.input}
            placeholder="Enter your Email..."
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your Password..."
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            className={styles.input}
            placeholder="Confirm your Password..."
            required
          />
          <input
            type="date"
            name="dateofbirth"
            value={dateOfBirth}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="tel"
            name="phoneNo"
            value={phoneNo}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your Phone Number..."
            maxLength={10}
            pattern="[0-9]{10}"
            required
          />
          <input
            type="submit"
            value="Sign Up"
            className={styles.btn}
          />
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </main>
  );
}
