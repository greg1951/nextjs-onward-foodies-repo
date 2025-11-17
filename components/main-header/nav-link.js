'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './nav-link.module.css';

export default function NavLink({ href, children }) {
  const pathName = usePathname();
  return (
    <li>
      <Link
        href={ href }
        className={ pathName.startsWith(href) ? styles.active : undefined }>
        { children }
      </Link>
    </li>

  );
}