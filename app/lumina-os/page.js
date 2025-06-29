'use client'

import { BsFillLightningChargeFill } from 'react-icons/bs'
import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import { Client, Databases, Query } from 'appwrite';
import styles from '../../styles/Homepage.module.css'
import CustomCursor from '@/components/CustomCursor';
import Home from '../../components/Home';

const client = new Client()
    .setEndpoint(`${process.env.NEXT_PUBLIC_APPWRITE_URL}`)
    .setProject(`${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);

const databases = new Databases(client);

const LuminaOS = ({ onTextBoxHover, onTextBoxLeave }) => {
    const [accounts, setAccounts] = useState([]);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [selectedWindow, setSelectedWindow] = useState("Start");
    const [selectedCode, setSelectedCode] = useState("Setup");
    const [activateLoad, setActivateLoad] = useState(true);
    const [lockscreen, setLockscreen] = useState("close")
    const [text, setText] = useState("Activating your LuminaOS. Please wait...");
    const [startupProgress, setStartupProgress] = useState(0);

    // Ensure pin state is properly initialized
    useEffect(() => {
        if (pin === undefined) {
            setPin('');
        }
    }, [pin]);

    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value.toLowerCase());
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        } else if (e.target.name === 'pin') {
            setPin(e.target.value || '');
        }
    };

    // Startup loading bar effect
    useEffect(() => {
        if (selectedWindow === "Start") {
            const timer = setInterval(() => {
                setStartupProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        console.log("GG")
                        clearInterval(timer);
                        // Move to next step after loading completes
                        setTimeout(() => {
                            if (localStorage.getItem("LoginDone") != "true") {
                                console.log("GG2")
                                console.log(lockscreen)
                                console.log(localStorage.getItem("SetupDone"))
                                setSelectedWindow("Login");
                            } else if (localStorage.getItem("OSActivated") != "true") {
                                console.log("GG3")
                                console.log(lockscreen)
                                console.log(localStorage.getItem("SetupDone"))
                                setSelectedWindow("ActivateOS");
                            } else if (!localStorage.getItem("Pin")) {
                                console.log(lockscreen)
                                console.log("GG4")
                                console.log(localStorage.getItem("SetupDone"))
                                setSelectedWindow("Pin");
                            } else if(localStorage.getItem("SetupDone") != "true") {
                                console.log("GG5")
                                console.log(lockscreen)
                                console.log(localStorage.getItem("SetupDone"))
                                setSelectedWindow("FinalSetup");
                            }
                            else if (localStorage.getItem("SetupDone") == "true" && lockscreen != "open") {
                                console.log("GG6")
                                console.log(lockscreen)
                                console.log(localStorage.getItem("SetupDone"))
                                setSelectedCode("LockScreen");
                                setSelectedWindow("")
                            } else {
                                setSelectedCode("Home")
                            }
                            
                            // Fetch data after startup completes
                            const fetchData = async () => {
                                try {
                                    const response = await databases.listDocuments(
                                        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                                        process.env.NEXT_PUBLIC_APPWRITE_LOGINPAGE_COLLECTION_ID
                                    );
                                    setAccounts(response.documents);
                                    if (accounts.length > 0) {
                                        console.log(accounts);
                                    }
                                    console.log(response.documents);
                                } catch (error) {
                                    console.error(error);
                                };
                            };
                            fetchData();
                        }, 1000);
                        return 100;
                    }
                    return prevProgress + Math.random() * 8 + 2; // Random progress between 2-10
                });
            }, 150);

            return () => clearInterval(timer);
        }
    }, [selectedWindow, lockscreen]);

    const handleClick = () => {
        if (selectedWindow == "Login") {
            try {
                if (password.length > 10) {
                    const red = document.getElementById('red');
                    red.innerHTML = 'Password length must be smaller or equal to 10!';
                } else {
                    let found = false;
                    for (let i = 0; i < accounts.length; i++) {
                        const tryMail = accounts[i]['Email'].toLowerCase();
                        if (tryMail) {
                            console.log(tryMail);
                            console.log(email);
                        }
                        if (tryMail === email) {
                            const tryPassCode = accounts[i]['Password'];
                            if (tryPassCode) {
                                console.log(tryPassCode);
                                console.log(password);
                            }
                            if (tryPassCode === password) {
                                localStorage.clear();
                                localStorage.setItem('Email', email);
                                localStorage.setItem('Password', password);
                                localStorage.setItem('LoginDone', 'true');
                                localStorage.setItem('i', i + 1);
                                alert('You are now logged in successfully!');
                                found = true;
                                let login = document.getElementById("login");
                                login.innerHTML = "";
                                login.style.width = "4%";
                                login.style.height = "6%";
                                login.style.margin = "47vh 0vh";
                                login.style.borderRadius = "1.5vh";
                                setTimeout(() => {
                                    setSelectedWindow("Loading");
                                }, 1510);
                                setTimeout(() => {
                                    let loading = document.getElementById("loading");
                                    loading.innerHTML = "";
                                    loading.style.width = "95vw";
                                    loading.style.height = "90vh";
                                    loading.style.margin = "5vh 0vh";
                                    loading.style.borderRadius = "1.5vh";
                                }, 4000);
                                const response = databases.listDocuments(
                                    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                                    process.env.NEXT_PUBLIC_APPWRITE_LOGINPAGE_COLLECTION_ID,
                                    [Query.equal('Email', email)]
                                );
                                setAccounts(response.documents);
                                if (accounts.length > 0 && accounts[0].SCode.length !== 0) {
                                    localStorage.setItem('OSActivated', 'true');
                                }
                                setTimeout(() => {
                                    let activate = document.getElementById("activate");
                                    setSelectedWindow("ActivateOS");
                                }, 5510);
                                setTimeout(() => {
                                    setActivateLoad(false);
                                    let btn = document.getElementById("btn")
                                    btn.style.visibility = "visible";
                                    setText("Your LuminaOS is now activated...")
                                }, 7000);
                                break;
                            }
                        }
                    }
                    if (!found) {
                        const red = document.getElementById('red');
                        red.innerHTML = 'Invalid details! Please try again...';
                    }
                }
            } catch (error) {
                alert('Something went wrong! Please try again!');
                console.error('Error: ' + error);
            }
        } else if (selectedWindow == "ActivateOS") {
            let login = document.getElementById("activate");
            login.innerHTML = "";
            login.style.width = "4%";
            login.style.height = "6%";
            login.style.margin = "47vh 0vh";
            login.style.borderRadius = "1.5vh";
            localStorage.setItem("OSActivated", "true");
            setTimeout(() => {
                setSelectedWindow("Loading");
            }, 1510);
            setTimeout(() => {
                let loading = document.getElementById("loading");
                loading.style.width = "95vw";
                loading.style.height = "90vh";
                loading.style.margin = "5vh 0vh";
                loading.style.borderRadius = "1.5vh";
            }, 4000);
            setTimeout(() => {
                setSelectedWindow("PinSetup");
            }, 5510);
        } else if (selectedWindow == "FinalSetup") {
            let name = document.getElementById("name").value;
            let theme = document.getElementById("theme").value;
            let ai = document.getElementById("ai").value;
            let city = document.getElementById("city").value;
            let reason = document.getElementById("reason").value;
            localStorage.setItem("Name", name);
            localStorage.setItem("Theme", theme);
            localStorage.setItem("AI", ai);
            localStorage.setItem("city", city);
            localStorage.setItem("Reason", reason);
            localStorage.setItem("SetupDone", "true");
            localStorage.setItem("finalSetup", "true");
            let login = document.getElementById("setup");
            login.innerHTML = "";
            login.style.width = "4%";
            login.style.height = "6%";
            login.style.margin = "47vh 0vh";
            login.style.borderRadius = "1.5vh";
            setTimeout(() => {
                setSelectedWindow("Loading");
            }, 1510);
            setTimeout(() => {
                let loading = document.getElementById("loading");
                loading.style.width = "95vw";
                loading.style.height = "90vh";
                loading.style.margin = "5vh 0vh";
                loading.style.borderRadius = "1.5vh";
            }, 4000);
            setTimeout(() => {
                setSelectedCode("LockScreen");
            }, 5510);
        } else if (selectedWindow == "PinSetup") {
            if (pin) {
                localStorage.setItem("Pin", pin);
            } else {
                document.getElementById("redpin").innerHTML = "Please enter a pin!"
            }
            let pinsetup = document.getElementById("pinsetup");
            pinsetup.innerHTML = "";
            pinsetup.style.width = "4%";
            pinsetup.style.height = "6%";
            pinsetup.style.margin = "47vh 0vh";
            pinsetup.style.borderRadius = "1.5vh";
            setTimeout(() => {
                setSelectedWindow("Loading");
            }, 1510);
            setTimeout(() => {
                let loading = document.getElementById("loading");
                loading.style.width = "95vw";
                loading.style.height = "90vh";
                loading.style.margin = "5vh 0vh";
                loading.style.borderRadius = "1.5vh";
            }, 4000);
            setTimeout(() => {
                setSelectedWindow("Extension");
            }, 5510);
        } else if (selectedWindow == "Extension") {
            let pinsetup = document.getElementById("extension");
            pinsetup.innerHTML = "";
            pinsetup.style.width = "4%";
            pinsetup.style.height = "6%";
            pinsetup.style.margin = "47vh 0vh";
            pinsetup.style.borderRadius = "1.5vh";
            setTimeout(() => {
                setSelectedWindow("Loading");
            }, 1510);
            setTimeout(() => {
                let loading = document.getElementById("loading");
                loading.style.width = "95vw";
                loading.style.height = "90vh";
                loading.style.margin = "5vh 0vh";
                loading.style.borderRadius = "1.5vh";
            }, 4000);
            setTimeout(() => {
                setSelectedWindow("FinalSetup");
            }, 5510);
        }
    };
    const [name, setName] = useState('');
    useEffect(() => {
        setName(localStorage.getItem('Name'));
    }, []);

    useEffect(() => {
        if (selectedCode == "LockScreen") {
            const interval = setInterval(() => {
                const date = new Date();
                let hh = date.getHours();
                let mm = date.getMinutes();
                let ss = date.getSeconds();
                let d = date.getDate();
                let m = date.getMonth();
                let y = date.getFullYear();
                m++;
                let ampm = 'AM';
                if (hh >= 12) {
                    ampm = 'PM';
                }
                if (hh < 10) {
                    hh = '0' + hh;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                if (ss < 10) {
                    ss = '0' + ss;
                }
                const time = `${hh}:${mm} ${ampm}`;
                const cdate = `${d}-${m}-${y}`;
                
                // Wait for elements to be available
                setTimeout(() => {
                    const timeElement = document.getElementById('time');
                    const dateElement = document.getElementById('date');
                    if (timeElement) timeElement.innerHTML = time;
                    if (dateElement) dateElement.innerHTML = cdate;
                }, 100);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [selectedCode]);

    // Prevent scrollbars on lockscreen
    useEffect(() => {
        if (selectedCode === "LockScreen") {
            // Ensure body and html don't have scrollbars
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            return () => {
                // Cleanup when component unmounts
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            };
        }
    }, [selectedCode]);

    const handlePinSubmit = (e) => {
        e.preventDefault();
        const input = document.getElementById('password').value;
        if (input === localStorage.getItem("Pin")) {
            setSelectedCode("Home");
            setLockscreen("open");
            localStorage.setItem("finalSetup", "false");
        } else {
            alert('Invalid pin! Try again.');
        }
    };

    return (
        <div className={styles.Div1}>
            {selectedWindow == "Start" && <div>
                <Head>
                    <title>Start LuminaOS</title>
                </Head>
                <main className={styles.main1}>
                    <div className={styles.icon}>
                        <BsFillLightningChargeFill className={styles.light} />
                    </div>
                    <h2 className={styles.startscreen}>Starting LuminaOS</h2>
                    
                    {/* Stylish Loading Bar */}
                    <div className={styles.startupLoadingContainer}>
                        <div className={styles.startupLoadingBar}>
                            <div 
                                className={styles.startupProgress} 
                                style={{ width: `${startupProgress}%` }}
                            />
                            <div className={styles.startupGlow} style={{ width: `${startupProgress}%` }} />
                        </div>
                        <div className={styles.startupLoadingText}>
                            Initializing System... {Math.round(startupProgress)}%
                        </div>
                    </div>
                </main>
            </div>}
            {selectedCode == "Setup" && <div>
                <Head>
                    <title>SetUp LuminaOS</title>
                </Head>
                <main className={styles.main2}>
                    <img className={styles.img1} src="SetupWallpaper.jpg" />
                    {selectedWindow == "Login" && <div id="login" className={styles.Login}>
                        <h1>Login to LuminaOS</h1>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className={styles.inputSetup}
                            onChange={handleChange}
                            value={email}
                            placeholder="Enter your email..."
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className={styles.inputSetup}
                            value={password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                        <button onClick={handleClick} className={styles.btnstart}>Next</button>
                        <p id="red" className={styles.red}></p>
                        <p>
                            Don't have an account? <a href="/SignUp">Sign Up</a> for free!
                        </p>
                        <p>
                            Forgot your password? <a href="/Setup">Reset it</a>.
                        </p>
                    </div>}
                    {selectedWindow == "Loading" && <div id="loading" className={styles.Loading}>
                        <div className={styles.Load}></div>
                    </div>}
                    {selectedWindow == "ActivateOS" && <div id='activate' className={styles.Activate}>
                        <h1>{text}</h1>
                        {activateLoad && <div className={styles.ActivateLoad}></div>}
                        <button id="btn" onClick={handleClick} className={styles.activateBtn}>Next</button>
                    </div>}
                    {selectedWindow == "PinSetup" && <div id='pinsetup' className={styles.Activate}>
                        <h1>Enter a pin.</h1>
                        <input
                            type="password"
                            name="pin"
                            id="pin"
                            className={styles.inputSetup}
                            onChange={handleChange}
                            value={pin}
                            placeholder="Enter your pin..."
                            required
                        />
                        <p id="redpin" className={styles.red}></p>
                        <button id="btn" onClick={handleClick} className={styles.btnstart}>Next</button>
                    </div>}
                    {selectedWindow == "Extension" && <div id='extension' className={styles.Activate}>
                        <h1>Pin set successfully.</h1>
                        <button id="btn" onClick={handleClick} className={styles.btnstart}>Next</button>
                    </div>}
                    {selectedWindow == "FinalSetup" && <div id='setup' className={styles.Setup}>
                        <h1>Let's complete the final setup</h1>
                        <input onMouseEnter={onTextBoxHover} onMouseLeave={onTextBoxLeave} type="text" name="name" id="name" className={styles.inputSetup} placeholder="Name your PC..." required />
                        <select className={styles.SetupInput} id="theme" defaultValue="Select Theme">
                            <option className={styles.option}>Select Theme</option>
                            <option className={styles.option}>Dark Theme</option>
                            <option className={styles.option}>Light Theme (Coming Soon)</option>
                        </select>
                        <input onMouseEnter={onTextBoxHover} onMouseLeave={onTextBoxLeave} type="checkbox" name="ai" id="ai" className={styles.checkbox} />
                        <label htmlFor="ai">Ai powered OS</label>
                        <input onMouseEnter={onTextBoxHover} onMouseLeave={onTextBoxLeave} type="text" name="city" id="city" className={styles.SetupInput} placeholder="Enter your city..." />
                        <input onMouseEnter={onTextBoxHover} onMouseLeave={onTextBoxLeave} type="text" name="reason" id="reason" className={styles.SetupInput} placeholder="Why you want to use LuminaOS?" />
                        <input onMouseEnter={onTextBoxHover} onMouseLeave={onTextBoxLeave} type="checkbox" name="agree" id="agree" required className={styles.checkbox} />
                        <label htmlFor="ai">Agree our <a href="/Setup">Terms & Conditions</a>?</label>
                        <button id="btn" onClick={handleClick} className={styles.btnstart}>Next</button>
                    </div>}
                </main>
            </div>}
            {selectedCode == "LockScreen" && <div>
                <Head>
                    <title>LockScreen -- {name}</title>
                </Head>
                <main className={styles.mainlock}>
                    <div className={styles.imgWrapperlock}>
                        <img src="/LockScreenWallpapers/1.jpg" alt="Wallpaper" className={styles.imglock} />
                    </div>
                    <div className={styles.Timelock} id="time"></div>
                    <div className={styles.Datelock} id="date"></div>
                    <div className={styles.divlock}>
                        <div className={styles.Namelock}>{name}</div>
                        <form onSubmit={handlePinSubmit}>
                            <input onMouseEnter={onTextBoxHover} onMouseLeave={onTextBoxLeave} className={styles.inputlock} type="password" name="password" id="password" placeholder="Enter your pin..." />
                            <input onMouseEnter={onTextBoxHover} onMouseLeave={onTextBoxLeave} type="submit" id="btn" value="Unlock" className={styles.btnlock} />
                        </form>
                    </div>
                </main>
            </div>}
            {selectedCode == "Home" && <div>
                <Head>
                    <title>{name}'s LuminaOS</title>
                </Head>
                <Home />
                
            </div>}
        </div>
    )
}

export default LuminaOS