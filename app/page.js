import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { BsFillLightningChargeFill } from 'react-icons/bs'
import Link from 'next/link'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <h2 className={styles.logo}>LuminaOS</h2>
        <div className={styles.thirteen}>
          <BsFillLightningChargeFill className={styles.light} />
        </div>
      </div>

      <div className={styles.grid}>
        <Link
          href="/lumina-os"
          className={styles.card}
        >
          <h2>
            Start LuminaOS <span>-&gt;</span>
          </h2>
          <p>
           Feel the power of Illumination.
          </p>
        </Link>

        <Link
          href="/learn"
          className={styles.card}
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>
            Learn about LuminaOS.
          </p>
        </Link>

        <Link
          href="/contact"
          className={styles.card}
        >
          <h2>
            Contact Us <span>-&gt;</span>
          </h2>
          <p>
            Reach us quickly by contacting us.
          </p>
        </Link>

        <Link
          href="/signup"
          className={styles.card}
        >
          <h2>
            Create Account <span>-&gt;</span>
          </h2>
          <p>
            Create an account to embark on Your Lumina journey.
          </p>
        </Link>
      </div>
    </main>
  )
} 