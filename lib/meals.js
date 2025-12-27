import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import fs from 'node:fs';

const db = sql('meals.db');

export async function getMeals() {
  //await new Promise((resolve) => setTimeout(resolve, 1000));
  // throw new error("Something bad happened in getMeals function...");
  return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
  console.log(`getMeal--> ${ slug }`);
  const blog = db.prepare('SELECT * FROM meals WHERE slug=?').get(slug);
  return blog;
}

export async function saveMeal(meal) {
  const slug = slugify(meal.title, { lower: true, strict: true, trim: true })

  const newInstructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const imageFilename = `${ slug }.${ extension }`;
  const newImagePath = `/images/${ imageFilename }`;

  const bufferedImage = await meal.image.arrayBuffer();
  const stream = fs.createWriteStream(`public${ newImagePath }`);
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Error when saving the image")
    }
  });

  const insertSql = 'INSERT INTO meals'
    + ' (id, title, slug, creator, creator_email, summary, instructions, image)'
    + ' VALUES(@id, @title, @slug, @creator, @creator_email, @summary, @instructions, @image)';

  const insertStatement = db.prepare(insertSql);
  const params = {
    id: null,
    title: meal.title,
    slug: slug,
    creator: meal.creator,
    creator_email: meal.creatorEmail,
    summary: meal.summary,
    instructions: newInstructions,
    image: newImagePath
  };

  const result = insertStatement.run(params);
}
