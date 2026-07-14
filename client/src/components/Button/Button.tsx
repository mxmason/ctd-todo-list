import cn from "clsx";
import * as React from "react";

import style from "./Button.module.css";

export interface ButtonProps extends React.ComponentProps<"button"> {
	variant?: "primary";
}

const CLASSNAME_BY_VARIANT = {
	primary: style.primary,
} satisfies Record<NonNullable<ButtonProps["variant"]>, string>;

export function Button({ children, className, variant, ...rest }: ButtonProps) {
	const composedClassName = cn(
		className,
		style.root,
		variant && CLASSNAME_BY_VARIANT[variant],
	);

	return (
		<button {...rest} className={composedClassName}>
			{children}
		</button>
	);
}
