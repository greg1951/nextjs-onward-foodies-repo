import Link from "next/link";
import { Suspense } from 'react';
import styles from './page.module.css';
import MealsGrid from "@/components/meals/meals-grid";
import { getMeals } from "@/lib/meals";

export const metadata = {
  title: 'Get Meals Page',
  description: 'A list of the shared meals appears on this page',
};


export default function MealsPage() {

  async function GetMeals() {
    const meals = await getMeals();
    return (
      <MealsGrid meals={ meals } />
    );
  }

  return (
    <>
      <header className={ styles.header }>
        <h1>
          Delicious meals, created{ ' ' }
          <span className={ styles.highlight }>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself. It&apos;s easy and fun!
        </p>
        <p className={ styles.cta }>
          <Link href="/meals/share">
            Share Your Favorite Recipe
          </Link>
        </p>
      </header>
      <main className={ styles.main }>
        <Suspense fallback={ <p className={ styles.loading }>Loading meals...</p> }>
          <GetMeals />
        </Suspense>
      </main>
    </>
  );
} 