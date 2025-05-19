import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';
import { Select } from 'components/select';
import { RadioGroup } from 'components/radio-group';
import { Separator } from 'components/separator';
import { Text } from 'components/text';
import { Spacing } from 'components/spacing';
import { useRef, useState } from 'react';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';
import {
	ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
} from 'src/constants/articleProps';
import { useOutsideClickClose } from 'components/select/hooks/useOutsideClickClose';

type ArticleParamsFormProps = {
	articleState: ArticleStateType;
	setArticleState: (props: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	articleState,
	setArticleState,
}: ArticleParamsFormProps) => {
	const [isSidebarOpen, setSidebarIsOpen] = useState(false);
	const [formState, setFormState] = useState(articleState);

	const handleChange = <K extends keyof ArticleStateType>(
		field: K,
		value: ArticleStateType[K]
	) => {
		setFormState((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setArticleState(formState);
		setSidebarIsOpen(false);
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
		setArticleState(defaultArticleState);
	};

	const aSide = useRef<HTMLDivElement | null>(null);

	useOutsideClickClose({
		isOpen: isSidebarOpen,
		rootRef: aSide,
		onClose: () => setSidebarIsOpen(false),
	});

	return (
		<div ref={aSide}>
			<ArrowButton
				onClick={() => setSidebarIsOpen(!isSidebarOpen)}
				isOpen={isSidebarOpen}
			/>
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isSidebarOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Spacing size={50} />
					<Select
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						title='шрифт'
						onChange={(value) => handleChange('fontFamilyOption', value)}
					/>
					<Spacing size={50} />
					<RadioGroup
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						name='fontSize'
						title='размер шрифта'
						onChange={(value) => handleChange('fontSizeOption', value)}
					/>
					<Spacing size={50} />
					<Select
						selected={formState.fontColor}
						options={fontColors}
						title='цвет шрифта'
						onChange={(value) => handleChange('fontColor', value)}
					/>
					<Spacing size={50} />
					<Separator />
					<Spacing size={50} />
					<Select
						selected={formState.backgroundColor}
						options={backgroundColors}
						title='цвет фона'
						onChange={(value) => handleChange('backgroundColor', value)}
					/>
					<Spacing size={50} />
					<Select
						selected={formState.contentWidth}
						options={contentWidthArr}
						title='ширина контента'
						onChange={(value) => handleChange('contentWidth', value)}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='reset' />
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</div>
	);
};
