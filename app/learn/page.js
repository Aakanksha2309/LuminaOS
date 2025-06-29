import styles from '@/styles/Learn.module.css'

export const metadata = {
  title: 'Learn about LuminaOS',
  description: 'Learn about LuminaOS and SparkUs',
}

export default function Learn() {
  return (
    <div className={styles.main}>
      <h2>Learn about LuminaOS</h2>
      <br/>
      <br/>
      <p className={styles.p}>LuminaOS is made by SparkUs which is an Indian Brand.</p>
      <br/>
      <h2>About SparkUs</h2>
      <br/>
      <br/>
      <p>SparkUs tries to provided best quality products and Operating Systems.</p>
      <br/>
      <h2>About LuminaOS</h2>
      <br/>
      <br/>
      <p>LuminaOS is a desktop Operating System which have almost all the needs of people. Currently LuminaOS is at Version 1.1 and will get updates in future. For now LuminaOS only have apps provided by SparkUs but many apps will be added in LuminaOS's Store.</p>
    </div>
  )
} 