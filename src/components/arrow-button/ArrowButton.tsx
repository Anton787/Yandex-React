import arrow from 'src/images/arrow.svg';
import styles from './ArrowButton.module.scss';
import clsx from 'clsx';

export type ArrowButtonProps = {
	onClick: () => void;
	isOpen: boolean;
};

export const ArrowButton = ({ onClick, isOpen }: ArrowButtonProps) => {
	const arrowButtonStyle = clsx(styles.container, {
		[styles.container_open]: isOpen,
	});

	const arrowButtonImgStyle = clsx(styles.arrow, {
		[styles.arrow_open]: isOpen,
	});

	return (
		<div
			role='button'
			aria-label='Открыть/Закрыть форму параметров статьи'
			tabIndex={0}
			className={arrowButtonStyle}
			onClick={onClick}>
			<img src={arrow} alt='иконка стрелочки' className={arrowButtonImgStyle} />
		</div>
	);
};
