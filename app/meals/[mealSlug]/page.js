import { getMeal } from '@/lib/meals';
import styles from './page.module.css';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Shared Meal Details',
  description: 'This recipe was shared by the community',
};

export default async function MealDetails({ params }) {
  const { mealSlug } = await params;
  const mealBlog = getMeal(mealSlug);
  if (!mealBlog) {
    notFound();
  }
  const brInstructions = mealBlog.instructions.replace(/\n/g, '<br />');

  return (
    <>
      <header className={ styles.header }>
        <div className={ styles.image }>
          <Image src={ mealBlog.image } fill alt={ mealBlog.title } />
        </div>
        <div className={ styles.headerText }>
          <h1>{ mealBlog.title }</h1>
          <p className={ styles.creator }>
            by <a href={ `mailto:${ mealBlog.creator_email }` }>{ mealBlog.creator }</a>
          </p>
          <p className={ styles.summary }>{ mealBlog.summary }</p>
        </div>
      </header>
      <main>
        <p className={ styles.instructions } dangerouslySetInnerHTML={ {
          __html: brInstructions,
        } }>

        </p>
      </main>
    </>
  );
}