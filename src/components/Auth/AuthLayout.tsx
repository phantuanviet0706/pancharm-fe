import { url } from 'inspector';
import React from 'react';

interface AuthLayoutProps {
	children: React.ReactNode;
	imgSrc: string;
	formPosition?: 'left' | 'right';
}

export default function AuthLayout({ children, imgSrc, formPosition = 'left' }: AuthLayoutProps) {
	const formElement = <div className={'page-wrapper page-' + formPosition}>{children}</div>;
	const imgElement = ``;

	return (
		<div className="page-container" style={{ backgroundImage: `url(${imgSrc})` }}>
			{formPosition === 'left'
				? [<React.Fragment key="form">{formElement}</React.Fragment>, <React.Fragment key="image">{imgElement}</React.Fragment>]
				: [<React.Fragment key="image">{imgElement}</React.Fragment>, <React.Fragment key="form">{formElement}</React.Fragment>]}
		</div>
	);
}
