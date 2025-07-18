import type { UITag } from '@/types/note';
import css from './SidebarNotes.module.css';
import SidebarLinkClient from './SidebarLinkClient';

const allTags: UITag[] = [
  'All',
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

const getTagHref = (tag: UITag) => {
  return `/notes/filter/${tag === 'All' ? 'all' : tag}`;
};

export default async function DefaultSidebar() {
  return (
    <nav className={css.sidebar}>
      <h3 className={css.sidebarTitle}>Фільтр за тегами</h3>
      <ul className={css.menuList}>
        {allTags.map(tag => (
          <li
            key={tag}
            className={tag === 'All' ? css.menuItemAll : css.menuItem}
          >
            <SidebarLinkClient href={getTagHref(tag)} tag={tag} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
