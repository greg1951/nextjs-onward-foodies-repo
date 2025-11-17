
import Link from "next/link";
import Image from "next/image";
import logoImg from '@/assets/logo.png';
import styles from './main-header.module.css';
import MainHeaderBackground from "./main-header-background";
import NavLink from "./nav-link";


export default function MainHeader() {

  return (
    <>
      <MainHeaderBackground />
      <header className={ styles.header }>
        <Link href="/" alt="A plate with food" className={ styles.logo }>
          <Image src={ logoImg } alt="A plate with food" priority />
          Nextlevel Food
        </Link>
        <nav className={ styles.nav }>
          <ul>
            <NavLink href="/meals">
              Browse Meals
            </NavLink>
            <NavLink href="/community">
              Foodies Community
            </NavLink>
          </ul>
        </nav>
      </header>
    </>
  );

}