'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/SignUp.module.css';
import { Client, Databases, ID } from 'appwrite';
import { useRouter } from 'next/navigation';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

function getRandomLetter() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function getRandomNumber() {
  return Math.floor(Math.random() * 10);
}

function generateRandomCode() {
  let code = '';
  for (let i = 0; i < 4; i++) {
    if (i === 1 || i === 3) {
      code += '-';
    }
    if (i === 0) {
      code += getRandomLetter();
    } else {
      code += getRandomNumber();
    }
    code += getRandomLetter();
    code += getRandomLetter();
    code += getRandomLetter();
  }
  return code;
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

  useEffect(() => {
    setSCode(generateRandomCode());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_LOGINPAGE_COLLECTION_ID
        );
        setAccounts(response.documents);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const emails = accounts.map((acc) => acc.Email);
    setAllEmail(emails);
  }, [accounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (allEmail.includes(email)) {
      alert('This email already exists!');
    } else if (password !== confirmPassword) {
      alert("Password doesn't match confirmed password!");
    } else if (password.length > 10) {
      alert('Password length must be smaller or equal to 10');
    } else {
      try {
        await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_LOGINPAGE_COLLECTION_ID,
          ID.unique(),
          {
            Name: name,
            Email: email,
            Password: password,
            SCode: sCode,
            PhoneNo: phoneNo,
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
        alert('An error occurred! Please contact us if the problem is not resolved automatically.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setEmail(value.toLowerCase());
        break;
      case 'password':
        setPassword(value);
        break;
      case 'name':
        setName(value);
        const modifiedName = value.replace(/\s/g, '').toLowerCase();
        setEmail(`${modifiedName}@sparkus.com`);
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
            placeholder="Enter your email..."
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            autoComplete="off"
            className={styles.input}
            placeholder="Enter a password..."
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            className={styles.input}
            placeholder="Confirm your password..."
            required
          />
          <input
            type="date"
            name="dateofbirth"
            value={dateOfBirth}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your Date Of Birth..."
            required
          />
          <input
            type="number"
            name="phoneNo"
            value={phoneNo}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your Phone No..."
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