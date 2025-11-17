'use client';

export default function Error({ error }) {
  return (
    <main className={ error }>
      <h4>An error has occurred!</h4>
      <p>Unable to retrieve Meals data from the database.</p>
    </main>
  )
}