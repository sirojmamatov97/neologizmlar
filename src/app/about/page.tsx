import Link from "next/link";
import { type CSSProperties } from "react";

export default function AboutPage() {
  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <Link href="/" style={styles.backLink}>
          ← Bosh sahifa
        </Link>

        <div style={styles.card}>
          <p style={styles.label}>neologizmlar.uz</p>

          <h1 style={styles.title}>Loyiha haqida</h1>

          <p style={styles.text}>
            <b>
              «O‘zbek tili neologizmlari: axborot-qidiruv leksikografik
              resursi»
            </b>{" "}
            — zamonaviy o‘zbek tilidagi yangi so‘zlar, iboralar va semantik
            neologizmlarni jamlash, izlash hamda ilmiy o‘rganishga mo‘ljallangan
            raqamli platformadir.
          </p>

          <p style={styles.text}>
            Loyiha mustaqil tadqiqotchi, o‘qituvchi{" "}
            <b>Vapayeva Anaxon Nasurillayevna</b> tomonidan{" "}
            <b>
              «O‘zbek va rus tillaridagi neologizmlarning qiyosiy-chog‘ishtirma
              tahlili»
            </b>{" "}
            mavzusidagi filologiya fanlari bo‘yicha falsafa doktori (PhD)
            darajasini olish uchun yozilgan dissertatsiya doirasida yaratilgan.
          </p>

          <p style={styles.text}>
            Resursda o‘zbek tiliga turli davrlarda kirib kelgan yoki tilning
            ichki imkoniyatlari asosida shakllangan, izohli lug‘atlarda hali
            to‘liq qayd etilmagan innovatsion birliklar jamlanadi. Materiallar
            lug‘atlar, OAV, jonli nutq va ilmiy manbalar asosida shakllantiriladi.
          </p>

          <p style={styles.text}>
            Platformaning asosiy maqsadi — o‘zbek tili neologizmlarini semantik
            guruhlar, paydo bo‘lish davri, o‘zlashish manbayi kabi mezonlar
            asosida tizimlashtirish va tadqiqotchilar uchun qulay ilmiy manba
            yaratishdir.
          </p>

          <p style={styles.text}>
            Resurs tilshunoslar, leksikologlar, leksikograflar,
            professor-o‘qituvchilar, talabalar hamda o‘zbek tili taraqqiyoti
            bilan qiziquvchi barcha foydalanuvchilar uchun mo‘ljallangan.
          </p>

          <div style={styles.contactBox}>
            <h2 style={styles.contactTitle}>Kontaktlar</h2>

            <p style={styles.contactText}>
              Elektron pochta:{" "}
              <a href="mailto:anechkavapayeva@gmail.com" style={styles.email}>
                anechkavapayeva@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f7f8fb",
    padding: "32px 18px 70px",
    color: "#172033",
  },

  container: {
    maxWidth: 920,
    margin: "0 auto",
  },

  backLink: {
    display: "inline-block",
    marginBottom: 18,
    color: "#2563eb",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 700,
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e6e9f0",
    borderRadius: 28,
    padding: "36px",
    boxShadow: "0 14px 40px rgba(15, 23, 42, 0.06)",
  },

  label: {
    margin: "0 0 10px",
    color: "#2563eb",
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  title: {
    margin: "0 0 24px",
    fontSize: 42,
    lineHeight: 1.1,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  text: {
    margin: "0 0 18px",
    color: "#344054",
    fontSize: 18,
    lineHeight: 1.8,
  },

  contactBox: {
    marginTop: 30,
    padding: 22,
    borderRadius: 20,
    background: "#f8fafc",
    border: "1px solid #e6e9f0",
  },

  contactTitle: {
    margin: "0 0 10px",
    fontSize: 22,
    fontWeight: 850,
  },

  contactText: {
    margin: 0,
    color: "#475467",
    fontSize: 17,
    lineHeight: 1.7,
  },

  email: {
    color: "#2563eb",
    fontWeight: 800,
    textDecoration: "none",
  },
};