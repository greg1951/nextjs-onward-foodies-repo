import style from './meals-grid.module.css';
import MealItem from './meal-item';

export default function MealsGrid({ meals }) {
  return (
    <ul className={ style.meals }>
      { meals.map((meal) =>
        <li key={ meal.id }>
          <MealItem { ...meal } />
        </li>
      ) }
    </ul>
  );
}