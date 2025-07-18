import css from './Empty.module.css';

interface EmptyProps {
  message?: string;
}

export default function Empty({ message = 'Nothing found.' }: EmptyProps) {
  return <p className={css.empty}>{message}</p>;
}
