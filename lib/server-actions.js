'use server';

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

export async function shareMealAction(formData) {
  const meal = {
    title: formData.get('title'),
    creator: formData.get('name'),
    creatorEmail: formData.get('email'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
  }

  // built in delay response to test useFormStatus messaging
  await new Promise((resolve) => setTimeout(resolve, 1000));

  saveMeal(meal);
  revalidatePath('/meals', 'page');
  redirect('/meals');
}
