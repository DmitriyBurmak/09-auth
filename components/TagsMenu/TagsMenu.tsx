'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UITag } from '@/types/note';
import css from './TagsMenu.module.css';

const allTags: UITag[] = [
  'All',
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

const TagsMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuListRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();
  const currentPathSegment = pathname.split('/').pop()?.toLowerCase() || 'all';
  const activeTag: UITag =
    (allTags.find(tag => tag.toLowerCase() === currentPathSegment) as UITag) ||
    'All';
  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };
  const getTagHref = (tag: UITag) => {
    return `/notes/filter/${tag === 'All' ? 'all' : tag}`;
  };
  const handleContainerBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node)) {
        setIsOpen(false);
      }
    },
    []
  );
  const handleMenuListKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>) => {
      const menuItems = Array.from(
        menuListRef.current?.querySelectorAll('a[role="menuitem"]') || []
      ) as HTMLAnchorElement[];
      const currentFocusedIndex = menuItems.findIndex(
        item => item === document.activeElement
      );

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (menuItems.length > 0) {
            const nextIndex = (currentFocusedIndex + 1) % menuItems.length;
            menuItems[nextIndex]?.focus();
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (menuItems.length > 0) {
            const prevIndex =
              (currentFocusedIndex - 1 + menuItems.length) % menuItems.length;
            menuItems[prevIndex]?.focus();
          }
          break;
        case 'Home':
          event.preventDefault();
          menuItems[0]?.focus();
          break;
        case 'End':
          event.preventDefault();
          menuItems[menuItems.length - 1]?.focus();
          break;
        default:
          break;
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const firstMenuItem = menuListRef.current?.querySelector(
          'a[role="menuitem"]'
        ) as HTMLAnchorElement;
        firstMenuItem?.focus();
      }, 0);
    } else {
      buttonRef.current?.focus();
    }
  }, [isOpen]);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    toggleMenu();
  };

  return (
    <div
      className={css.menuContainer}
      onBlur={handleContainerBlur}
      ref={menuContainerRef}
    >
      <button
        ref={buttonRef}
        className={css.menuButton}
        onClick={handleButtonClick}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="tags-menu"
      >
        {activeTag} ▾
      </button>
      {isOpen && (
        <ul
          id="tags-menu"
          ref={menuListRef}
          className={css.menuList}
          role="menu"
          tabIndex={-1}
          onKeyDown={handleMenuListKeyDown}
        >
          {allTags.map(tag => (
            <li key={tag} className={css.menuItem} role="none">
              <Link
                href={getTagHref(tag)}
                className={`${css.menuLink} ${activeTag === tag ? css.active : ''}`}
                onClick={() => setIsOpen(false)}
                role="menuitem"
                tabIndex={0}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
