import React from 'react'
import { FaYoutube, FaFacebookF, FaInstagram, FaTwitter,FaTiktok } from "react-icons/fa";
import { AiOutlineMail, AiOutlineWhatsApp } from "react-icons/ai";

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footer}>
        <div className={styles.supportCont}>
            <h1 className={styles.supporTitle}>פרטי התקשרות</h1>
            <div className={styles.LinksCont}>
                <div className={styles.SupContainer}>
                    <AiOutlineMail className={styles.SupIcon}/>
                    <p className={styles.supLinks}>shekemElectirc@shopify.com</p>
                </div>
                <div className={styles.SupContainer}>
                    <AiOutlineWhatsApp className={styles.SupIcon}/>
                    <p className={styles.supLinks}>+972-784-384-733</p>
                </div>
            </div>
        </div>


        <div className={styles.row}>
            <p className={styles.socialTitle}>
                עקבו אחרינו ברשתות
            </p>
        </div>
        <div className={styles.footDiv}>
            <a href="https://instagram.com" rel="noreferrer">
                <FaInstagram className={styles.logo} />
            </a>
            <a href="https://youtube.com" rel="noreferrer">
                <FaYoutube className={styles.logo} />
            </a>
            <a href="https://facebook.com" rel="noreferrer">
                <FaFacebookF className={styles.logo} />
            </a>
        </div>

        <div className={styles.row}>
            <p className={styles.copyright}>
                &copy;{new Date().getFullYear()} CodeTeamToSaveTheWorld | All rights Reseved | Terms of Service | Terms of Privacy | Refund Policy
            </p>
        </div>
    </div>
  )
}

export default Footer