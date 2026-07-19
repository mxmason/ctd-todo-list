import cn from "clsx";
import * as React from "react";

import styles from "./Button.module.css";
type ButtonStyles = typeof styles;

export interface ButtonProps extends React.ComponentProps<"button"> {
	variant?: "primary";
}

const CLASSNAME_BY_VARIANT: Record<
	NonNullable<ButtonProps["variant"]>,
	ButtonStyles[keyof ButtonStyles]
> = {
	primary: styles.primary,
};

export function Button({
	children,
	className,
	tabIndex = 0,
	variant,
	...rest
}: ButtonProps) {
	return (
		<button
			{...rest}
			className={cn(
				styles.root,
				variant && CLASSNAME_BY_VARIANT[variant],
				className,
			)}
			tabIndex={tabIndex}
		>
			{children}
		</button>
	);
}
