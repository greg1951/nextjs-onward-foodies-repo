
import Link from 'next/link';

import styles from './page.module.css';
import ImageSlideshow from '@/components/images/image-slideshow';

export const metadata = {
  title: 'Family Social Recipes Home Page',
  description: 'Welcome to the recipes home page.',
};

export default function Home() {
  return (
    <>
      <header className={ styles.header }>
        <div className={ styles.slideshow }>
          <ImageSlideshow />
        </div>
        <div>
          <div className={ styles.hero }>
            <h1>Family Social Recipes for Real Foodies</h1>
            <p>Taste & share food from all over the world.</p>
          </div>
          <div className={ styles.cta }>
            <Link href="/community">Join the Community</Link>
            <Link href="/meals">Explore Meals</Link>
          </div>
        </div>
      </header>
      <main>
        <section className={ styles.section }>
          <h2>How it works</h2>
          <p>
            Family Social Recipes is a platform for foodies to share their favorite
            recipes with the world. It&apos;s a place to discover new dishes, and to
            connect with other food lovers.
          </p>
          <p>
            Family Social Recipes is a place to discover new dishes, and to connect
            with other food lovers.
          </p>
        </section>

        <section className={ styles.section }>
          <h2>Why Family Social?</h2>
          <p>
            The Family Social platform lets foodies to share their favorite recipes with the world
            but also a place where you can share movies and TV Shows that you like.
          </p>
        </section>
      </main>
    </>
  );
}