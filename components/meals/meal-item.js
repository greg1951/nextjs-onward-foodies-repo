import Link from 'next/link';
import Image from 'next/image';

import classes from './meal-item.module.css';

/* 
  In the Image component below, the "fill" attribute is provided because the image is 
    loaded from a database and the height/width of the image is not know here.
    (The images are uploaded by users.)
*/
export default function MealItem({ title, slug, image, summary, creator }) {

  // console.log(`in meal-item--> /meals/${ slug }`)

  return (
    <article className={ classes.meal }>
      <header>
        <div className={ classes.image }>
          <Image src={ image } alt={ title } fill />
        </div>
        <div className={ classes.headerText }>
          <h2>{ title }</h2>
          <p>by { creator }</p>
        </div>
      </header>
      <div className={ classes.content }>
        <p className={ classes.summary }>{ summary }</p>
        <div className={ classes.actions }>
          <Link href={ `/meals/${ slug }` }>View Blog Details</Link>
        </div>
      </div>
    </article>
  );
}