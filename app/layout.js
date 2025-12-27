import MainHeaderBackground from '@/components/main-header/main-header-background';
import './globals.css';
import MainHeader from "@/components/main-header/main-header";

export const metadata = {
  title: 'Family Social Recipes',
  description: 'Delicious meals, shared by a food-loving community.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainHeader />
        { children }
      </body>
    </html>
  );
}
