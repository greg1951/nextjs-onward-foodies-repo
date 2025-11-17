import sql from 'better-sqlite3';
const db = sql('meals.db');
/* 
  The all method below is a run command but for all rows method.
  The async method is not necessary here but added to create a promise the React server side
    component's use of the async keyword. 
  The 
*/
export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // throw new error("Something bad happened in getMeals function...");
  return db.prepare('SELECT * FROM meals').all();
}

/* Use bind parameter to avoid sql injection issue */
export function getMeal(slug) {
  // console.log(`getMeal--> ${ slug }`);
  const blog = db.prepare('SELECT * FROM meals WHERE slug=?').get(slug);
  return blog;
}